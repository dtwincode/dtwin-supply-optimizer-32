
export type LeadTimeCategory = 'short' | 'medium' | 'long';
export type VariabilityLevel = 'low' | 'medium' | 'high';
export type CriticalityLevel = 'low' | 'medium' | 'high';

export interface Classification {
  leadTimeCategory: LeadTimeCategory;
  variabilityLevel: VariabilityLevel;
  criticality: CriticalityLevel;
  score: number;
}

export interface SKUClassification {
  product_id: string;
  location_id: string;
  classification: Classification;
  lastUpdated: string;
}
