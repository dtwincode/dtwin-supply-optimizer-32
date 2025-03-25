export type TranslationValue = {
  en: string;
  ar: string;
};

export type NavigationItems = {
  dashboard: TranslationValue;
  forecasting: TranslationValue;
  inventory: TranslationValue;
  supplyPlanning: TranslationValue;
  salesPlanning: TranslationValue;
  ddsop: TranslationValue;
  marketing: TranslationValue;
  logistics: TranslationValue;
  reports: TranslationValue;
  askAI: TranslationValue;
  data: TranslationValue;
  guidelines: TranslationValue;
};

export type UITranslations = {
  settings: TranslationValue;
  logout: TranslationValue;
  cancel: TranslationValue;
  save: TranslationValue;
  delete: TranslationValue;
  edit: TranslationValue;
  create: TranslationValue;
  search: TranslationValue;
  filter: TranslationValue;
  apply: TranslationValue;
  reset: TranslationValue;
  viewDetails: TranslationValue;
  skuCount: TranslationValue;
  accuracyLabel: TranslationValue;
  pipelineValue: TranslationValue;
  activeCampaigns: TranslationValue;
  onTimeDelivery: TranslationValue;
  reportCount: TranslationValue;
  fromLastMonth: TranslationValue;
  fromLastWeek: TranslationValue;
  thisQuarter: TranslationValue;
  modules: TranslationValue;
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
};

export type PaginationTranslations = {
  next: TranslationValue;
  previous: TranslationValue;
  page: TranslationValue;
  of: TranslationValue;
  perPage: TranslationValue;
  items: TranslationValue;
  showing: TranslationValue;
  to: TranslationValue;
  viewDetails: TranslationValue;
};

export type SupplyPlanningTranslations = {
  tabs: {
    recommendedOrders: TranslationValue;
    purchaseOrders: TranslationValue;
    supplierManagement: TranslationValue;
    leadTimeManagement: TranslationValue;
  };
  searchItems: TranslationValue;
  supplier: TranslationValue;
  status: TranslationValue;
  statusTypes: {
    planned: TranslationValue;
    ordered: TranslationValue;
    confirmed: TranslationValue;
    shipped: TranslationValue;
    received: TranslationValue;
  };
  priority: TranslationValue;
  priorityLevels: {
    critical: TranslationValue;
    high: TranslationValue;
    medium: TranslationValue;
    low: TranslationValue;
  };
  currentStock: TranslationValue;
  recommendedQty: TranslationValue;
  leadTime: TranslationValue;
  days: TranslationValue;
  creating: TranslationValue;
  createPO: TranslationValue;
  noRecommendedOrders: TranslationValue;
  notifications: {
    poCreated: TranslationValue;
    poCreatedDesc: TranslationValue;
    poError: TranslationValue;
    poErrorDesc: TranslationValue;
    poUpdated: TranslationValue;
    poUpdatedDesc: TranslationValue;
  };
  avgLeadTime: TranslationValue;
  leadTimeVariability: TranslationValue;
  leadTimeReliability: TranslationValue;
  acrossAllSuppliers: TranslationValue;
  standardDeviation: TranslationValue;
  ordersOnTime: TranslationValue;
  fromLastMonth: TranslationValue;
  generateRecommendations: TranslationValue;
  leadTimeCalculations: TranslationValue;
  leadTimeCalculationsDesc: TranslationValue;
  leadTimeCategories: TranslationValue;
  variabilityLevels: TranslationValue;
  ddmrpImpact: TranslationValue;
  moduleDescription: TranslationValue;
  recommendedOrders: TranslationValue;
  recommendedOrdersDesc: TranslationValue;
  all: TranslationValue;
  refresh: TranslationValue;
  purchaseOrdersDesc: TranslationValue;
  supplierManagementDesc: TranslationValue;
  leadTimeManagementDesc: TranslationValue;
  poNumber: TranslationValue;
  quantity: TranslationValue;
  orderDate: TranslationValue;
  deliveryDate: TranslationValue;
  actions: TranslationValue;
  noPurchaseOrders: TranslationValue;
  viewDetails: TranslationValue;
  trackShipment: TranslationValue;
  markAsReceived: TranslationValue;
  cancel: TranslationValue;
  reportIssue: TranslationValue;
  createPurchaseOrder: TranslationValue;
  editPurchaseOrder: TranslationValue;
  selectStatus: TranslationValue;
  selectDate: TranslationValue;
  notes: TranslationValue;
  notesPlaceholder: TranslationValue;
  update: TranslationValue;
  onTimeDelivery: TranslationValue;
  supplierPerformance: TranslationValue;
  qualityCompliance: TranslationValue;
  supplierQuality: TranslationValue;
  activeSuppliers: TranslationValue;
  totalSuppliers: TranslationValue;
  supplierPerformanceComparison: TranslationValue;
  supplierPerformanceDesc: TranslationValue;
  metrics: {
    reliability: TranslationValue;
    leadTime: TranslationValue;
    quality: TranslationValue;
    cost: TranslationValue;
  };
  supplierList: TranslationValue;
  supplierListDesc: TranslationValue;
  supplierName: TranslationValue;
  reliability: TranslationValue;
  leadTimeAdherence: TranslationValue;
  qualityScore: TranslationValue;
  costEfficiency: TranslationValue;
  viewPerformance: TranslationValue;
  contact: TranslationValue;
  leadTimeTrends: TranslationValue;
  sixMonthTrend: TranslationValue;
  minLeadTime: TranslationValue;
  maxLeadTime: TranslationValue;
  skuLeadTimes: TranslationValue;
  skuLeadTimesDesc: TranslationValue;
  leadTimeDays: TranslationValue;
  variability: TranslationValue;
  trend: TranslationValue;
  viewHistory: TranslationValue;
  leadTimeOptimization: TranslationValue;
  leadTimeOptimizationDesc: TranslationValue;
  riskAnalysis: TranslationValue;
  riskAnalysisDesc: TranslationValue;
  runAnalysis: TranslationValue;
  leadTimeReduction: TranslationValue;
  leadTimeReductionDesc: TranslationValue;
};

