
export interface InventoryPlanningItem {
  product_id: string;
  location_id: string;
  buffer_profile_id?: string;
  lead_time_days?: number;
  average_daily_usage?: number;
  demand_variability?: number;
  min_stock_level?: number;
  safety_stock?: number;
  max_stock_level?: number;
  decoupling_point?: boolean;
  // Additional fields used in the app
  sku?: string;
  name?: string;
  classification?: {
    leadTimeCategory?: 'short' | 'medium' | 'long';
    variabilityLevel?: 'low' | 'medium' | 'high';
    criticality?: 'low' | 'medium' | 'high';
    score?: number;
  };
  onHand?: number;
  quantity_on_hand?: number;
  onOrder?: number;
  qualifiedDemand?: number;
  buffer_status?: 'green' | 'yellow' | 'red';
}

export interface Classification {
  leadTimeCategory?: 'short' | 'medium' | 'long';
  variabilityLevel?: 'low' | 'medium' | 'high';
  criticality?: 'low' | 'medium' | 'high';
  score?: number;
}

export interface SKUClassification {
  sku: string;
  classification: Classification;
  last_updated: string;
}

export interface ReplenishmentData {
  id: string; 
  sku: string;
  replenishmentType: string;
  supplier?: string;
  internalTransferTime?: number;
  replenishmentLeadTime?: number;
  totalCycleTime?: number;
  lastUpdated?: string;
}
