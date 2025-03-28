export interface TranslationItem {
  en: string;
  ar: string;
}

export interface NestedTranslationItem {
  title: TranslationItem;
  description: TranslationItem;
}

export interface InventoryTranslations {
  inventoryTitle: TranslationItem;
  bufferZones: TranslationItem;
  bufferStatus: TranslationItem;
  skuClassification: TranslationItem;
  leadTime: TranslationItem;
  replenishmentOrders: TranslationItem;
  netFlowPosition: TranslationItem;
  inventorySummary: TranslationItem;
  inventoryLevels: TranslationItem;
  skuClassifications: TranslationItem;
  decouplingPoint: TranslationItem;
  addDecouplingPoint: TranslationItem;
  manageAndTrack: TranslationItem;
  currentStock: TranslationItem;
  productFamily: TranslationItem;
  location: TranslationItem;
  name: TranslationItem;
  sku: TranslationItem;
  actions: TranslationItem;
  noItems: TranslationItem;
  loadingData: TranslationItem;
  loadingItem: TranslationItem;
  errorLoading: TranslationItem;
  errorLoadingConfig: TranslationItem;
  leadTimeCategory: TranslationItem;
  variabilityLevel: TranslationItem;
  criticality: TranslationItem;
  score: TranslationItem;
  lastUpdated: TranslationItem;
  adu: TranslationItem;
  turnover: TranslationItem;
  decouplingPoints: TranslationItem;
  decouplingNetwork: TranslationItem;
  listView: TranslationItem;
  locationId: TranslationItem;
  type: TranslationItem;
  description: TranslationItem;
  edit: TranslationItem;
  delete: TranslationItem;
  noDecouplingPoints: TranslationItem;
  confirmDelete: TranslationItem;
  success: TranslationItem;
  decouplingPointDeleted: TranslationItem;
  decouplingPointSaved: TranslationItem;
  refresh: TranslationItem;
  networkVisualization: TranslationItem;
  nodes: TranslationItem;
  links: TranslationItem;
  configureDecouplingPoints: TranslationItem;
  strategicInfo: TranslationItem;
  customerOrderInfo: TranslationItem;
  stockPointInfo: TranslationItem;
  intermediateInfo: TranslationItem;
  bufferProfileInfo: TranslationItem;
  nodesDescription: TranslationItem;
  linksDescription: TranslationItem;
  networkHelp: TranslationItem;
  classification: NestedTranslationItem;
  decouplingPointRecommendation: TranslationItem;
  decouplingPointRecommendationDesc: TranslationItem;
  decouplingPointRecommendationHelp: TranslationItem;
  locationSelection: TranslationItem;
  selectLocation: TranslationItem;
  weightFactors: TranslationItem;
  leadTimeFactor: TranslationItem;
  demandVariabilityFactor: TranslationItem;
  supplyReliabilityFactor: TranslationItem;
  inventoryCostFactor: TranslationItem;
  customerServiceFactor: TranslationItem;
  leadTimeFactorDesc: TranslationItem;
  demandVariabilityFactorDesc: TranslationItem;
  supplyReliabilityFactorDesc: TranslationItem;
  inventoryCostFactorDesc: TranslationItem;
  customerServiceFactorDesc: TranslationItem;
  locationFactorScores: TranslationItem;
  scoreFor: TranslationItem;
  analyzing: TranslationItem;
  analyzeDecouplingPoints: TranslationItem;
  recommendationScore: TranslationItem;
  recommendationStatus: TranslationItem;
  highlyRecommended: TranslationItem;
  recommended: TranslationItem;
  consider: TranslationItem;
  notRecommended: TranslationItem;
  suggestedType: TranslationItem;
  confidence: TranslationItem;
  viewDetailedAnalysis: TranslationItem;
  analysisComplete: TranslationItem;
  decouplingRecommendationsReady: TranslationItem;
  strategicDecouplingPoint: TranslationItem;
  customer_orderDecouplingPoint: TranslationItem;
  stock_pointDecouplingPoint: TranslationItem;
  intermediateDecouplingPoint: TranslationItem;
  totalItems: TranslationItem;
  bufferManagement: TranslationItem;
  bufferManagementDesc: TranslationItem;
  createBufferProfile: TranslationItem;
  bufferProfiles: TranslationItem;
  bufferConfiguration: TranslationItem;
  bufferSimulation: TranslationItem;
  bufferSimulationDesc: TranslationItem;
  noBufferProfiles: TranslationItem;
  bufferProfileSaved: TranslationItem;
  leadTimeFactors: TranslationItem;
  leadTimeThresholds: TranslationItem;
  otherFactors: TranslationItem;
  replenishmentTime: TranslationItem;
  industry: TranslationItem;
  moq: TranslationItem;
  lotSizeFactor: TranslationItem;
  variabilityFactor: TranslationItem;
  selectADU: TranslationItem;
  selectLeadTime: TranslationItem;
  selectVariability: TranslationItem;
  simulatedBufferVisualization: TranslationItem;
  unitsPerDay: TranslationItem;
  days: TranslationItem;
  high: TranslationItem;
  medium: TranslationItem;
  low: TranslationItem;
  short: TranslationItem;
  long: TranslationItem;
  unknown: TranslationItem;
  stock: TranslationItem;
  buffer: TranslationItem;
  classify: TranslationItem;
  decouple: TranslationItem;
  netflow: TranslationItem;
  ai: TranslationItem;
  bufferProfile: TranslationItem;
}

export type Language = 'en' | 'ar';

export type TranslationValue = {
  en: string;
  ar: string;
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
  ui: UITranslations;
  charts: any;
  pagination: PaginationTranslations;
};

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
