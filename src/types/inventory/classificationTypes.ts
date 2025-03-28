
export interface SKUClassification {
  id: string;
  sku: string;
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high';
  criticality: 'low' | 'medium' | 'high';
  score: number;
  lastUpdated: string;
}

export interface Classification {
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high';
  criticality: 'low' | 'medium' | 'high';
}

export interface ReplenishmentData {
  id: string;
  sku: string;
  averageDailyUsage: number;
  replenishmentTime: number;
  minimumOrderQuantity: number;
  orderMultiple: number;
  currentStock: number;
  safetyStock: number;
  reorderPoint: number;
  targetLevel: number;
  lastUpdated: string;
}
