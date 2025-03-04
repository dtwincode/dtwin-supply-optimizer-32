
// Re-export all inventory types
export * from '../inventory';
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
