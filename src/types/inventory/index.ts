
// Export all specialized type modules
export * from './bufferTypes';
export * from './inventoryFilters';
export * from './decouplingTypes';
export * from './classificationTypes';

// Common utility types
export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}

// Re-export types from the root inventory.ts file
export type {
  BufferProfile,
  DecouplingPoint,
  PurchaseOrder,
  InventoryItem,
  InventoryFilters,
  BufferZones,
  NetFlowPosition,
  DDMRPMetricsHistory,
  IndustryType,
  BufferFactorConfig
} from '../inventory';

// Make sure all classification types are directly exported for easier access
export {
  Classification,
  SKUClassification,
  LeadTimeData,
  LeadTimeAnomaly,
  ReplenishmentData
} from './classificationTypes';
