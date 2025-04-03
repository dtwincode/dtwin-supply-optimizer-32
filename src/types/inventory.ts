
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
