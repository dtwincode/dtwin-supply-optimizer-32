
export interface FilterOptions {
  regions: string[];
  cities: { [key: string]: string[] };
  channelTypes: string[];
  warehouses: string[];
}

export interface FilterState {
  searchQuery: string;
  selectedRegion: string;
  selectedCity: string;
  selectedChannel: string;
  selectedWarehouse: string;
  selectedCategory: string;
  selectedSubcategory: string;
  selectedSku: string;
}

export interface FilterActions {
  setSearchQuery: (query: string) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedCity: (city: string) => void;
  setSelectedChannel: (channel: string) => void;
  setSelectedWarehouse: (warehouse: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedSubcategory: (subcategory: string) => void;
  setSelectedSku: (sku: string) => void;
}
