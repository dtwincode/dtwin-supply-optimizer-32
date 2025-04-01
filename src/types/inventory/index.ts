
export * from './classificationTypes';
export * from './decouplingTypes';

// Define missing pagination type
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// Re-export for convenience
export type {
  BufferZones,
  NetFlowPosition,
  InventoryItem,
  BufferFactorConfig,
  Classification,
  SKUClassification,
  ReplenishmentData,
} from '@/types/inventory';
