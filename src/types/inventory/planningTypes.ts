export interface InventoryPlanningItem {
  product_id: string;
  location_id: string;
  lead_time_days: number;
  average_daily_usage: number;
  demand_variability: number;
  min_stock_level: number;
  safety_stock: number;
  max_stock_level: number;
  buffer_profile_id: string;
  decoupling_point: boolean;
}
