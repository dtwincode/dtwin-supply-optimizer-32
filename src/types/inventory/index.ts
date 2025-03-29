
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

// Inventory Transaction interface for use with hooks
export interface InventoryTransactionData {
  product_id: string;
  quantity: number;
  transactionType: 'inbound' | 'outbound';
  referenceId?: string;
  referenceType?: 'purchase_order' | 'sales_order' | 'shipment';
  notes?: string;
}

// Inventory Item interface to match the new inventory_data table
export interface InventoryItem {
  inventory_id: string;
  product_id: string;
  quantity_on_hand: number;
  available_qty?: number;
  reserved_qty?: number;
  location_id?: string;
  last_updated?: string;
}
