
export type TranslationItem = string;

export interface NestedTranslationItem {
  title: string;
  description: string;
}

export interface InventoryTranslations {
  inventoryTitle: string;
  bufferZones: string;
  bufferStatus: string;
  skuClassification: string;
  leadTime: string;
  replenishmentOrders: string;
  netFlowPosition: string;
  inventorySummary: string;
  inventoryLevels: string;
  skuClassifications: string;
  decouplingPoint: string;
  addDecouplingPoint: string;
  manageAndTrack: string;
  currentStock: string;
  productFamily: string;
  location: string;
  name: string;
  sku: string;
  actions: string;
  noItems: string;
  loadingData: string;
  loadingItem: string;
  errorLoading: string;
  errorLoadingConfig: string;
  leadTimeCategory: string;
  variabilityLevel: string;
  criticality: string;
  score: string;
  lastUpdated: string;
  adu: string;
  turnover: string;
  decouplingPoints: string;
  decouplingNetwork: string;
  listView: string;
  locationId: string;
  type: string;
  description: string;
  edit: string;
  delete: string;
  noDecouplingPoints: string;
  confirmDelete: string;
  success: string;
  decouplingPointDeleted: string;
  decouplingPointSaved: string;
  refresh: string;
  networkVisualization: string;
  nodes: string;
  links: string;
  configureDecouplingPoints: string;
  strategicInfo: string;
  customerOrderInfo: string;
  stockPointInfo: string;
  intermediateInfo: string;
  bufferProfileInfo: string;
  nodesDescription: string;
  linksDescription: string;
  networkHelp: string;
  classification: NestedTranslationItem;
  decouplingPointRecommendation: string;
  decouplingPointRecommendationDesc: string;
  decouplingPointRecommendationHelp: string;
  locationSelection: string;
  selectLocation: string;
  weightFactors: string;
  leadTimeFactor: string;
  demandVariabilityFactor: string;
  supplyReliabilityFactor: string;
  inventoryCostFactor: string;
  customerServiceFactor: string;
  leadTimeFactorDesc: string;
  demandVariabilityFactorDesc: string;
  supplyReliabilityFactorDesc: string;
  inventoryCostFactorDesc: string;
  customerServiceFactorDesc: string;
  locationFactorScores: string;
  scoreFor: string;
  analyzing: string;
  analyzeDecouplingPoints: string;
  recommendationScore: string;
  recommendationStatus: string;
  highlyRecommended: string;
  recommended: string;
  consider: string;
  notRecommended: string;
  suggestedType: string;
  confidence: string;
  viewDetailedAnalysis: string;
  analysisComplete: string;
  decouplingRecommendationsReady: string;
  strategicDecouplingPoint: string;
  customer_orderDecouplingPoint: string;
  stock_pointDecouplingPoint: string;
  intermediateDecouplingPoint: string;
  totalItems: string;
  bufferManagement: string;
  bufferManagementDesc: string;
  createBufferProfile: string;
  bufferProfiles: string;
  bufferConfiguration: string;
  bufferSimulation: string;
  bufferSimulationDesc: string;
  noBufferProfiles: string;
  bufferProfileSaved: string;
  leadTimeFactors: string;
  leadTimeThresholds: string;
  otherFactors: string;
  replenishmentTime: string;
  industry: string;
  moq: string;
  lotSizeFactor: string;
  variabilityFactor: string;
  selectADU: string;
  selectLeadTime: string;
  selectVariability: string;
  simulatedBufferVisualization: string;
  unitsPerDay: string;
  days: string;
  high: string;
  medium: string;
  low: string;
  short: string;
  long: string;
  unknown: string;
  stock: string;
  buffer: string;
  classify: string;
  decouple: string;
  netflow: string;
  ai: string;
  bufferProfile: string;
}

export type Language = 'en';

export type NavigationItems = {
  dashboard: string;
  ddsop: string;
  forecasting: string;
  inventory: string;
  inventoryClassification: string;
  supplyPlanning: string;
  salesPlanning: string;
  returnsManagement: string;
  marketing: string;
  logistics: string;
  reports: string;
  askAI: string;
  data: string;
  guidelines: string;
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
  [key: string]: string | any;
};

export type DashboardMetrics = {
  [key: string]: string;
};

export type ExecutiveSummary = {
  [key: string]: string | any;
};

export type FinancialMetrics = {
  [key: string]: string;
};

export type PaginationTranslations = {
  [key: string]: string;
};

export type SupplyPlanningTranslations = {
  [key: string]: string | any;
};

export type SustainabilityMetrics = {
  [key: string]: string;
};

export type UITranslations = {
  [key: string]: string;
};

export type ModulesSummary = {
  [key: string]: string;
};

export type MarketingTranslations = {
  [key: string]: string | any;
};
