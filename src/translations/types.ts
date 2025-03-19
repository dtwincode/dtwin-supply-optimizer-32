export interface TranslationValue {
  en: string;
  ar: string;
}

export interface DashboardMetrics {
  totalSKUs: TranslationValue;
  bufferPenetration: TranslationValue;
  orderStatus: TranslationValue;
  flowIndex: TranslationValue;
}

export interface FinancialMetrics {
  title: TranslationValue;
  revenue: TranslationValue;
  operatingCosts: TranslationValue;
  profitMargin: TranslationValue;
}

export interface SustainabilityMetrics {
  title: TranslationValue;
  carbonFootprint: TranslationValue;
  wasteReduction: TranslationValue;
  greenSuppliers: TranslationValue;
  yearlyReduction: TranslationValue;
  wasteEfficiency: TranslationValue;
  sustainableSourcing: TranslationValue;
}

export interface ModulesSummary {
  inventoryManagement: TranslationValue;
  demandForecasting: TranslationValue;
  salesPlanning: TranslationValue;
  marketingCampaigns: TranslationValue;
  logistics: TranslationValue;
  reportsAnalytics: TranslationValue;
  viewDetails: TranslationValue;
}

export interface UITranslations {
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
}

export interface InventoryTranslations {
  inventoryTitle: TranslationValue;
  bufferZones: TranslationValue;
  skuClassification: TranslationValue;
  leadTime: TranslationValue;
  replenishmentOrders: TranslationValue;
  bufferStatus: TranslationValue;
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
}

export interface ChartTranslations {
  chartTitles: {
    bufferProfile: TranslationValue;
    demandVariability: TranslationValue;
    inventoryTrends: TranslationValue;
    forecastAccuracy: TranslationValue;
  };
  zones: {
    green: TranslationValue;
    yellow: TranslationValue;
    red: TranslationValue;
    inventory: TranslationValue;
  };
}

export interface PaginationTranslations {
  next: TranslationValue;
  previous: TranslationValue;
  page: TranslationValue;
  of: TranslationValue;
  perPage: TranslationValue;
  items: TranslationValue;
  showing: TranslationValue;
  to: TranslationValue;
  viewDetails: TranslationValue;
}

export interface ModuleTranslations {
  inventoryDescription: TranslationValue;
  forecastingDescription: TranslationValue;
  salesDescription: TranslationValue;
  marketingDescription: TranslationValue;
  logisticsDescription: TranslationValue;
  reportsDescription: TranslationValue;
  moduleDescriptions: TranslationValue;
}

export interface NavigationItems {
  dashboard: TranslationValue;
  forecasting: TranslationValue;
  inventory: TranslationValue;
  salesPlanning: TranslationValue;
  marketing: TranslationValue;
  logistics: TranslationValue;
  reports: TranslationValue;
  askAI: TranslationValue;
  data: TranslationValue;
  guidelines: TranslationValue;
  supplyPlanning: TranslationValue;
}

export interface LogisticsTranslations {
  routeOptimization: TranslationValue;
  transportModes: TranslationValue;
  optimizeRoute: TranslationValue;
  origin: TranslationValue;
  destination: TranslationValue;
  waypoints: TranslationValue;
  optimizationCriteria: TranslationValue;
  transportMode: TranslationValue;
  departureTime: TranslationValue;
  totalDistance: TranslationValue;
  totalTime: TranslationValue;
  totalCost: TranslationValue;
  emissions: TranslationValue;
  fuelConsumption: TranslationValue;
  savedRoutes: TranslationValue;
  criteria: {
    time: TranslationValue;
    cost: TranslationValue;
    emissions: TranslationValue;
  };
  status: {
    planned: TranslationValue;
    inProgress: TranslationValue;
    completed: TranslationValue;
  };
  orders: TranslationValue;
  poPipeline: TranslationValue;
  documents: TranslationValue;
  orderRef: TranslationValue;
  carrier: TranslationValue;
  trackingNumber: TranslationValue;
  statusLabel: TranslationValue;
  inTransit: TranslationValue;
  processing: TranslationValue;
  outForDelivery: TranslationValue;
  delivered: TranslationValue;
  purchaseOrderPipeline: TranslationValue;
  monitorAndTrack: TranslationValue;
  routeOptimizationDesc: TranslationValue;
  transportModesDesc: TranslationValue;
  documentManagement: TranslationValue;
  uploadAndManage: TranslationValue;
  uploadedDocuments: TranslationValue;
  optimizeSupplyChain: TranslationValue;
  logisticsTrackingMap: TranslationValue;
  mapUnavailable: TranslationValue;
  mapError: TranslationValue;
  onTimeDeliveryRate: TranslationValue;
  averageTransitTime: TranslationValue;
  deliverySuccessRate: TranslationValue;
  costPerShipment: TranslationValue;
  lastUpdated: TranslationValue;
  notAvailable: TranslationValue;
  supplier: TranslationValue;
  stage: TranslationValue;
  startDate: TranslationValue;
  eta: TranslationValue;
  completion: TranslationValue;
  blockers: TranslationValue;
  priority: TranslationValue;
  none: TranslationValue;
  highPriority: TranslationValue;
  mediumPriority: TranslationValue;
  lowPriority: TranslationValue;
}

export interface SupplyPlanningTranslations {
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
}

export interface SalesTranslations {
  title: TranslationValue;
}

export interface CommonTranslations {
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
  
  inventoryTitle: TranslationValue;
  bufferZones: TranslationValue;
  skuClassification: TranslationValue;
  leadTime: TranslationValue;
  replenishmentOrders: TranslationValue;
  netFlowPosition: TranslationValue;
  bufferStatus: TranslationValue;
  inventorySummary: TranslationValue;
  
  chartTitles: {
    bufferProfile: TranslationValue;
    demandVariability: TranslationValue;
    inventoryTrends: TranslationValue;
    forecastAccuracy: TranslationValue;
  };
  zones: {
    green: TranslationValue;
    yellow: TranslationValue;
    red: TranslationValue;
  };
  
  next: TranslationValue;
  previous: TranslationValue;
  page: TranslationValue;
  of: TranslationValue;
  perPage: TranslationValue;
  items: TranslationValue;
  showing: TranslationValue;
  to: TranslationValue;
  
  inventoryDescription: TranslationValue;
  forecastingDescription: TranslationValue;
  salesDescription: TranslationValue;
  marketingDescription: TranslationValue;
  logisticsDescription: TranslationValue;
  reportsDescription: TranslationValue;
  
  logistics?: LogisticsTranslations;
  inventory?: InventoryTranslations;
}

export interface Translations {
  dashboard: {
    en: string;
    ar: string;
  };
  navigationItems: NavigationItems;
  dashboardMetrics: DashboardMetrics;
  financialMetrics: FinancialMetrics;
  sustainabilityMetrics: SustainabilityMetrics;
  modulesSummary: ModulesSummary;
  common: CommonTranslations;
  sales: SalesTranslations;
  supplyPlanning: SupplyPlanningTranslations;
}
