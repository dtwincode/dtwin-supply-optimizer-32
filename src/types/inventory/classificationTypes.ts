
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
