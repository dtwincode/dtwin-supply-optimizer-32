// DDMRP Inventory Planning Types
export interface InventoryPlanningItem {
  id?: number;
  product_id: string;
  location_id: string;
  sku: string;
  product_name: string;
  category: string;
  subcategory?: string;
  channel_id?: string;
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
  buffer_profile_id?: string;
  demand_variability?: number;
  on_hand?: number;
  on_order?: number;
  qualified_demand?: number;
  nfp?: number;
  tor?: number;
  toy?: number;
  tog?: number;
}

export interface BufferProfileMaster {
  buffer_profile_id: string;
  name: string;
  description?: string;
  lt_factor: number;
  variability_factor: number;
  order_cycle_days: number;
  min_order_qty: number;
  rounding_multiple: number;
}

export interface ReplenishmentOrder {
  proposal_id: number;
  product_id: string;
  location_id: string;
  qty_recommend: number;
  reason: string;
  status: 'DRAFT' | 'APPROVED' | 'REJECTED';
  target_due_date?: string;
}

export interface BufferBreachEvent {
  event_id: number;
  product_id: string;
  location_id: string;
  breach_type: 'below_tor' | 'below_toy' | 'above_tog';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  detected_ts: string;
  acknowledged: boolean;
}
