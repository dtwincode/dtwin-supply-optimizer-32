
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
