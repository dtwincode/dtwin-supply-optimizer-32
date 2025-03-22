
import { IndustryType } from "@/contexts/IndustryContext";
import { InventoryItem } from "@/types/inventory";

export const safeFilter = (item: any, searchQuery: string) => {
  try {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const skuMatch = item?.sku?.toLowerCase()?.includes(query);
    const nameMatch = item?.name?.toLowerCase()?.includes(query);
    const productFamilyMatch = item?.productFamily?.toLowerCase()?.includes(query);
    const locationMatch = item?.location?.toLowerCase()?.includes(query);
    return skuMatch || nameMatch || productFamilyMatch || locationMatch;
  } catch (error) {
    console.error("Error in filter function:", error);
    return true;
  }
};

export const getDefaultTabFromPath = (path: string) => {
  const parts = path.split('/');
  const lastPart = parts[parts.length - 1];
  
  switch (lastPart) {
    case 'classification':
      return 'classification';
    case 'buffer-zones':
      return 'buffer-zones';
    case 'nfp':
      return 'nfp';
    case 'decoupling-points':
      return 'decoupling-points';
    default:
      return 'inventory';
  }
};

export const getIndustrySpecificColumns = (industry: IndustryType) => {
  // Base columns that all industries have
  const baseColumns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Name' },
    { key: 'currentStock', label: 'Current Stock' },
    { key: 'bufferStatus', label: 'Buffer Status' },
    { key: 'bufferZones', label: 'Buffer Zones' }
  ];
  
  // Add industry-specific columns
  switch (industry) {
    case 'pharmacy':
      return [
        ...baseColumns,
        { key: 'location', label: 'Location' },
        { key: 'productFamily', label: 'Product Family' },
        { key: 'regulatoryStatus', label: 'Regulatory Status' },
        { key: 'storageConditions', label: 'Storage Conditions' }
      ];
    case 'groceries':
      return [
        ...baseColumns,
        { key: 'location', label: 'Location' },
        { key: 'productFamily', label: 'Product Family' },
        { key: 'freshness', label: 'Freshness' },
        { key: 'expirationDate', label: 'Expiration Date' }
      ];
    case 'electronics':
      return [
        ...baseColumns,
        { key: 'location', label: 'Location' },
        { key: 'productFamily', label: 'Product Family' },
        { key: 'lifeCycleStage', label: 'Life Cycle Stage' },
        { key: 'warrantyStatus', label: 'Warranty Status' }
      ];
    case 'fmcg':
      return [
        ...baseColumns,
        { key: 'location', label: 'Location' },
        { key: 'productFamily', label: 'Product Family' },
        { key: 'batchNumber', label: 'Batch Number' },
        { key: 'shelfLife', label: 'Shelf Life' }
      ];
    case 'retail':
    default:
      return [
        ...baseColumns,
        { key: 'location', label: 'Location' },
        { key: 'productFamily', label: 'Product Family' }
      ];
  }
};

export const getIndustrySpecificFilters = (industry: IndustryType) => {
  // Base filters that all industries have
  const baseFilters = ['Location', 'Product Family', 'Buffer Status'];
  
  // Add industry-specific filters
  switch (industry) {
    case 'pharmacy':
      return [
        ...baseFilters,
        'Regulatory Status',
        'Prescription Required',
        'Storage Conditions'
      ];
    case 'groceries':
      return [
        ...baseFilters,
        'Freshness Period',
        'Perishable',
        'Refrigeration Required'
      ];
    case 'electronics':
      return [
        ...baseFilters,
        'Product Category',
        'Life Cycle Stage',
        'Warranty Period'
      ];
    case 'fmcg':
      return [
        ...baseFilters,
        'Brand',
        'Price Range',
        'Promotion Status'
      ];
    case 'retail':
    default:
      return [
        ...baseFilters,
        'Category',
        'Subcategory',
        'Price Range'
      ];
  }
};
