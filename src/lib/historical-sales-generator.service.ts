import { supabase } from "@/integrations/supabase/client";

interface ProductInfo {
  product_id: string;
  sku: string;
  name: string;
  category: string;
}

interface LocationInfo {
  location_id: string;
  region: string;
  seating_capacity: number | null;
  drive_thru: boolean | null;
}

interface SalesConfig {
  categoryPopularity: Record<string, number>;
  dayOfWeekMultipliers: Record<string, number>;
  seasonalMultipliers: Record<string, number>;
  regionalMultipliers: Record<string, number>;
  baseVolume: number;
  seatingCapacityNormalizer: number;
  driveThruBoost: number;
  randomVariationMin: number;
  randomVariationRange: number;
  minimumQuantityThreshold: number;
  defaultFallbackPrice: number;
  priceVariationMin: number;
  priceVariationRange: number;
}

// Fetch configuration from database
async function fetchSalesConfig(): Promise<SalesConfig> {
  const { data, error } = await supabase
    .from('sales_pattern_config')
    .select('config_type, config_key, multiplier')
    .eq('is_active', true);

  if (error) {
    throw new Error(`Failed to fetch sales configuration: ${error.message}`);
  }

  const config: SalesConfig = {
    categoryPopularity: {},
    dayOfWeekMultipliers: {},
    seasonalMultipliers: {},
    regionalMultipliers: {},
    baseVolume: 30,
    seatingCapacityNormalizer: 60,
    driveThruBoost: 1.2,
    randomVariationMin: 0.75,
    randomVariationRange: 0.5,
    minimumQuantityThreshold: 3,
    defaultFallbackPrice: 20.0,
    priceVariationMin: 0.9,
    priceVariationRange: 0.2
  };

  data?.forEach((item) => {
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

export async function generateRealisticHistoricalSales(days: number = 90) {
  // Fetch sales configuration from database
  const config = await fetchSalesConfig();

  // Fetch ONLY finished goods products (not raw materials or components)
  const { data: products, error: productsError } = await supabase
    .from('product_master')
    .select('product_id, sku, name, category')
    .eq('product_type', 'FINISHED_GOOD');

  if (productsError || !products) {
    throw new Error(`Failed to fetch products: ${productsError?.message}`);
  }

  // Fetch all locations
  const { data: locations, error: locationsError } = await supabase
    .from('location_master')
    .select('location_id, region, seating_capacity, drive_thru');

  if (locationsError || !locations) {
    throw new Error(`Failed to fetch locations: ${locationsError?.message}`);
  }

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
  allPrices?.forEach((p) => {
    if (!priceMap[p.product_id]) {
      priceMap[p.product_id] = p.price;
    }
  });

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

        // Calculate quantity with all multipliers + random variation
        const randomVariation = config.randomVariationMin + Math.random() * config.randomVariationRange;
        const quantity = Math.round(
          baseVolume * 
          categoryPop * 
          locationMult * 
          dayMultiplier * 
          seasonMultiplier * 
          randomVariation
        );

        // Skip if quantity is too low
        if (quantity < config.minimumQuantityThreshold) continue;

        // Get price from pre-fetched price map
        let unitPrice = priceMap[product.product_id] || config.defaultFallbackPrice;
        
        // Add random variation to price
        unitPrice = unitPrice * (config.priceVariationMin + Math.random() * config.priceVariationRange);

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

  return salesData;
}

export async function insertHistoricalSales(salesData: any[]) {
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

  return inserted;
}

export async function clearHistoricalSales() {
  const { error } = await supabase
    .from('historical_sales_data')
    .delete()
    .neq('sales_id', ''); // Delete all records

  if (error) {
    throw new Error(`Failed to clear historical sales: ${error.message}`);
  }
}

export async function getHistoricalSalesSummary() {
  const { data, error } = await supabase
    .from('historical_sales_data')
    .select('quantity_sold, revenue, sales_date');

  if (error) {
    throw new Error(`Failed to fetch summary: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return null;
  }

  const totalRecords = data.length;
  const totalRevenue = data.reduce((sum, r) => sum + (r.revenue || 0), 0);
  const totalQuantity = data.reduce((sum, r) => sum + (r.quantity_sold || 0), 0);
  
  // Calculate date range
  const dates = data.map(r => new Date(r.sales_date).getTime());
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));
  const daysCovered = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return {
    totalRecords,
    totalRevenue: totalRevenue.toFixed(2),
    totalQuantity,
    avgDailyRevenue: (totalRevenue / daysCovered).toFixed(2),
    avgDailyQuantity: Math.round(totalQuantity / daysCovered),
    dateRange: {
      start: minDate.toISOString().split('T')[0],
      end: maxDate.toISOString().split('T')[0],
      days: daysCovered,
    },
  };
}
