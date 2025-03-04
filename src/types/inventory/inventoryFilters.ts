
export interface InventoryFilters {
  searchQuery: string;
  selectedLocation: string;
  selectedFamily: string;
  selectedRegion?: string;
  selectedCity?: string;
  selectedChannel?: string;
  selectedWarehouse?: string;
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedSKU?: string;
  timeRange?: {
    start: string;
    end: string;
  };
}
