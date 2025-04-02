
// Export from sub-modules
export * from './classificationTypes';
export * from './decouplingTypes';
export * from './bufferTypes';

// Define pagination type
export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// Export Classification and SKUClassification as types
export type { Classification, SKUClassification } from './classificationTypes';

// Define ReplenishmentData type
export interface ReplenishmentData {
  id: string;
  sku: string;
  quantity: number;
  replenishmentType: string;
  source: string;
  destination: string;
  status: string;
  expectedDate?: string;
  internalTransferTime?: number;
  totalCycleTime?: number;
  lastUpdated: string;
  locationFrom?: string;
  locationTo?: string;
  replenishmentLeadTime?: number;
}

// Define IndustryType
export type IndustryType = 'pharmaceutical' | 'food' | 'electronics' | 'automotive' | 'retail' | 'manufacturing' | string;

// Ensure InventoryItem has all needed properties
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  currentStock: number;
  category?: string;
  subcategory?: string;
  location: string;
  productFamily?: string;
  region?: string;
  city?: string;
  channel?: string;
  warehouse?: string;
  decouplingPointId?: string;
  bufferProfileId?: string;
  adu?: number; // Average Daily Usage
  leadTimeDays?: number;
  variabilityFactor?: number;
  // Buffer Zones
  redZoneSize?: number;
  yellowZoneSize?: number;
  greenZoneSize?: number;
  // Buffer management
  maxStockLevel?: number;
  minStockLevel?: number;
  safetyStock?: number;
  // Net Flow Components
  onHand: number;
  onOrder?: number;
  qualifiedDemand?: number;
  netFlowPosition?: number;
  planningPriority?: string;
  // Buffer Management
  bufferPenetration?: number;
  // Classification
  classification?: Classification;
  // Properties needed for backward compatibility
  product_id?: string;
  location_id?: string;
  decoupling_point?: boolean;
  preferredSupplier?: string;
  minimumOrderQuantity?: number;
}
