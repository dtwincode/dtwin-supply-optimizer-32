import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Product popularity based on category
const categoryPopularity: Record<string, number> = {
  'Beef Burgers': 1.0,
  'Chicken Burgers': 0.95,
  'Sandwiches/Wraps': 0.8,
  'Sides & Appetizers': 1.2,
  'Bestsellers/Limited Offers': 0.9,
  'Gathering Boxes': 0.4,
  'Sauces': 0.6,
};

// Day of week multipliers (0 = Sunday, 6 = Saturday)
const dayOfWeekMultipliers = [1.0, 0.85, 0.9, 0.95, 1.1, 1.3, 1.2];

// Seasonal multipliers by month (0-11)
const seasonalMultipliers = [0.9, 0.95, 1.0, 1.05, 0.7, 1.2, 1.3, 1.25, 1.1, 1.0, 0.95, 0.9];

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

    const salesData: any[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Generate data for each day
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const currentDate = new Date(d);
      const dayOfWeek = currentDate.getDay();
      const month = currentDate.getMonth();
      const dayMultiplier = dayOfWeekMultipliers[dayOfWeek];
      const seasonMultiplier = seasonalMultipliers[month];
      const dateString = currentDate.toISOString().split('T')[0];

      // For each location
      for (const location of locations) {
        // Location multiplier based on characteristics
        let locationMult = 1.0;
        if (location.seating_capacity) {
          locationMult = location.seating_capacity / 60;
        }
        if (location.drive_thru) {
          locationMult *= 1.2;
        }
        
        // Regional adjustments
        if (location.region?.includes('Makkah')) locationMult *= 1.5;
        if (location.region?.includes('Riyadh')) locationMult *= 1.3;
        if (location.region?.includes('Jeddah')) locationMult *= 1.4;

        // For each product
        for (const product of products) {
          const categoryPop = categoryPopularity[product.category || 'Other'] || 0.7;
          const baseVolume = 30;

          const randomVariation = 0.75 + Math.random() * 0.5;
          const quantity = Math.round(
            baseVolume * 
            categoryPop * 
            locationMult * 
            dayMultiplier * 
            seasonMultiplier * 
            randomVariation
          );

          if (quantity < 3) continue;

          let unitPrice = 20.0;
          if (product.category?.includes('Gathering')) unitPrice = 45.0;
          if (product.category?.includes('Beef')) unitPrice = 25.0;
          if (product.category?.includes('Chicken')) unitPrice = 22.0;
          if (product.category?.includes('Sides')) unitPrice = 10.0;
          if (product.category?.includes('Sauces')) unitPrice = 5.0;
          
          unitPrice = unitPrice * (0.9 + Math.random() * 0.2);

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
