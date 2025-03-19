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
    recommendedOrders: {
      en: string;
      ar: string;
    };
    purchaseOrders: {
      en: string;
      ar: string;
    };
    supplierManagement: {
      en: string;
      ar: string;
    };
    leadTimeManagement: {
      en: string;
      ar: string;
    };
  };
  searchItems: {
    en: string;
    ar: string;
  };
  supplier: {
    en: string;
    ar: string;
  };
  status: {
    en: string;
    ar: string;
    planned: {
      en: string;
      ar: string;
    };
    ordered: {
      en: string;
      ar: string;
    };
    confirmed: {
      en: string;
      ar: string;
    };
    shipped: {
      en: string;
      ar: string;
    };
    received: {
      en: string;
      ar: string;
    };
  };
  priority: {
    en: string;
    ar: string;
    critical: {
      en: string;
      ar: string;
    };
    high: {
      en: string;
      ar: string;
    };
    medium: {
      en: string;
      ar: string;
    };
    low: {
      en: string;
      ar: string;
    };
  };
  currentStock: {
    en: string;
    ar: string;
  };
  recommendedQty: {
    en: string;
    ar: string;
  };
  leadTime: {
    en: string;
    ar: string;
  };
  days: {
    en: string;
    ar: string;
  };
  creating: {
    en: string;
    ar: string;
  };
  createPO: {
    en: string;
    ar: string;
  };
  noRecommendedOrders: {
    en: string;
    ar: string;
  };
  notifications: {
    poCreated: {
      en: string;
      ar: string;
    };
    poCreatedDesc: {
      en: string;
      ar: string;
    };
    poError: {
      en: string;
      ar: string;
    };
    poErrorDesc: {
      en: string;
      ar: string;
    };
  };
  avgLeadTime: {
    en: string;
    ar: string;
  };
  leadTimeVariability: {
    en: string;
    ar: string;
  };
  leadTimeReliability: {
    en: string;
    ar: string;
  };
  acrossAllSuppliers: {
    en: string;
    ar: string;
  };
  standardDeviation: {
    en: string;
    ar: string;
  };
  ordersOnTime: {
    en: string;
    ar: string;
  };
  fromLastMonth: {
    en: string;
    ar: string;
  };
  generateRecommendations: {
    en: string;
    ar: string;
  };
  leadTimeCalculations: {
    en: string;
    ar: string;
  };
  leadTimeCalculationsDesc: {
    en: string;
    ar: string;
  };
  leadTimeCategories: {
    en: string;
    ar: string;
  };
  variabilityLevels: {
    en: string;
    ar: string;
  };
  ddmrpImpact: {
    en: string;
    ar: string;
  };
  moduleDescription: {
    en: string;
    ar: string;
  };
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
