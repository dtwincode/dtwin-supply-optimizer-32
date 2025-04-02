
export * from './classificationTypes';
export * from './decouplingTypes';
export * from './bufferTypes';

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

// Export required types
export { Classification } from './classificationTypes';

// Define ReplenishmentData type that was missing
export interface ReplenishmentData {
  id: string;
  sku: string;
  quantity: number;
  replenishment_type: string;
  source_location?: string;
  destination_location?: string;
  status: string;
  expected_date?: string;
  internal_transfer_time?: number;
  total_cycle_time?: number;
  last_updated: string;
  location_from?: string;
  location_to?: string;
  replenishment_lead_time?: number;
}

// SKU Classification type
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
}
