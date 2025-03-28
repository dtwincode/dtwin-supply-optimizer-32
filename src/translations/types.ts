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
