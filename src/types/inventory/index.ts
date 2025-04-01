
export * from './bufferTypes';
export * from './classificationTypes';

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  category?: string;
  subcategory?: string;
  location: string;
  productFamily?: string;
  region?: string;
  city?: string;
  channel?: string;
  warehouse?: string;
  decouplingPointId?: string;
  
  // Planning view fields
  average_daily_usage?: number;
  demand_variability?: number; 
  min_stock_level?: number;
  max_stock_level?: number;
  safety_stock?: number;
  buffer_profile_id?: string;
  decoupling_point?: boolean;
  product_id?: string;
  location_id?: string;
  lead_time_days?: number;
  
  // Original DDMRP fields
  adu?: number;
  leadTimeDays?: number;
  variabilityFactor?: number;
  redZoneSize?: number;
  yellowZoneSize?: number;
  greenZoneSize?: number;
  
  // Inventory data fields
  quantity_on_hand?: number;
  available_qty?: number;
  reserved_qty?: number;
  
  // Buffer calculations
  onHand: number;
  onOrder?: number;
  qualifiedDemand?: number;
  netFlowPosition?: number;
  planningPriority?: string;
  bufferPenetration?: number;
  
  // Classification
  classification?: {
    leadTimeCategory: string;
    variabilityLevel: string;
    criticality: string;
    score?: number;
  };
  
  // Optional DDMRP metrics
  aduCalculation?: {
    past30Days: number;
    past60Days: number;
    past90Days: number;
    forecastedADU: number;
    blendedADU: number;
  };
  dynamicAdjustments?: {
    seasonality: number;
    trend: number;
    marketStrategy: number;
  };
  supplySignals?: {
    leadTimeAlert: boolean;
    qualityAlert: boolean;
    orderDelayRisk: string;
  };
  decoupledLeadTime?: number;
  orderSpikeThreshold?: number;
  economicOrderQty?: number;
  demandVariabilityFactor?: number;
  supplyVariabilityFactor?: number;
  serviceLevel?: number;
  bufferHealthAssessment?: number;
  inventoryTurnsRatio?: number;
  leadTimeCompressionIndex?: number;
  demandDrivenFillRate?: number;
  inventoryCarryingCost?: number;
  demandSensingAccuracy?: number;
  originalLeadTime?: number;
  minimumOrderQuantity?: number;
  preferredSupplier?: string;
}
