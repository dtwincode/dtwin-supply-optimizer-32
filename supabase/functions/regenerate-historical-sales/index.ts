import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Fetch configuration from database
async function fetchSalesConfig(supabase: any) {
  const { data, error } = await supabase
    .from('sales_pattern_config')
    .select('config_type, config_key, multiplier')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching sales config:', error);
    throw new Error(`Failed to fetch sales configuration: ${error.message}`);
  }

  const config = {
    categoryPopularity: {} as Record<string, number>,
    dayOfWeekMultipliers: {} as Record<string, number>,
    seasonalMultipliers: {} as Record<string, number>,
    regionalMultipliers: {} as Record<string, number>,
    baseVolume: 30, // default
    seatingCapacityNormalizer: 60,
    driveThruBoost: 1.2,
    randomVariationMin: 0.75,
    randomVariationRange: 0.5,
    minimumQuantityThreshold: 3,
    defaultFallbackPrice: 20.0,
    priceVariationMin: 0.9,
    priceVariationRange: 0.2
  };

  data.forEach((item: any) => {
    switch (item.config_type) {
      case 'category':
        config.categoryPopularity[item.config_key] = item.multiplier;
        break;
      case 'day_of_week':
        config.dayOfWeekMultipliers[item.config_key] = item.multiplier;
        break;
      case 'seasonal':
        config.seasonalMultipliers[item.config_key] = item.multiplier;
        break;
      case 'regional':
        config.regionalMultipliers[item.config_key] = item.multiplier;
        break;
      case 'base_volume':
        config.baseVolume = item.multiplier;
        break;
      case 'location_calc':
        if (item.config_key === 'seating_capacity_normalizer') config.seatingCapacityNormalizer = item.multiplier;
        if (item.config_key === 'drive_thru_boost') config.driveThruBoost = item.multiplier;
        break;
      case 'quantity_calc':
        if (item.config_key === 'random_variation_min') config.randomVariationMin = item.multiplier;
        if (item.config_key === 'random_variation_range') config.randomVariationRange = item.multiplier;
        if (item.config_key === 'minimum_quantity_threshold') config.minimumQuantityThreshold = item.multiplier;
        break;
      case 'price_calc':
        if (item.config_key === 'default_fallback_price') config.defaultFallbackPrice = item.multiplier;
        if (item.config_key === 'price_variation_min') config.priceVariationMin = item.multiplier;
        if (item.config_key === 'price_variation_range') config.priceVariationRange = item.multiplier;
        break;
    }
  });

  return config;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { days = 90 } = await req.json();

    console.log(`Generating ${days} days of historical sales data...`);
    
    // Clear existing data first (batched deletion to avoid timeout)
    console.log('Clearing old historical sales data...');
    const batchSize = 500; // Smaller batch size to prevent timeout
    let deletedTotal = 0;
    let hasMore = true;

    while (hasMore) {
      // Select IDs to delete (with ORDER BY to satisfy PostgREST)
      const { data: idsToDelete, error: selectError } = await supabase
        .from('historical_sales_data')
        .select('sales_id')
        .order('sales_id')
        .limit(batchSize);

      if (selectError) {
        throw new Error(`Failed to select records: ${selectError.message}`);
      }

      if (!idsToDelete || idsToDelete.length === 0) {
        break;
      }

      // Delete by specific IDs in smaller chunks
      const ids = idsToDelete.map((item: any) => item.sales_id);
      const { error: deleteError } = await supabase
        .from('historical_sales_data')
        .delete()
        .in('sales_id', ids);

      if (deleteError) {
        throw new Error(`Failed to delete batch: ${deleteError.message}`);
      }

      deletedTotal += idsToDelete.length;
      console.log(`Deleted ${deletedTotal} records...`);

      // If we got fewer records than batchSize, we're done
      hasMore = idsToDelete.length === batchSize;
    }

    console.log(`Cleared ${deletedTotal} old records`);

    // Fetch sales configuration from database
    const config = await fetchSalesConfig(supabase);
    console.log('Sales configuration loaded:', {
      categories: Object.keys(config.categoryPopularity).length,
      baseVolume: config.baseVolume
    });

    // Fetch ONLY finished goods products
    const { data: products, error: productsError } = await supabase
      .from('product_master')
      .select('product_id, sku, name, category')
      .eq('product_type', 'FINISHED_GOOD');

    if (productsError || !products) {
      throw new Error(`Failed to fetch products: ${productsError?.message}`);
    }

    console.log(`Found ${products.length} finished goods products`);

    // Fetch all locations
    const { data: locations, error: locationsError } = await supabase
      .from('location_master')
      .select('location_id, region, seating_capacity, drive_thru');

    if (locationsError || !locations) {
      throw new Error(`Failed to fetch locations: ${locationsError?.message}`);
    }

    console.log(`Found ${locations.length} locations`);

    // Fetch all product prices once (batch)
    const { data: allPrices, error: pricesError } = await supabase
      .from('product_pricing-master')
      .select('product_id, price, effective_date')
      .order('effective_date', { ascending: false });

    if (pricesError) {
      console.warn('Failed to fetch prices:', pricesError);
    }

    // Build price lookup map (latest price per product)
    const priceMap: Record<string, number> = {};
    allPrices?.forEach((p: any) => {
      if (!priceMap[p.product_id]) {
        priceMap[p.product_id] = p.price;
      }
    });

    console.log(`Loaded ${Object.keys(priceMap).length} product prices`);

    // Create realistic product popularity using Pareto distribution (80-20 rule)
    // Top 20% of products should generate ~80% of volume
    const productPopularityMap: Record<string, number> = {};
    const sortedProducts = [...products].sort(() => Math.random() - 0.5); // Shuffle for randomness
    
    sortedProducts.forEach((product, index) => {
      const percentile = (index + 1) / sortedProducts.length;
      
      // Power law distribution: y = x^(-alpha)
      // Alpha = 1.161 gives roughly 80-20 distribution
      // Higher percentile = lower popularity (except we invert it)
      const alpha = 1.161;
      const popularity = Math.pow(1 - percentile, -alpha);
      
      // Normalize to range 0.1 to 3.0
      // Top products get 3x multiplier, bottom products get 0.1x
      const normalizedPopularity = 0.1 + (popularity / 2.5);
      productPopularityMap[product.product_id] = Math.min(3.0, normalizedPopularity);
    });

    console.log('Product popularity distribution created (Pareto 80-20 rule)');
    console.log(`Top product multiplier: ${Math.max(...Object.values(productPopularityMap)).toFixed(2)}x`);
    console.log(`Bottom product multiplier: ${Math.min(...Object.values(productPopularityMap)).toFixed(2)}x`);

    const salesData: any[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Generate data for each day
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      const dayOfWeek = currentDate.getDay();
      const month = currentDate.getMonth();
      const dayMultiplier = config.dayOfWeekMultipliers[dayOfWeek.toString()] || 1.0;
      const seasonMultiplier = config.seasonalMultipliers[month.toString()] || 1.0;
      const dateString = currentDate.toISOString().split('T')[0];

      // For each location
      for (const location of locations) {
        // Location multiplier based on characteristics
        let locationMult = 1.0;
        if (location.seating_capacity) {
          locationMult = location.seating_capacity / config.seatingCapacityNormalizer;
        }
        if (location.drive_thru) {
          locationMult *= config.driveThruBoost;
        }
        
        // Regional adjustments - check for regional multipliers from config
        let regionalMult = config.regionalMultipliers['default'] || 1.0;
        for (const [regionKey, multiplier] of Object.entries(config.regionalMultipliers)) {
          if (regionKey !== 'default' && location.region?.includes(regionKey)) {
            regionalMult = multiplier;
            break;
          }
        }
        locationMult *= regionalMult;

        // For each product
        for (const product of products) {
          const categoryPop = config.categoryPopularity[product.category || 'Other'] || 
                              config.categoryPopularity['Other'] || 0.7;
          const baseVolume = config.baseVolume;
          
          // Get product-specific popularity (Pareto distribution)
          const productPopularity = productPopularityMap[product.product_id] || 1.0;

          // Calculate quantity with all multipliers + random variation + product popularity
          const randomVariation = config.randomVariationMin + Math.random() * config.randomVariationRange;
          const quantity = Math.round(
            baseVolume * 
            categoryPop * 
            productPopularity * // NEW: Product-level popularity factor
            locationMult * 
            dayMultiplier * 
            seasonMultiplier * 
            randomVariation
          );

          // Skip if quantity is too low
          if (quantity < config.minimumQuantityThreshold) continue;

          // Get price from pre-fetched price map
          let unitPrice = priceMap[product.product_id] || config.defaultFallbackPrice;
          
          // Add random variation (90-110% of base price) - NEW PER-TRANSACTION VARIATION
          const priceVariation = 0.90 + Math.random() * 0.20; // 90% to 110%
          unitPrice = unitPrice * priceVariation;

          const revenue = quantity * unitPrice;

          salesData.push({
            product_id: product.product_id,
            location_id: location.location_id,
            sales_date: dateString,
            quantity_sold: quantity,
            revenue: parseFloat(revenue.toFixed(2)),
            unit_price: parseFloat(unitPrice.toFixed(2)),
            transaction_type: 'SALE',
          });
        }
      }
    }

    console.log(`Generated ${salesData.length} sales records, inserting in batches...`);

    // Insert in batches of 500
    const batchSize = 500;
    let inserted = 0;

    for (let i = 0; i < salesData.length; i += batchSize) {
      const batch = salesData.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('historical_sales_data')
        .insert(batch);

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      inserted += batch.length;
      console.log(`Inserted ${inserted} / ${salesData.length} records`);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        totalRecords: inserted,
        message: `Successfully generated ${inserted} historical sales records for finished goods`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating historical sales:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
