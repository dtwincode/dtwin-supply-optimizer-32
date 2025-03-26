
export type Language = 'en' | 'ar';

export type TranslationValue = {
  en: string;
  ar: string;
};

export type InventoryTranslations = {
  inventoryTitle: TranslationValue;
  bufferZones: TranslationValue;
  bufferStatus: TranslationValue;
  skuClassification: TranslationValue;
  leadTime: TranslationValue;
  replenishmentOrders: TranslationValue;
  netFlowPosition: TranslationValue;
  inventorySummary: TranslationValue;
  inventoryLevels: TranslationValue;
  skuClassifications: TranslationValue;
  decouplingPoint: TranslationValue;
  addDecouplingPoint: TranslationValue;
  manageAndTrack: TranslationValue;
  currentStock: TranslationValue;
  productFamily: TranslationValue;
  location: TranslationValue;
  name: TranslationValue;
  sku: TranslationValue;
  actions: TranslationValue;
  noItems: TranslationValue;
  loadingData: TranslationValue;
  loadingItem: TranslationValue;
  errorLoading: TranslationValue;
  leadTimeCategory: TranslationValue;
  variabilityLevel: TranslationValue;
  criticality: TranslationValue;
  score: TranslationValue;
  lastUpdated: TranslationValue;
  adu: TranslationValue;
  turnover: TranslationValue;
  decouplingPoints: TranslationValue;
  decouplingNetwork: TranslationValue;
  listView: TranslationValue;
  locationId: TranslationValue;
  type: TranslationValue;
  description: TranslationValue;
  edit: TranslationValue;
  delete: TranslationValue;
  noDecouplingPoints: TranslationValue;
  confirmDelete: TranslationValue;
  success: TranslationValue;
  decouplingPointDeleted: TranslationValue;
  decouplingPointSaved: TranslationValue;
  refresh: TranslationValue;
  networkVisualization: TranslationValue;
  nodes: TranslationValue;
  links: TranslationValue;
  configureDecouplingPoints: TranslationValue;
  strategicInfo: TranslationValue;
  customerOrderInfo: TranslationValue;
  stockPointInfo: TranslationValue;
  intermediateInfo: TranslationValue;
  bufferProfileInfo: TranslationValue;
  nodesDescription: TranslationValue;
  linksDescription: TranslationValue;
  networkHelp: TranslationValue;
  classification: {
    title: TranslationValue;
    description: TranslationValue;
  };
};

export type NavigationItems = {
  dashboard: TranslationValue;
  ddsop: TranslationValue;
  forecasting: TranslationValue;
  inventory: TranslationValue;
  inventoryClassification: TranslationValue;
  supplyPlanning: TranslationValue;
  salesPlanning: TranslationValue;
  returnsManagement: TranslationValue;
  marketing: TranslationValue;
  logistics: TranslationValue;
  reports: TranslationValue;
  askAI: TranslationValue;
  data: TranslationValue;
  guidelines: TranslationValue;
};

export type Translations = {
  navigationItems: NavigationItems;
  dashboardMetrics: any;
  financialMetrics: any;
  sustainabilityMetrics: any;
  modulesSummary: any;
  common: CommonTranslations;
  executiveSummary: any;
  sales: any;
  supplyPlanning: any;
  ddsop: any;
  marketing: any;
  inventory: InventoryTranslations;
};

// Adding missing types
export type CommonTranslations = {
  [key: string]: TranslationValue | any;
};

export type DashboardMetrics = {
  [key: string]: TranslationValue;
};

export type ExecutiveSummary = {
  [key: string]: TranslationValue | any;
};

export type FinancialMetrics = {
  [key: string]: TranslationValue;
};

export type PaginationTranslations = {
  [key: string]: TranslationValue;
};

export type SupplyPlanningTranslations = {
  [key: string]: TranslationValue | any;
};

export type SustainabilityMetrics = {
  [key: string]: TranslationValue;
};

export type UITranslations = {
  [key: string]: TranslationValue;
};

export type ModulesSummary = {
  [key: string]: TranslationValue;
};

export type MarketingTranslations = {
  [key: string]: TranslationValue | any;
};
