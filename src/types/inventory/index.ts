
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
  classification: string;
  value: number;
  score?: number;
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
