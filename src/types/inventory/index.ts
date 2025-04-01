
export * from './bufferTypes';
export * from './decouplingTypes';
export * from './classificationTypes';
export * from './leadTimeTypes';
export * from './databaseTypes';
export * from './inventoryFilters';
export * from './shipmentTypes';

// PaginationState interface
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// Classification interface for inventory items
export interface Classification {
  leadTimeCategory: "short" | "medium" | "long";
  variabilityLevel: "low" | "medium" | "high";
  criticality: "low" | "medium" | "high";
  score: number;
}

// InventoryItem interface to match both database and UI needs
export interface InventoryItem {
  // Core fields that correspond to database
  id: string;
  inventory_id?: string;
  product_id?: string;
  sku?: string;
  quantity_on_hand?: number;
  available_qty?: number;
  reserved_qty?: number;
  location_id?: string;
  location?: string;
  last_updated?: string;
  buffer_profile_id?: string;
  decoupling_point?: boolean;
  
  // UI enhancements
  name?: string;
  currentStock?: number;
  category?: string;
  subcategory?: string;
  productFamily?: string;
  region?: string;
  city?: string;
  channel?: string;
  warehouse?: string;
  decouplingPointId?: string;
  
  // Fields from inventory_planning_view
  adu?: number;
  average_daily_usage?: number;
  leadTimeDays?: number;
  lead_time_days?: number;
  variabilityFactor?: number;
  demand_variability?: number;
  min_stock_level?: number;
  safety_stock?: number;
  max_stock_level?: number;
  
  // Buffer zones
  redZoneSize?: number;
  yellowZoneSize?: number;
  greenZoneSize?: number;
  
  // Flow metrics
  onHand?: number;
  onOrder?: number;
  qualifiedDemand?: number;
  netFlowPosition?: number;
  planningPriority?: string;
  bufferPenetration?: number;
  classification?: Classification;
}
