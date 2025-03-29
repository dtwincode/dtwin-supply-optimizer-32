
export * from './bufferTypes';
export * from './decouplingTypes';
export * from './classificationTypes';
export * from './leadTimeTypes';
export * from './databaseTypes';
export * from './inventoryFilters';
export * from './shipmentTypes';

// SKU Classification interface
export interface SKUClassification {
  id?: string;
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

// Classification interface
export interface Classification {
  id?: string;
  name?: string;
  description?: string;
  criteria?: string;
  score?: number;
  leadTimeCategory?: 'short' | 'medium' | 'long';
  variabilityLevel?: 'low' | 'medium' | 'high';
  criticality?: 'low' | 'medium' | 'high';
}

// ReplenishmentData interface
export interface ReplenishmentData {
  id: string;
  sku: string;
  quantity: number;
  date: string;
  location: string;
}
