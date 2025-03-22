
import { InventoryItem } from "@/types/inventory";

export const safeFilter = (item: InventoryItem, query: string): boolean => {
  try {
    if (!query) return true;
    
    const queryLower = query.toLowerCase();
    return (
      (item.sku && item.sku.toLowerCase().includes(queryLower)) ||
      (item.name && item.name.toLowerCase().includes(queryLower)) ||
      (item.productFamily && item.productFamily.toLowerCase().includes(queryLower)) ||
      (item.location && item.location.toLowerCase().includes(queryLower))
    );
  } catch (error) {
    console.error("Error filtering inventory item:", error);
    return true; // Show the item if filtering fails
  }
};

export const getDefaultTabFromPath = (pathname: string): string => {
  try {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    const validTabs = ['inventory', 'buffer', 'decoupling', 'netflow', 'adu', 'ai'];
    return validTabs.includes(lastSegment) ? lastSegment : 'inventory';
  } catch (error) {
    console.error("Error determining default tab:", error);
    return 'inventory';
  }
};

export const getIndustrySpecificFilters = (industryType: string) => {
  const commonFilters = ['sku', 'name', 'productFamily', 'location'];
  
  const industrySpecificFilters = {
    groceries: [...commonFilters, 'expiryDate', 'freshness', 'temperatureZone'],
    electronics: [...commonFilters, 'version', 'lifecycleStage', 'warrantyStatus'],
    retail: [...commonFilters, 'season', 'promotionEligible'],
    pharmacy: [...commonFilters, 'regulatoryStatus', 'prescriptionRequired'],
    fmcg: [...commonFilters, 'shelfLife', 'batchNumber']
  };
  
  return industrySpecificFilters[industryType as keyof typeof industrySpecificFilters] || commonFilters;
};

export const getIndustrySpecificColumns = (industryType: string) => {
  const commonColumns = [
    { key: 'sku', label: 'SKU' },
    { key: 'name', label: 'Product Name' },
    { key: 'onHand', label: 'On Hand' },
    { key: 'allocated', label: 'Allocated' },
    { key: 'available', label: 'Available' }
  ];
  
  const industrySpecificColumns = {
    groceries: [
      ...commonColumns,
      { key: 'expiryDate', label: 'Expiry Date' },
      { key: 'freshness', label: 'Freshness %' },
      { key: 'temperatureZone', label: 'Temperature Zone' }
    ],
    electronics: [
      ...commonColumns,
      { key: 'version', label: 'Version' },
      { key: 'lifecycleStage', label: 'Lifecycle Stage' },
      { key: 'warrantyPeriod', label: 'Warranty (Months)' }
    ],
    retail: commonColumns,
    pharmacy: [
      ...commonColumns,
      { key: 'regulatoryStatus', label: 'Regulatory Status' },
      { key: 'storageConditions', label: 'Storage Conditions' }
    ],
    fmcg: [
      ...commonColumns,
      { key: 'shelfLife', label: 'Shelf Life (Days)' },
      { key: 'batchNumber', label: 'Batch Number' }
    ]
  };
  
  return industrySpecificColumns[industryType as keyof typeof industrySpecificColumns] || commonColumns;
};
