
export interface Classification {
  id?: string;
  name?: string;
  description?: string;
  criteria?: string;
  score: number;
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high';
  criticality: 'low' | 'medium' | 'high';
}

export interface SKUClassification {
  id?: string;
  sku: string;
  category?: string;
  subcategory?: string;
  classification: Classification;
  last_updated: string;
  product_id?: string;
  location_id?: string;
}

export interface ReplenishmentData {
  id: string;
  sku: string;
  quantity: number;
  replenishmentType: string;
  source: string;
  destination: string;
  status: string;
  expectedDate: string;
  internalTransferTime?: number;
  totalCycleTime?: number;
  lastUpdated?: string;
  locationFrom?: string;
  locationTo?: string;
  replenishmentLeadTime?: number;
}
