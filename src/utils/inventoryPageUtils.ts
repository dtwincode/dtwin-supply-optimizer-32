
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
