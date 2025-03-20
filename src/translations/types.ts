
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

export type CommonTranslations = {
  // UI Common translations
  settings: TranslationValue;
  logout: TranslationValue;
  cancel: TranslationValue;
  save: TranslationValue;
  edit: TranslationValue;
  delete: TranslationValue;
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
  
  // Include additional properties needed for dashboards
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
};

export type DashboardMetrics = {
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
};

export type Translations = {
  dashboard: TranslationValue;
  navigationItems: NavigationItems;
  common: CommonTranslations;
  sales: {
    en: {
      title: string;
      description: string;
    };
    ar: {
      title: string;
      description: string;
    };
  };
  supplyPlanning: any;
  ddsop: any;
  dashboardMetrics: DashboardMetrics;
  financialMetrics: FinancialMetrics;
  sustainabilityMetrics: SustainabilityMetrics;
  modulesSummary: ModulesSummary;
};
