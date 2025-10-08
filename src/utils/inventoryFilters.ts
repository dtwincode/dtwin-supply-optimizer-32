/**
 * Centralized inventory filtering logic
 */

export interface InventoryFilters {
  productId?: string | null;
  locationId?: string | null;
  channelId?: string | null;
  decouplingOnly?: boolean;
  bufferStatus?: string[];
}

/**
 * Apply all filters to inventory data
 */
export const applyInventoryFilters = (
  data: any[],
  filters: InventoryFilters
): any[] => {
  let filtered = [...data];
  
  if (filters.productId) {
    filtered = filtered.filter(item => item.product_id === filters.productId);
  }
  
  if (filters.locationId) {
    filtered = filtered.filter(item => item.location_id === filters.locationId);
  }
  
  if (filters.channelId) {
    filtered = filtered.filter(item => item.channel_id === filters.channelId);
  }
  
  if (filters.decouplingOnly) {
    filtered = filtered.filter(item => item.decoupling_point === true);
  }
  
  if (filters.bufferStatus && filters.bufferStatus.length > 0) {
    filtered = filtered.filter(item => 
      filters.bufferStatus!.includes(item.buffer_status)
    );
  }
  
  return filtered;
};

/**
 * Filter for decoupling points only
 */
export const filterDecouplingPoints = (data: any[]): any[] => {
  return data.filter(item => item.decoupling_point === true);
};

/**
 * Filter by buffer status
 */
export const filterByBufferStatus = (data: any[], status: string | string[]): any[] => {
  const statuses = Array.isArray(status) ? status : [status];
  return data.filter(item => statuses.includes(item.buffer_status));
};

/**
 * Filter critical items (RED status)
 */
export const filterCriticalItems = (data: any[]): any[] => {
  return filterByBufferStatus(data, 'RED');
};

/**
 * Filter items by category
 */
export const filterByCategory = (data: any[], category: string): any[] => {
  return data.filter(item => item.category === category);
};

/**
 * Get unique categories from data
 */
export const getUniqueCategories = (data: any[]): string[] => {
  return [...new Set(data.map(item => item.category).filter(Boolean))];
};

/**
 * Get unique locations from data
 */
export const getUniqueLocations = (data: any[]): string[] => {
  return [...new Set(data.map(item => item.location_id).filter(Boolean))];
};

/**
 * Get unique products from data
 */
export const getUniqueProducts = (data: any[]): string[] => {
  return [...new Set(data.map(item => item.product_id).filter(Boolean))];
};
