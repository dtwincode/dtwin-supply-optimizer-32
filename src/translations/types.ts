
export interface translations {
  en: {
    common: CommonTranslations;
    sales: SalesTranslations;
    navigation: NavigationTranslations;
    dashboard: DashboardTranslations;
    utils: UtilsTranslations;
    inventory: InventoryTranslations;
    marketing: MarketingTranslations;
    settings: SettingsTranslations;
  };
  ar: {
    common: CommonTranslations;
    sales: SalesTranslations;
    navigation: NavigationTranslations;
    dashboard: DashboardTranslations;
    utils: UtilsTranslations;
    inventory: InventoryTranslations;
    marketing: MarketingTranslations;
    settings: SettingsTranslations;
  };
}

export interface CommonTranslations {
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  create: string;
  update: string;
  submit: string;
  loading: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  confirm: string;
  next: string;
  previous: string;
  back: string;
  search: string;
  filter: string;
  clear: string;
  all: string;
  none: string;
  select: string;
  logout: string;
  login: string;
  register: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  address: string;
  name: string;
  description: string;
  inventory: InventoryCommonTranslations;
  modules: string;
  skuCount: string;
  accuracyLabel: string;
  pipelineValue: string;
  activeCampaigns: string;
  onTimeDelivery: string;
  reportCount: string;
  chartTitles: {
    bufferProfile: string;
    demandVariability: string;
  };
  zones: {
    green: string;
    yellow: string;
    red: string;
  };
}

export interface NavigationTranslations {
  dashboard: string;
  forecasting: string;
  inventory: string;
  marketing: string;
  sales: string;
  logistics: string;
  reporting: string;
  settings: string;
}

export interface NavigationItems {
  [key: string]: {
    en: string;
    ar: string;
  };
}

export interface DashboardTranslations {
  title: string;
  overview: string;
  recentActivity: string;
  metrics: string;
  performance: string;
  trends: string;
  alerts: string;
  notifications: string;
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

export interface UtilsTranslations {
  dateTime: {
    today: string;
    yesterday: string;
    tomorrow: string;
    last7Days: string;
    last30Days: string;
    thisMonth: string;
    lastMonth: string;
    custom: string;
  };
}

export interface InventoryTranslations {
  title: string;
  subtitle: string;
  metrics: {
    onHand: string;
    onOrder: string;
    allocated: string;
    available: string;
    stockouts: string;
    overstock: string;
    turnover: string;
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
  refresh: string;
  addDecouplingPoint: string;
  decouplingNetwork: string;
  listView: string;
  locationId: string;
  type: string;
  description: string;
  actions: string;
  noDecouplingPoints: string;
  edit: string;
  delete: string;
  confirmDelete: string;
  success: string;
  decouplingPointDeleted: string;
  decouplingPointSaved: string;
  networkVisualization: string;
  nodes: string;
  nodesDescription: string;
  links: string;
  linksDescription: string;
  totalItems: string;
  networkHelp: string;
}

export interface SalesTranslations {
  title: string;
  subtitle: string;
  metrics: {
    revenue: string;
    orders: string;
    customers: string;
    avgOrderValue: string;
    returnRate: string;
  };
  salesTrends: string;
  comparePlannedVsActual: string;
  monthly: string;
  quarterly: string;
  yearly: string;
  whatIfScenarios: string;
  exploreSalesScenarios: string;
  forecastIntegration: string;
  integrationWithForecasts: string;
}

export interface MarketingTranslations {
  title: string;
  subtitle: string;
  metrics: {
    campaigns: string;
    leads: string;
    conversion: string;
    cac: string;
    roi: string;
  };
}

export interface SettingsTranslations {
  title: string;
  subtitle: string;
  tabs: {
    masterData: string;
    historicalData: string;
    settings: string;
  };
  masterData: {
    title: string;
    description: string;
    products: string;
    locations: string;
    vendors: string;
    productHierarchy: string;
    locationHierarchy: string;
  };
  historicalData: {
    title: string;
    description: string;
    sales: string;
    inventory: string;
    leadTime: string;
    replenishment: string;
  };
  upload: {
    title: string;
    description: string;
    button: string;
    dragDrop: string;
    formats: string;
    success: string;
    error: string;
  };
}

export interface UITranslations {
  darkMode: string;
  lightMode: string;
  menu: string;
  close: string;
  expand: string;
  collapse: string;
}

export interface PaginationTranslations {
  prev: string;
  next: string;
  page: string;
  of: string;
  showing: string;
  to: string;
  results: string;
}

export interface ModulesSummary {
  inventoryManagement: {
    en: string;
    ar: string;
  };
  demandForecasting: {
    en: string;
    ar: string;
  };
  salesPlanning: {
    en: string;
    ar: string;
  };
  marketingCampaigns: {
    en: string;
    ar: string;
  };
  logistics: {
    en: string;
    ar: string;
  };
  reportsAnalytics: {
    en: string;
    ar: string;
  };
}
