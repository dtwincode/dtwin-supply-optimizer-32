export interface CommonTranslations {
  en: Record<string, any>;
  ar: Record<string, any>;
}

export interface UITranslations {
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  close: string;
}

export interface PaginationTranslations {
  prev: string;
  next: string;
  page: string;
  of: string;
  showing: string;
  to: string;
  results: string;
  previous: string;
  perPage: string;
  items: string;
}

export interface ModulesSummary {
  inventoryManagement: string;
  demandForecasting: string;
  salesPlanning: string;
  marketingCampaigns: string;
  logistics: string;
  reportsAnalytics: string;
}

export interface InventoryTranslations {
  title: string;
  overview: string;
  decoupling: string;
  classification: string;
  bufferManagement: string;
  netFlow: string;
  adu: string;
  aiInsights: string;
  itemCount: string;
  filterItems: string;
  searchItems: string;
  addDecouplingPoint: string;
  configureBuffer: string;
  manageClassification: string;
  viewInsights: string;
  reconfigureNetwork: string;
  optimizeBuffers: string;
  zoneStatus: string;
  inventoryTitle?: string;
  bufferZones?: string;
  bufferStatus?: string;
  skuClassification?: string;
  leadTime?: string;
  replenishmentOrders?: string;
  netFlowPosition?: string;
  inventorySummary?: string;
  inventoryLevels?: string;
  skuClassifications?: string;
  decouplingPoint?: string;
  manageAndTrack?: string;
  currentStock?: string;
  productFamily?: string;
  location?: string;
  name?: string;
  sku?: string;
  actions?: string;
  noItems?: string;
  loadingData?: string;
  loadingItem?: string;
  errorLoading?: string;
  errorLoadingConfig?: string;
  bufferManagementDesc?: string;
  createBufferProfile?: string;
  bufferProfiles?: string;
  bufferConfiguration?: string;
  bufferSimulation?: string;
  bufferSimulationDesc?: string;
  noBufferProfiles?: string;
  bufferProfileSaved?: string;
  leadTimeFactors?: string;
  leadTimeThresholds?: string;
  otherFactors?: string;
  replenishmentTime?: string;
  industry?: string;
  moq?: string;
  lotSizeFactor?: string;
  variabilityFactor?: string;
  selectADU?: string;
  selectLeadTime?: string;
  selectVariability?: string;
  simulatedBufferVisualization?: string;
  unitsPerDay?: string;
  days?: string;
  high?: string;
  medium?: string;
  low?: string;
  short?: string;
  long?: string;
  unknown?: string;
  variabilityLevel?: string;
  criticality?: string;
  score?: string;
  lastUpdated?: string;
  turnover?: string;
  description?: string;
  leadTimeCategory?: string;
  decouplingPoints?: string;
  decouplingNetwork?: string;
  listView?: string;
  locationId?: string;
  type?: string;
  edit?: string;
  delete?: string;
  noDecouplingPoints?: string;
  confirmDelete?: string;
  success?: string;
  decouplingPointDeleted?: string;
  decouplingPointSaved?: string;
  refresh?: string;
  networkVisualization?: string;
  nodes?: string;
  links?: string;
  configureDecouplingPoints?: string;
  strategicInfo?: string;
  customerOrderInfo?: string;
  stockPointInfo?: string;
  intermediateInfo?: string;
  bufferProfileInfo?: string;
  nodesDescription?: string;
  linksDescription?: string;
  networkHelp?: string;
  decouplingPointRecommendation?: string;
  decouplingPointRecommendationDesc?: string;
  decouplingPointRecommendationHelp?: string;
  locationSelection?: string;
  selectLocation?: string;
  weightFactors?: string;
  leadTimeFactor?: string;
  demandVariabilityFactor?: string;
  supplyReliabilityFactor?: string;
  inventoryCostFactor?: string;
  customerServiceFactor?: string;
  leadTimeFactorDesc?: string;
  demandVariabilityFactorDesc?: string;
  supplyReliabilityFactorDesc?: string;
  inventoryCostFactorDesc?: string;
  customerServiceFactorDesc?: string;
  locationFactorScores?: string;
  scoreFor?: string;
  analyzing?: string;
  analyzeDecouplingPoints?: string;
  recommendationScore?: string;
  recommendationStatus?: string;
  highlyRecommended?: string;
  recommended?: string;
  consider?: string;
  notRecommended?: string;
  suggestedType?: string;
  confidence?: string;
  viewDetailedAnalysis?: string;
  analysisComplete?: string;
  decouplingRecommendationsReady?: string;
  strategicDecouplingPoint?: string;
  customer_orderDecouplingPoint?: string;
  stock_pointDecouplingPoint?: string;
  intermediateDecouplingPoint?: string;
  stock?: string;
  buffer?: string;
  classify?: string;
  decouple?: string;
  netflow?: string;
  ai?: string;
  totalItems?: string;
  bufferProfile?: string;
}

