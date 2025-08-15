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

export interface Shipment {
  id: string;
  shipmentNumber: string;
  status: 'planned' | 'in_transit' | 'delivered' | 'cancelled';
  origin: string;
  destination: string;
  carrier: string;
  trackingNumber?: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  items: ShipmentItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  unitOfMeasure: string;
}

export interface ShipmentItemInput {
  sku: string;
  name: string;
  quantity: number;
  unitOfMeasure: string;
}

export interface BufferItem extends InventoryItem {
  product_id: string;
  buffer_profile_id: string;
}

export interface DecouplingItem extends InventoryItem {
  product_id: string;
  is_decoupling_point: boolean;
}

export interface SavedFile {
  id: string;
  file_name: string;
  original_name: string;
  created_at: string;
  created_by: string;
  storage_path: string;
  updated_at: string;
  hierarchy_type?: string;
  data?: any;
}
