
export * from './bufferTypes';
export * from './decouplingTypes';
export * from './classificationTypes';
export * from './leadTimeTypes';
export * from './databaseTypes';
export * from './inventoryFilters';
export * from './shipmentTypes';

// Add missing types that are causing errors
export interface SKUClassification {
  id: string;
  sku: string;
  classification: {
    leadTimeCategory?: 'short' | 'medium' | 'long';
    variabilityLevel?: 'low' | 'medium' | 'high';
    criticality?: 'low' | 'medium' | 'high';
    score?: number;
  };
  value?: number;
  score?: number;
  lastUpdated?: string;
}

export interface Classification {
  id: string;
  name: string;
  description: string;
  criteria: string;
  score?: number;
}

export interface ReplenishmentData {
  id: string;
  sku: string;
  quantity: number;
  date: string;
  location: string;
}
