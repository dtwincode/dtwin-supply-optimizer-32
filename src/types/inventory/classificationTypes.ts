
export interface Classification {
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high';
  criticality: 'low' | 'medium' | 'high';
  score?: number;
}

export interface SKUClassification {
  sku: string;
  classification: Classification;
  lastUpdated: string;
}

export interface ReplenishmentData {
  sku: string;
  internalTransferTime: number;
  replenishmentLeadTime: number;
  totalCycleTime: number;
  lastUpdated: string;
  locationFrom: string;
  locationTo: string;
}
