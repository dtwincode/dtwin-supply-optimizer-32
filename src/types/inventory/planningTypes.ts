
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

export interface InventoryPlanningFilters {
  searchQuery: string;
  selectedLocation: string;
  selectedBufferProfile: string;
  showDecouplingPointsOnly: boolean;
}

export interface BufferZoneData {
  red: number;
  yellow: number;
  green: number;
  total: number;
}

export interface PlanningMetrics {
  totalItems: number;
  decouplingPoints: number;
  averageLeadTime: number;
  criticalItems: number;
  healthyItems: number;
  warningItems: number;
}
