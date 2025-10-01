export interface InventoryPlanningItem {
  id?: number;
  sku: string;
  product_name: string;
  category: string;
  subcategory: string;
  location_id: string;
  channel_id: string;
  current_stock_level: number;
  average_daily_usage: number;
  min_stock_level: number;
  max_stock_level: number;
  reorder_level: number;
  safety_stock: number;
  lead_time_days: number;
  decoupling_point: boolean;
  buffer_status: string;
  red_zone: number;
  yellow_zone: number;
  green_zone: number;
  product_id?: string;
  buffer_profile_id?: string;
  
  // DDMRP specific fields
  demand_variability?: number;
  buffer_penetration?: number;
  net_flow_position?: number;
  qualified_demand?: number;
  on_order?: number;
  
  // Buffer zone thresholds (TOR, TOY, TOG)
  tor?: number; // Top of Red
  toy?: number; // Top of Yellow
  tog?: number; // Top of Green
}
