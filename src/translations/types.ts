
// Define translation interface for a single phrase
export interface Translation {
  en: string;
  ar?: string;
  fr?: string;
  es?: string;
  [key: string]: string | undefined;
}

// Define interface for a collection of translations
export interface TranslationSet {
  [key: string]: Translation | TranslationSet;
  
  // Add specific allowed properties here to fix type errors
  inventory?: {
    [key: string]: Translation;
  };
  bufferZones?: Translation;
  redZone?: Translation;
  yellowZone?: Translation;
  greenZone?: Translation;
  netFlow?: Translation;
  bufferStatus?: Translation;
  decouplingPoint?: Translation;
  classification?: Translation;
  thresholds?: Translation;
  inventoryManagement?: Translation;
  errorLoading?: Translation;
  loadingData?: Translation;
  loadingItem?: Translation;
  noItems?: Translation;
  searchProducts?: Translation;
  allLocations?: Translation;
  refresh?: Translation;
}

// Define interfaces for various translation categories
export interface DashboardMetrics {
  [key: string]: Translation;
}

export interface ExecutiveSummary {
  [key: string]: Translation;
}

export interface FinancialMetrics {
  [key: string]: Translation;
}

export interface SustainabilityMetrics {
  [key: string]: Translation;
}

export interface ModulesSummary {
  [key: string]: Translation;
}

export interface NavigationItems {
  [key: string]: Translation;
}

export interface InventoryTranslations {
  [key: string]: Translation;
}

export interface MarketingTranslations {
  [key: string]: Translation;
}

export interface UITranslations {
  [key: string]: Translation;
}

export interface PaginationTranslations {
  [key: string]: Translation;
}

export interface CommonTranslations {
  [key: string]: Translation;
}

// Define Translations interface that includes all translation sets
export interface Translations {
  dashboard?: {
    metrics?: DashboardMetrics;
    executiveSummary?: ExecutiveSummary;
    financialMetrics?: FinancialMetrics;
    sustainabilityMetrics?: SustainabilityMetrics;
    modulesSummary?: ModulesSummary;
  };
  inventory?: InventoryTranslations;
  marketing?: MarketingTranslations;
  common?: {
    ui?: UITranslations;
    pagination?: PaginationTranslations;
  };
  [key: string]: any;
}
