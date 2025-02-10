export type TranslationValue = {
  en: string;
  ar: string;
};

export type NavigationItems = {
  dashboard: TranslationValue;
  forecasting: TranslationValue;
  inventory: TranslationValue;
  salesPlanning: TranslationValue;
  marketing: TranslationValue;
  logistics: TranslationValue;
  reports: TranslationValue;
  askAI: TranslationValue;
  settings: TranslationValue;
};

export type DashboardMetrics = {
  totalSKUs: TranslationValue;
  bufferPenetration: TranslationValue;
  orderStatus: TranslationValue;
  flowIndex: TranslationValue;
};

export type FinancialMetrics = {
  revenue: TranslationValue;
  operatingCosts: TranslationValue;
  profitMargin: TranslationValue;
  title: TranslationValue;
};

export type SustainabilityMetrics = {
  carbonFootprint: TranslationValue;
  wasteReduction: TranslationValue;
  greenSuppliers: TranslationValue;
  title: TranslationValue;
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

export type CommonTranslations = {
  skus: TranslationValue;
  active: TranslationValue;
  pipeline: TranslationValue;
  onTime: TranslationValue;
  reports: TranslationValue;
  description: TranslationValue;
  accuracy: TranslationValue;
  planAndTrack: TranslationValue;
  manageInitiatives: TranslationValue;
  optimizeDelivery: TranslationValue;
  accessInsights: TranslationValue;
  chartTitles: {
    bufferProfile: TranslationValue;
    demandVariability: TranslationValue;
  };
  zones: {
    green: TranslationValue;
    yellow: TranslationValue;
    red: TranslationValue;
  };
};

export type SalesTranslations = {
  title: TranslationValue;
  newPlan: TranslationValue;
  topDown: TranslationValue;
  bottomUp: TranslationValue;
  filters: {
    category: TranslationValue;
    region: TranslationValue;
    status: TranslationValue;
  };
};

export type Translations = {
  dashboard: TranslationValue;
  navigationItems: NavigationItems;
  dashboardMetrics: DashboardMetrics;
  financialMetrics: FinancialMetrics;
  sustainabilityMetrics: SustainabilityMetrics;
  modulesSummary: ModulesSummary;
  common: CommonTranslations;
  sales: SalesTranslations;
};
