export interface BufferProfile {
  id: string;
  name: string;
  description?: string;
  variabilityFactor: 'high_variability' | 'medium_variability' | 'low_variability';
  leadTimeFactor: 'short' | 'medium' | 'long';
  moq?: number;
  lotSizeFactor?: number;
}

export interface DecouplingPoint {
  id: string;
  locationId: string;
  type: 'strategic' | 'customer_order' | 'stock_point' | 'intermediate';
  description?: string;
  bufferProfileId: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  sku: string;
  quantity: number;
  createdBy: string;
  status: string;
  supplier?: string;
  expectedDeliveryDate?: string;
  orderDate: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  category: string;
  subcategory: string;
  location: string;
  productFamily: string;
  region: string;
  city: string;
  channel: string;
  warehouse: string;
  decouplingPointId?: string;
  adu?: number; // Average Daily Usage
  leadTimeDays?: number;
  variabilityFactor?: number;
  // Buffer Zones
  redZoneSize?: number;
  yellowZoneSize?: number;
  greenZoneSize?: number;
  // Net Flow Components
  onHand: number;
  onOrder: number;
  qualifiedDemand: number;
  netFlowPosition: number;
  planningPriority?: string;
  // Buffer Management
  bufferPenetration?: number;
  // ADU Calculation Methods
  aduCalculation?: {
    past30Days: number;
    past60Days: number;
    past90Days: number;
    forecastedADU: number;
    blendedADU: number;
  };
  // Dynamic Adjustments
  dynamicAdjustments?: {
    seasonality: number;
    trend: number;
    marketStrategy: number;
  };
  // Supply Chain Metrics
  supplySignals?: {
    leadTimeAlert: boolean;
    qualityAlert: boolean;
    orderDelayRisk: string;
  };
  // Additional DDMRP Metrics
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
  // Adding missing properties
  minimumOrderQuantity?: number;
  preferredSupplier?: string;
}

export interface InventoryFilters {
  searchQuery: string;
  selectedLocation: string;
  selectedFamily: string;
  selectedRegion: string;
  selectedCity: string;
  selectedChannel: string;
  selectedWarehouse: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedSKU: string;
  timeRange?: {
    start: string;
    end: string;
  };
}

export interface BufferZones {
  red: number;
  yellow: number;
  green: number;
}

export interface NetFlowPosition {
  onHand: number;
  onOrder: number;
  qualifiedDemand: number;
  netFlowPosition: number;
}

export interface DDMRPMetricsHistory {
  id: string;
  inventoryItemId: string;
  metricType: string;
  metricValue: number;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type IndustryType = 'manufacturing' | 'retail' | 'distribution' | 'electronics' | 'automotive' | 'consumer_goods' | 'pharmaceuticals';

export interface BufferFactorConfig {
  id: string;
  shortLeadTimeFactor: number;
  mediumLeadTimeFactor: number;
  longLeadTimeFactor: number;
  shortLeadTimeThreshold: number;
  mediumLeadTimeThreshold: number;
  replenishmentTimeFactor: number;
  greenZoneFactor: number;
  description?: string;
  isActive: boolean;
  industry?: IndustryType;
  isBenchmarkBased?: boolean;
  metadata?: Record<string, any>;
}
