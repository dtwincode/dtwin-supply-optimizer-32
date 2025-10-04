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

export async function generateRealisticHistoricalSales(days: number = 90) {
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
        locationMult = location.seating_capacity / 60; // Normalize around 60 seats
      }
      if (location.drive_thru) {
        locationMult *= 1.2; // Drive-thru locations get 20% boost
      }
      
      // Regional adjustments
      if (location.region?.includes('Makkah')) locationMult *= 1.5;
      if (location.region?.includes('Riyadh')) locationMult *= 1.3;
      if (location.region?.includes('Jeddah')) locationMult *= 1.4;

      // For each product
      for (const product of products) {
        const categoryPop = categoryPopularity[product.category || 'Other'] || 0.7;
        const baseVolume = 30; // Base daily sales per product per location

        // Calculate quantity with all multipliers + random variation (±25%)
        const randomVariation = 0.75 + Math.random() * 0.5; // 0.75 to 1.25
        const quantity = Math.round(
          baseVolume * 
          categoryPop * 
          locationMult * 
          dayMultiplier * 
          seasonMultiplier * 
          randomVariation
        );

        // Skip if quantity is too low (realistic - not all products sold daily everywhere)
        if (quantity < 3) continue;

        // Estimate unit price based on category
        let unitPrice = 20.0;
        if (product.category?.includes('Gathering')) unitPrice = 45.0;
        if (product.category?.includes('Beef')) unitPrice = 25.0;
        if (product.category?.includes('Chicken')) unitPrice = 22.0;
        if (product.category?.includes('Sides')) unitPrice = 10.0;
        if (product.category?.includes('Sauces')) unitPrice = 5.0;
        
        // Add random variation to price (±10%)
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
