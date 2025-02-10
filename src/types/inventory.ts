
export interface InventoryItem {
  id: number;
  sku: string;
  name: string;
  currentStock: number;
  bufferZone: string;
  minStock: number;
  maxStock: number;
  leadTime: string;
  category: string;
  subcategory: string;
  lastUpdated: string;
  decouplingPoint: {
    type: string;
    location: string;
    reason: string;
    variabilityFactor: string;
    bufferProfile: string;
  };
  location: string;
  productFamily: string;
  netFlow: {
    onHand: number;
    onOrder: number;
    qualifiedDemand: number;
    netFlowPosition: number;
    avgDailyUsage: number;
    orderCycle: number;
    redZone: number;
    yellowZone: number;
    greenZone: number;
  };
  region: string;
  city: string;
  channel: string;
  warehouse: string;
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
  planningHorizon?: string;
  orderSpike?: {
    threshold: number;
    horizon: string;
    qualified: boolean;
  };
  bufferPenetration: number;
  supplySignals?: {
    leadTimeAlert: boolean;
    qualityAlert: boolean;
    orderDelayRisk: string;
  };
}

export interface DynamicAdjustmentFactor {
  seasonality: number;
  trend: number;
  marketStrategy: number;
}

export interface ADUCalculation {
  past30Days: number;
  past60Days: number;
  past90Days: number;
  forecastedADU: number;
  blendedADU: number;
}
