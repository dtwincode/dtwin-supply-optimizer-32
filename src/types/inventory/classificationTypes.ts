

export interface SKUClassification {
  id?: string;
  sku: string;
  product_id?: string;
  location_id?: string;
  category?: string;
  last_updated?: string;
  classification: Classification;
}

export interface Classification {
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high';
  criticality: 'low' | 'medium' | 'high';
  score?: number;
}

export interface ReplenishmentData {
  id?: string;
  sku: string;
  quantity?: number;
  replenishmentType?: string;
  source?: string;
  destination?: string;
  status?: string;
  expectedDate?: string;
  lastUpdated?: string;
  locationFrom?: string;
  locationTo?: string;
  replenishmentLeadTime?: number;
  totalCycleTime?: number;
  internalTransferTime?: number;
  averageDailyUsage?: number;
  replenishmentTime?: number;
  minimumOrderQuantity?: number;
  orderMultiple?: number;
  currentStock?: number;
  safetyStock?: number;
  reorderPoint?: number;
  targetLevel?: number;
}

