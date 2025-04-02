
export interface Classification {
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high';
  criticality: 'low' | 'medium' | 'high';
  score: number;
}

export interface SKUClassification {
  id: string;
  sku: string;
  productId: string;
  productName?: string;
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high';
  criticality: 'low' | 'medium' | 'high'; 
  score: number;
  classification: string;
  lastUpdated?: string;
  // Properties needed for API compatibility
  product_id?: string;
  location_id?: string;
  category?: string;
}