export interface MarketingTranslations {
  title: string;
  overview: string;
  campaigns: string;
  analytics: string;
  forecastImpact: string;
  integration: string;
  createCampaign: string;
  viewAnalytics: string;
  optimizeCampaign: string;
  reviewPerformance: string;
  campaignPlanner: string;
  marketingCalendar: string;
  marketingModule?: string;
}

export interface SalesTranslations {
  title: string;
  salesPlanning: string;
  returnsManagement: string;
  newSalesPlan: string;
  viewReturns: string;
  orders?: string;
}

export interface TranslationsType {
  en: {
    common: Record<string, any>;
    navigation: Record<string, any>;
    dashboard: Record<string, any>;
    inventory: Record<string, any>;
    marketing: Record<string, any>;
    sales: Record<string, any>;
  };
  ar: {
    common: Record<string, any>;
    navigation: Record<string, any>;
    dashboard: Record<string, any>;
    inventory: Record<string, any>;
    marketing: Record<string, any>;
    sales: Record<string, any>;
  };
}

export interface InventoryCommonTranslations {
  lowStock: string;
  outOfStock: string;
  inStock: string;
  overstock: string;
  onOrder: string;
  allocated: string;
  available: string;
  decouplingPoints: string;
  configureDecouplingPoints: string;
  networkDescription: string;
  networkHelp: string;
  nodesDescription: string;
  linksDescription: string;
}

export interface NavigationItems {
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
}

export interface DashboardMetrics {
  title: {
    en: string;
    ar: string;
  };
  totalSKUs: {
    en: string;
    ar: string;
  };
  bufferPenetration: {
    en: string;
    ar: string;
  };
  orderStatus: {
    en: string;
    ar: string;
  };
  flowIndex: {
    en: string;
    ar: string;
  };
}

export interface ExecutiveSummary {
  title: {
    en: string;
    ar: string;
  };
  lastUpdated: {
    en: string;
    ar: string;
  };
  kpis: {
    orderFulfillment: {
      en: string;
      ar: string;
    };
    inventoryTurnover: {
      en: string;
      ar: string;
    };
    stockoutRate: {
      en: string;
      ar: string;
    };
    planningCycleTime: {
      en: string;
      ar: string;
    };
  };
  performanceTrend: {
    en: string;
    ar: string;
  };
  performanceTrendDesc: {
    en: string;
    ar: string;
  };
  bufferDistribution: {
    en: string;
    ar: string;
  };
  bufferDistributionDesc: {
    en: string;
    ar: string;
  };
  criticalAlerts: {
    en: string;
    ar: string;
  };
  alerts: {
    lowBuffer: {
      en: string;
      ar: string;
    };
    lowBufferDesc: {
      en: string;
      ar: string;
    };
    demandSpike: {
      en: string;
      ar: string;
    };
    demandSpikeDesc: {
      en: string;
      ar: string;
    };
  };
  impact: {
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
  noAlerts: {
    en: string;
    ar: string;
  };
  moduleHealth: {
    en: string;
    ar: string;
  };
  moduleHealthDesc: {
    en: string;
    ar: string;
  };
  status: {
    healthy: {
      en: string;
      ar: string;
    };
    warning: {
      en: string;
      ar: string;
    };
    critical: {
      en: string;
      ar: string;
    };
  };
  charts: {
    actual: {
      en: string;
      ar: string;
    };
    target: {
      en: string;
      ar: string;
    };
  };
}

export interface FinancialMetrics {
  title: {
    en: string;
    ar: string;
  };
  revenue: {
    en: string;
    ar: string;
  };
  operatingCosts: {
    en: string;
    ar: string;
  };
  profitMargin: {
    en: string;
    ar: string;
  };
}

export interface SustainabilityMetrics {
  title: {
    en: string;
    ar: string;
  };
  carbonFootprint: {
    en: string;
    ar: string;
  };
  wasteReduction: {
    en: string;
    ar: string;
  };
  greenSuppliers: {
    en: string;
    ar: string;
  };
}
