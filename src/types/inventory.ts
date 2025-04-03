
export interface BufferProfile {
  id?: string;
  name: string;
  variabilityFactor: "low_variability" | "medium_variability" | "high_variability";
  leadTimeFactor: "short" | "medium" | "long";
  moq?: number;
  lotSizeFactor?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SKUClassification {
  leadTimeCategory: "short" | "medium" | "long";
  variabilityLevel: "low" | "medium" | "high";
  criticality: "low" | "medium" | "high";
  bufferProfile: string;
  score: number;
}

export interface BufferZoneData {
  sku: string;
  redZone: number;
  yellowZone: number;
  greenZone: number;
  totalBuffer: number;
  currentStock: number;
  onHand: number;
  onOrder: number;
  bufferStatus: "RED" | "YELLOW" | "GREEN";
  location: string;
  lastUpdated: string;
}

export interface DecouplingPointData {
  sku: string;
  location: string;
  isDecouplingPoint: boolean;
  bufferProfile: string;
  leadTime: number;
  variability: number;
  criticality: "HIGH" | "MEDIUM" | "LOW";
  stockLevel: number;
  recommendedBuffer: number;
  lastUpdated: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  currentStock: number;
  location?: string;
  productFamily?: string;
  region?: string;
  city?: string;
  channel?: string;
  warehouse?: string;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  preferredSupplier?: string;
  bufferProfile?: string;
  onHand?: number;
  onOrder?: number;
  allocated?: number;
  available?: number;
  qualifiedDemand?: number;
  netFlowPosition?: number;
  adu?: number;
  redZoneSize?: number;
  yellowZoneSize?: number;
  greenZoneSize?: number;
  bufferPenetration?: number;
  planningPriority?: string;
  decouplingPointId?: string;
  variabilityFactor?: number;
  reorderPoint?: number;
  createdAt?: string;
  updatedAt?: string;
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
}

export interface BufferFactorConfig {
  id: string;
  name: string;
  factor: number;
  description?: string;
}
