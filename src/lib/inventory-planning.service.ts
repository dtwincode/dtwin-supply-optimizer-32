
/**
 * Inventory Planning Service
 * Handles fetching and processing inventory planning data
 */

// Mock data for inventory planning view
const mockInventoryPlanningData = [
  {
    id: 1,
    sku: "SKU001",
    product_name: "Product A",
    category: "Electronics",
    subcategory: "Mobile Phones",
    location_id: "WH001",
    channel_id: "B2C",
    current_stock_level: 120,
    average_daily_usage: 10,
    min_stock_level: 30,
    max_stock_level: 150,
    reorder_level: 50,
    safety_stock: 20,
    lead_time_days: 5,
    decoupling_point: true,
    buffer_status: "GREEN",
    red_zone: 30,
    yellow_zone: 40,
    green_zone: 80
  },
  {
    id: 2,
    sku: "SKU002",
    product_name: "Product B",
    category: "Electronics",
    subcategory: "Laptops",
    location_id: "WH001",
    channel_id: "B2B",
    current_stock_level: 25,
    average_daily_usage: 5,
    min_stock_level: 30,
    max_stock_level: 100,
    reorder_level: 40,
    safety_stock: 15,
    lead_time_days: 7,
    decoupling_point: false,
    buffer_status: "RED",
    red_zone: 20,
    yellow_zone: 30,
    green_zone: 50
  },
  {
    id: 3,
    sku: "SKU003",
    product_name: "Product C",
    category: "Clothing",
    subcategory: "T-shirts",
    location_id: "WH002",
    channel_id: "B2C",
    current_stock_level: 200,
    average_daily_usage: 8,
    min_stock_level: 50,
    max_stock_level: 180,
    reorder_level: 70,
    safety_stock: 30,
    lead_time_days: 3,
    decoupling_point: true,
    buffer_status: "YELLOW",
    red_zone: 40,
    yellow_zone: 50,
    green_zone: 90
  }
];

/**
 * Fetch inventory planning view data
 * In a real application, this would call an API
 */
export const fetchInventoryPlanningView = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockInventoryPlanningData;
};

/**
 * Update buffer levels for a specific product
 */
export const updateBufferLevels = async (
  productId: number, 
  updates: {
    min_stock_level?: number;
    max_stock_level?: number;
    safety_stock?: number;
  }
) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real application, this would send the updates to an API
  console.log(`Updating buffer levels for product ${productId}:`, updates);
  
  return { success: true };
};
