// Realistic Historical Sales Data Generator
// 90 days of sales with realistic patterns

export interface HistoricalSalesRecord {
  product_id: string;
  location_id: string;
  sales_date: string;
  quantity_sold: number;
  revenue: number;
  unit_price: number;
}

// Product base popularity scores (affects daily volume)
const productPopularity: Record<string, number> = {
  'FG-BURGER-CLASSIC': 1.0,  // Most popular
  'FG-BURGER-CHEESE': 0.95,
  'FG-BURGER-DELUXE': 0.7,   // Premium, less volume
  'FG-SANDWICH-CHICKEN': 0.8,
  'FG-SANDWICH-FISH': 0.6,
  'FG-FRIES-REGULAR': 1.2,   // Higher than burgers (side item)
  'FG-FRIES-LARGE': 0.8,
  'FG-DRINK-COLA': 1.1,
  'FG-DRINK-COFFEE': 0.9,
};

// Location multipliers based on characteristics
const locationMultipliers: Record<string, number> = {
  'LOC-RIYADH-001': 1.5,  // High traffic mall
  'LOC-RIYADH-002': 1.2,  // Medium traffic
  'LOC-JEDDAH-001': 1.4,  // Coastal high traffic
  'LOC-JEDDAH-002': 1.0,  // Average
  'LOC-DAMMAM-001': 1.1,  // Industrial area
  'LOC-MAKKAH-001': 1.8,  // Pilgrim traffic (very high)
};

// Day of week multipliers (0 = Sunday, 6 = Saturday)
const dayOfWeekMultipliers = [
  1.0,  // Sunday
  0.85, // Monday (lowest)
  0.9,  // Tuesday
  0.95, // Wednesday
  1.1,  // Thursday (start of weekend rush)
  1.3,  // Friday (peak - weekend + prayers)
  1.2,  // Saturday (weekend)
];

// Seasonal multipliers by month (1-12)
const seasonalMultipliers = [
  0.9,  // Jan - Post holiday
  0.95, // Feb
  1.0,  // Mar
  1.05, // Apr - Ramadan prep
  0.7,  // May - Ramadan (reduced daytime sales)
  1.2,  // Jun - Eid surge
  1.3,  // Jul - Summer peak
  1.25, // Aug - Summer
  1.1,  // Sep - Back to school
  1.0,  // Oct
  0.95, // Nov
  0.9,  // Dec
];

// Product unit prices (SAR)
const unitPrices: Record<string, number> = {
  'FG-BURGER-CLASSIC': 18.0,
  'FG-BURGER-CHEESE': 22.0,
  'FG-BURGER-DELUXE': 35.0,
  'FG-SANDWICH-CHICKEN': 25.0,
  'FG-SANDWICH-FISH': 28.0,
  'FG-FRIES-REGULAR': 8.0,
  'FG-FRIES-LARGE': 12.0,
  'FG-DRINK-COLA': 6.0,
  'FG-DRINK-COFFEE': 10.0,
};

function generateRealisticSalesData(): HistoricalSalesRecord[] {
  const salesData: HistoricalSalesRecord[] = [];
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 90); // 90 days back

  const products = Object.keys(productPopularity);
  const locations = Object.keys(locationMultipliers);

  // Generate data for each day
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d);
    const dayOfWeek = currentDate.getDay();
    const month = currentDate.getMonth();
    const dayMultiplier = dayOfWeekMultipliers[dayOfWeek];
    const seasonMultiplier = seasonalMultipliers[month];
    const dateString = currentDate.toISOString().split('T')[0];

    // For each location
    locations.forEach(locationId => {
      const locationMult = locationMultipliers[locationId];

      // For each product
      products.forEach(productId => {
        const productPop = productPopularity[productId];
        const baseVolume = 50; // Base daily sales per product per location

        // Calculate quantity with all multipliers + random variation (±20%)
        const randomVariation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
        const quantity = Math.round(
          baseVolume * 
          productPop * 
          locationMult * 
          dayMultiplier * 
          seasonMultiplier * 
          randomVariation
        );

        // Skip if quantity is too low (realistic - not all products sold daily everywhere)
        if (quantity < 5) return;

        const unitPrice = unitPrices[productId] || 20.0;
        const revenue = quantity * unitPrice;

        salesData.push({
          product_id: productId,
          location_id: locationId,
          sales_date: dateString,
          quantity_sold: quantity,
          revenue: parseFloat(revenue.toFixed(2)),
          unit_price: unitPrice,
        });
      });
    });
  }

  return salesData;
}

// Generate and export
export const realisticHistoricalSales = generateRealisticSalesData();

// CSV export helper
export function generateCSV(): string {
  const headers = 'product_id,location_id,sales_date,quantity_sold,revenue,unit_price\n';
  const rows = realisticHistoricalSales.map(record => 
    `${record.product_id},${record.location_id},${record.sales_date},${record.quantity_sold},${record.revenue},${record.unit_price}`
  ).join('\n');
  
  return headers + rows;
}

// Summary statistics
export function getSalesSummary() {
  const totalRecords = realisticHistoricalSales.length;
  const totalRevenue = realisticHistoricalSales.reduce((sum, r) => sum + r.revenue, 0);
  const totalQuantity = realisticHistoricalSales.reduce((sum, r) => sum + r.quantity_sold, 0);
  
  return {
    totalRecords,
    totalRevenue: totalRevenue.toFixed(2),
    totalQuantity,
    avgDailyRevenue: (totalRevenue / 90).toFixed(2),
    avgDailyQuantity: Math.round(totalQuantity / 90),
  };
}
