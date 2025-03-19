
export interface TranslationValue {
  en: string;
  ar: string;
}

export interface NavigationTranslations {
  [key: string]: TranslationValue;
}

export interface UITranslations {
  [key: string]: TranslationValue;
}

export interface PaginationTranslations {
  [key: string]: TranslationValue;
}

export interface ModuleTranslations {
  [key: string]: TranslationValue;
}

export interface DashboardMetricsTranslations {
  totalRevenue: TranslationValue;
  ordersProcessed: TranslationValue;
  customerSatisfaction: TranslationValue;
  averageOrderValue: TranslationValue;
  newCustomers: TranslationValue;
  returningCustomers: TranslationValue;
  conversionRate: TranslationValue;
  inventoryTurnover: TranslationValue;
  supplyLeadTime: TranslationValue;
  [key: string]: TranslationValue;
}

export interface FinancialMetricsTranslations {
  grossProfit: TranslationValue;
  netIncome: TranslationValue;
  operatingMargin: TranslationValue;
  revenueGrowth: TranslationValue;
  cashFlow: TranslationValue;
  accountsReceivable: TranslationValue;
  inventoryValue: TranslationValue;
  expenseRatio: TranslationValue;
  daysPayable: TranslationValue;
  daysInventory: TranslationValue;
  [key: string]: TranslationValue;
}

export interface SustainabilityMetricsTranslations {
  carbonEmissions: TranslationValue;
  energyConsumption: TranslationValue;
  waterUsage: TranslationValue;
  recyclingRate: TranslationValue;
  wasteReduction: TranslationValue;
  sustainablePackaging: TranslationValue;
  greenTransportation: TranslationValue;
  renewableEnergy: TranslationValue;
  [key: string]: TranslationValue;
}

export interface ModulesSummaryTranslations {
  salesSummary: TranslationValue;
  inventorySummary: TranslationValue;
  logisticsSummary: TranslationValue;
  forecastingSummary: TranslationValue;
  supplyPlanningSummary: TranslationValue;
  [key: string]: TranslationValue;
}

export interface SalesTranslations {
  salesPerformance: TranslationValue;
  revenue: TranslationValue;
  orders: TranslationValue;
  customers: TranslationValue;
  averageOrderValue: TranslationValue;
  topSellingProducts: TranslationValue;
  salesChannels: TranslationValue;
  customerDemographics: TranslationValue;
  salesTrends: TranslationValue;
  regionalSales: TranslationValue;
  title: TranslationValue;
  newPlan: TranslationValue;
  topDown: TranslationValue;
  bottomUp: TranslationValue;
  filters: {
    category: TranslationValue;
    region: TranslationValue;
    status: TranslationValue;
  };
  [key: string]: TranslationValue | {
    category: TranslationValue;
    region: TranslationValue;
    status: TranslationValue;
  };
}

export interface SupplyPlanningTranslations {
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
  [key: string]: TranslationValue | any;
}

export interface LogisticsTranslations {
  optimizeSupplyChain: TranslationValue;
  dashboard: TranslationValue;
  tracking: TranslationValue;
  analytics: TranslationValue;
  sustainability: TranslationValue;
  recentShipments: TranslationValue;
  orders: TranslationValue;
  documents: TranslationValue;
  routes: TranslationValue;
  transport: TranslationValue;
  deliveryPerformance: TranslationValue;
  advancedAnalytics: TranslationValue;
  geographicDistribution: TranslationValue;
  heatmapAnalytics: TranslationValue;
  riskAnalysis: TranslationValue;
  deliveryRiskAssessment: TranslationValue;
  sustainableRouting: TranslationValue;
  ecoRoutingOptions: TranslationValue;
  sustainabilityReporting: TranslationValue;
  environmentalReports: TranslationValue;
  [key: string]: TranslationValue | any;
}

export interface ChartTranslations {
  chartTitles: {
    [key: string]: TranslationValue;
  };
  zones: {
    [key: string]: TranslationValue;
  };
  [key: string]: TranslationValue | {
    [key: string]: TranslationValue;
  };
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
  [key: string]: TranslationValue | any;
}

export interface ForecastingTranslations {
  analysis: TranslationValue;
  distribution: TranslationValue;
  whatIf: TranslationValue;
  external: TranslationValue;
  forecastModel: TranslationValue;
  modelAccuracy: TranslationValue;
  selectPeriod: TranslationValue;
  applyFilters: TranslationValue;
  [key: string]: TranslationValue | any;
}

export interface CommonTranslations {
  [key: string]: TranslationValue | any;
}

export interface Translations {
  dashboard: TranslationValue;
  navigationItems: NavigationTranslations;
  dashboardMetrics: DashboardMetricsTranslations;
  financialMetrics: FinancialMetricsTranslations;
  sustainabilityMetrics: SustainabilityMetricsTranslations;
  modulesSummary: ModulesSummaryTranslations;
  common: CommonTranslations;
  sales: SalesTranslations;
  supplyPlanning: SupplyPlanningTranslations;
  forecasting: ForecastingTranslations;
  [key: string]: TranslationValue | any;
}
