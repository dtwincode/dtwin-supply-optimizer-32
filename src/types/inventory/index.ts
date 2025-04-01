
export * from './bufferTypes';
export * from './decouplingTypes';
export * from './classificationTypes';
export * from './leadTimeTypes';
export * from './databaseTypes';
export * from './inventoryFilters';
export * from './shipmentTypes';

// Classification interface
export interface Classification {
  leadTimeCategory: 'short' | 'medium' | 'long';
  variabilityLevel: 'low' | 'medium' | 'high'; 
  criticality: 'low' | 'medium' | 'high';
  score?: number;
}

// SKU Classification interface - updated to match the database structure
export interface SKUClassification {
  id?: string;
  sku: string;
  product_id?: string;
  location_id?: string;
  classification: Classification;
  category?: string;
  last_updated?: string;
}

// ReplenishmentData interface
export interface ReplenishmentData {
  id: string;
  sku: string;
  quantity: number;
  replenishmentType: string;
  source: string;
  destination: string;
  status: string;
  expectedDate: string;
  lastUpdated?: string;
  locationFrom?: string;
  locationTo?: string;
  replenishmentLeadTime?: number;
  totalCycleTime?: number;
  internalTransferTime?: number;
}

// PaginationState interface
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// InventoryItem interface to match both database and UI needs
export interface InventoryItem {
  // Core fields that correspond to database
  id: string;
  inventory_id?: string;
  product_id: string;
  sku?: string;
  quantity_on_hand: number;
  available_qty?: number;
  reserved_qty?: number;
  location_id: string;
  location?: string;
  last_updated?: string;
  buffer_profile_id?: string;
  decoupling_point?: boolean;
  
  // UI enhancements
  name?: string;
  currentStock?: number;
  category?: string;
  subcategory?: string;
  productFamily?: string;
  region?: string;
  city?: string;
  channel?: string;
  warehouse?: string;
  decouplingPointId?: string;
  adu?: number;
  leadTimeDays?: number;
  variabilityFactor?: number;
  redZoneSize?: number;
  yellowZoneSize?: number;
  greenZoneSize?: number;
  onHand?: number;
  onOrder?: number;
  qualifiedDemand?: number;
  netFlowPosition?: number;
  planningPriority?: string;
  classification?: Classification;
}