export type CommonTranslations = {
  // UI Common translations
  settings: TranslationValue;
  logout: TranslationValue;
  cancel: TranslationValue;
  save: TranslationValue;
  delete: TranslationValue;
  edit: TranslationValue;
  create: TranslationValue;
  search: TranslationValue;
  filter: TranslationValue;
  apply: TranslationValue;
  reset: TranslationValue;
  loading: TranslationValue;
  noData: TranslationValue;
  error: TranslationValue;
  success: TranslationValue;
  confirm: TranslationValue;
  back: TranslationValue;
  next: TranslationValue;
  submit: TranslationValue;
  skus: TranslationValue;
  modules: TranslationValue;
  
  // Inventory translations
  inventoryTitle: TranslationValue;
  bufferZones: TranslationValue;
  skuClassification: TranslationValue;
  leadTime: TranslationValue;
  replenishmentOrders: TranslationValue;
  bufferStatus: TranslationValue;
  netFlowPosition: TranslationValue;
  inventorySummary: TranslationValue;
  
  // Chart translations
  chartTitles: {
    bufferProfile: TranslationValue;
    replenishment: TranslationValue;
    netFlow: TranslationValue;
    demandVariability: TranslationValue;
    inventoryTrends: TranslationValue;
  };
  
  // Zone translations
  zones: {
    red: TranslationValue;
    yellow: TranslationValue;
    green: TranslationValue;
  };
  
  // Pagination translations
  previous: TranslationValue;
  page: TranslationValue;
  of: TranslationValue;
  perPage: TranslationValue;
  items: TranslationValue;
  showing: TranslationValue;
  to: TranslationValue;
  
  // Dashboard metrics
  skuCount: TranslationValue;
  accuracyLabel: TranslationValue;
  pipelineValue: TranslationValue;
  activeCampaigns: TranslationValue;
  onTimeDelivery: TranslationValue;
  reportCount: TranslationValue;
  thisQuarter: TranslationValue;
  fromLastMonth: TranslationValue;
  fromLastWeek: TranslationValue;
  viewDetails: TranslationValue;
  
  // Nested objects
  logistics: any;
  inventory: any;
  ddsop: any;
};

export type DashboardMetrics = {
  title: TranslationValue;
  totalSKUs: TranslationValue;
  bufferPenetration: TranslationValue;
  orderStatus: TranslationValue;
  flowIndex: TranslationValue;
};

export type FinancialMetrics = {
  title: TranslationValue;
  revenue: TranslationValue;
  operatingCosts: TranslationValue;
  profitMargin: TranslationValue;
};

export type SustainabilityMetrics = {
  title: TranslationValue;
  carbonFootprint: TranslationValue;
  wasteReduction: TranslationValue;
  greenSuppliers: TranslationValue;
  yearlyReduction: TranslationValue;
  wasteEfficiency: TranslationValue;
  sustainableSourcing: TranslationValue;
};

export type ModulesSummary = {
  inventoryManagement: TranslationValue;
  demandForecasting: TranslationValue;
  salesPlanning: TranslationValue;
  marketingCampaigns: TranslationValue;
  logistics: TranslationValue;
  reportsAnalytics: TranslationValue;
  viewDetails: TranslationValue;
};

export interface ExecutiveSummary {
  title: TranslationValue;
  lastUpdated: TranslationValue;
  kpis: {
    orderFulfillment: TranslationValue;
    inventoryTurnover: TranslationValue;
    stockoutRate: TranslationValue;
    planningCycleTime: TranslationValue;
  };
  performanceTrend: TranslationValue;
  performanceTrendDesc: TranslationValue;
  bufferDistribution: TranslationValue;
  bufferDistributionDesc: TranslationValue;
  criticalAlerts: TranslationValue;
  alerts: {
    lowBuffer: TranslationValue;
    lowBufferDesc: TranslationValue;
    demandSpike: TranslationValue;
    demandSpikeDesc: TranslationValue;
  };
  impact: {
    high: TranslationValue;
    medium: TranslationValue;
    low: TranslationValue;
  };
  noAlerts: TranslationValue;
  moduleHealth: TranslationValue;
  moduleHealthDesc: TranslationValue;
  status: {
    healthy: TranslationValue;
    warning: TranslationValue;
    critical: TranslationValue;
  };
  charts: {
    actual: TranslationValue;
    target: TranslationValue;
  };
}

export interface Translations {
  dashboard: TranslationValue;
  navigationItems: NavigationItems;
  dashboardMetrics: DashboardMetrics;
  financialMetrics: FinancialMetrics;
  sustainabilityMetrics: SustainabilityMetrics;
  modulesSummary: ModulesSummary;
  common: CommonTranslations;
  executiveSummary: ExecutiveSummary;
  sales: any;
  supplyPlanning: any;
  ddsop: any;
}
