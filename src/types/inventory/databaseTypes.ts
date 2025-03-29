// This file defines database schema types that match the actual Supabase tables

export interface DBInventoryItem {
  inventory_id: string;
  product_id: string;
  quantity_on_hand: number;
  available_qty?: number;
  reserved_qty?: number;
  location_id?: string;
  last_updated?: string;
}

export interface DBInventoryItem {
  id: string;
  sku: string;
  name: string;
  current_stock: number;
  category: string;
  subcategory: string;
  location: string;
  product_family: string;
  region: string;
  city: string;
  channel: string;
  warehouse: string;
  decoupling_point_id?: string;
  adu?: number;
  lead_time_days?: number;
  variability_factor?: number;
  red_zone_size?: number;
  yellow_zone_size?: number;
  green_zone_size?: number;
  on_hand: number;
  on_order: number;
  qualified_demand: number;
  net_flow_position: number;
  planning_priority?: string;
  created_at: string;
  updated_at: string;
  max_stock: number;
  min_stock: number;
}

export interface DBBufferProfile {
  id: string;
  name: string;
  description?: string;
  variability_factor: 'high_variability' | 'medium_variability' | 'low_variability';
  lead_time_factor: 'short' | 'medium' | 'long';
  moq?: number;
  lot_size_factor?: number;
  created_at: string;
  updated_at: string;
}

export interface DBDecouplingPoint {
  id: string;
  location_id: string;
  buffer_profile_id: string;
  type: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DBPurchaseOrder {
  id: string;
  po_number: string;
  sku: string;
  quantity: number;
  created_by?: string; // Made optional to fix the type error
  status: string;
  supplier?: string;
  expected_delivery_date?: string;
  order_date: string;
  created_at: string;
  updated_at: string;
}

export interface DBBufferFactorConfig {
  id: string;
  short_lead_time_factor: number;
  medium_lead_time_factor: number;
  long_lead_time_factor: number;
  short_lead_time_threshold: number;
  medium_lead_time_threshold: number;
  replenishment_time_factor: number;
  green_zone_factor: number;
  description?: string;
  is_active: boolean;
  industry?: 'manufacturing' | 'retail' | 'distribution' | 'electronics' | 'automotive' | 'consumer_goods' | 'pharmaceuticals';
  is_benchmark_based?: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}
