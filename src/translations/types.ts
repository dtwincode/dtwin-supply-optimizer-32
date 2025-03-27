
export type Language = 'en' | 'ar';

export interface Translation {
  en: string;
  ar: string;
}

export interface NavigationTranslations {
  home: Translation;
  inventory: Translation;
  supplyPlanning: Translation;
  sales: Translation;
  marketing: Translation;
  logistics: Translation;
  ddsop: Translation;
}

export interface NavigationItems extends Partial<NavigationTranslations> {
  dashboard?: Translation;
  forecasting?: Translation;
  inventoryClassification?: Translation;
  salesPlanning?: Translation;
  returnsManagement?: Translation;
  reports?: Translation;
  askAI?: Translation;
  data?: Translation;
  guidelines?: Translation;
}

export interface FinancialMetrics {
  title: Translation;
  revenue: Translation;
  operatingCosts: Translation;
  profitMargin: Translation;
}

export interface DashboardMetrics {
  title: Translation;
  totalSKUs: Translation;
  bufferPenetration: Translation;
  orderStatus: Translation;
  flowIndex: Translation;
}

export interface ModulesSummary {
  inventoryManagement: Translation;
  demandForecasting: Translation;
  salesPlanning: Translation;
  marketingCampaigns: Translation;
  logistics: Translation;
  reportsAnalytics: Translation;
  viewDetails: Translation;
}

export interface ExecutiveSummary {
  title: Translation;
  totalRevenue: Translation;
  newCustomers: Translation;
  averageOrderValue: Translation;
  customerSatisfaction: Translation;
  topSellingProducts: Translation;
  regionalSalesBreakdown: Translation;
  marketingCampaignPerformance: Translation;
  websiteTrafficTrends: Translation;
  customerAcquisitionCost: Translation;
  customerLifetimeValue: Translation;
  inventoryTurnoverRate: Translation;
  supplierLeadTime: Translation;
  productionDefectRate: Translation;
  transportationCostPerMile: Translation;
  ontimeDeliveryRate: Translation;
  employeeEngagementScore: Translation;
  carbonFootprint: Translation;
  communityInvolvement: Translation;
  governanceComplianceScore: Translation;
  lastUpdated: Translation;
  kpis: {
    orderFulfillment: Translation;
    inventoryTurnover: Translation;
    stockoutRate: Translation;
    planningCycleTime: Translation;
  };
  performanceTrend: Translation;
  performanceTrendDesc: Translation;
  bufferDistribution: Translation;
  bufferDistributionDesc: Translation;
  criticalAlerts: Translation;
  alerts: {
    lowBuffer: Translation;
    lowBufferDesc: Translation;
    demandSpike: Translation;
    demandSpikeDesc: Translation;
  };
  impact: {
    high: Translation;
    medium: Translation;
    low: Translation;
  };
  noAlerts: Translation;
  moduleHealth: Translation;
  moduleHealthDesc: Translation;
  status: {
    healthy: Translation;
    warning: Translation;
    critical: Translation;
  };
  charts: {
    actual: Translation;
    target: Translation;
  };
}

export interface SalesTranslations {
  salesOverview: Translation;
  revenueGrowth: Translation;
  salesByRegion: Translation;
  topSalesperson: Translation;
  salesPerformance: Translation;
  salesTargets: Translation;
  monthlySales: Translation;
  quarterlyPerformance: Translation;
  annualRevenue: Translation;
  salesFunnelAnalysis: Translation;
  leadConversionRate: Translation;
  opportunityWinRate: Translation;
  averageDealSize: Translation;
  salesCycleLength: Translation;
  customerRetentionRate: Translation;
  customerChurnRate: Translation;
  customerLifetimeValue: Translation;
  salesForecasting: Translation;
  predictiveSalesAnalytics: Translation;
  marketTrends: Translation;
  competitiveAnalysis: Translation;
  productPerformance: Translation;
  pricingStrategy: Translation;
  salesEfficiency: Translation;
  salesTechnologyAdoption: Translation;
  salesTrainingEffectiveness: Translation;
  salesProcessOptimization: Translation;
  salesEnablement: Translation;
  salesOperations: Translation;
}

export interface InventoryTranslations {
  inventoryTitle: Translation;
  bufferZones: Translation;
  skuClassification: Translation;
  leadTime: Translation;
  replenishmentOrders: Translation;
  netFlowPosition: Translation;
  inventorySummary: Translation;
  inventoryLevels: Translation;
  skuClassifications: Translation;
  decouplingPoint: Translation;
  addDecouplingPoint: Translation;
  manageAndTrack: Translation;
  currentStock: Translation;
  productFamily: Translation;
  location: Translation;
  name: Translation;
  sku: Translation;
  actions: Translation;
  noItems: Translation;
  loadingData: Translation;
  loadingItem: Translation;
  errorLoading: Translation;
  leadTimeCategory: Translation;
  variabilityLevel: Translation;
  criticality: Translation;
  score: Translation;
  lastUpdated: Translation;
  adu: Translation;
  turnover: Translation;
  decouplingPoints: Translation;
  decouplingNetwork: Translation;
  listView: Translation;
  locationId: Translation;
  type: Translation;
  description: Translation;
  edit: Translation;
  delete: Translation;
  noDecouplingPoints: Translation;
  confirmDelete: Translation;
  success: Translation;
  decouplingPointDeleted: Translation;
  decouplingPointSaved: Translation;
  refresh: Translation;
  networkVisualization: Translation;
  nodes: Translation;
  links: Translation;
  configureDecouplingPoints: Translation;
  strategicInfo: Translation;
  customerOrderInfo: Translation;
  stockPointInfo: Translation;
  intermediateInfo: Translation;
  bufferProfileInfo: Translation;
  nodesDescription: Translation;
  linksDescription: Translation;
  networkHelp: Translation;
  classification: {
    title: Translation;
    description: Translation;
  };
  decouplingPointRecommendation: Translation;
  decouplingPointRecommendationDesc: Translation;
  decouplingPointRecommendationHelp: Translation;
  locationSelection: Translation;
  selectLocation: Translation;
  weightFactors: Translation;
  leadTimeFactor: Translation;
  demandVariabilityFactor: Translation;
  supplyReliabilityFactor: Translation;
  inventoryCostFactor: Translation;
  customerServiceFactor: Translation;
  leadTimeFactorDesc: Translation;
  demandVariabilityFactorDesc: Translation;
  supplyReliabilityFactorDesc: Translation;
  inventoryCostFactorDesc: Translation;
  customerServiceFactorDesc: Translation;
  locationFactorScores: Translation;
  scoreFor: Translation;
  analyzing: Translation;
  analyzeDecouplingPoints: Translation;
  recommendationScore: Translation;
  recommendationStatus: Translation;
  highlyRecommended: Translation;
  recommended: Translation;
  consider: Translation;
  notRecommended: Translation;
  suggestedType: Translation;
  confidence: Translation;
  viewDetailedAnalysis: Translation;
  analysisComplete: Translation;
  decouplingRecommendationsReady: Translation;
  strategicDecouplingPoint: Translation;
  customer_orderDecouplingPoint: Translation;
  stock_pointDecouplingPoint: Translation;
  intermediateDecouplingPoint: Translation;
  totalItems: Translation;
  bufferStatus: Translation;
}

export interface UITranslations {
  table: Translation;
  loading: Translation;
  filters: Translation;
  search: Translation;
  apply: Translation;
  reset: Translation;
  edit: Translation;
  delete: Translation;
  view: Translation;
  create: Translation;
  cancel: Translation;
  save: Translation;
  confirm: Translation;
  back: Translation;
  next: Translation;
  submit: Translation;
  settings: Translation;
  logout: Translation;
  viewDetails: Translation;
  skuCount: Translation;
  accuracyLabel: Translation;
  pipelineValue: Translation;
  activeCampaigns: Translation;
  onTimeDelivery: Translation;
  reportCount: Translation;
  fromLastMonth: Translation;
  fromLastWeek: Translation;
  thisQuarter: Translation;
  modules: Translation;
}

export interface ChartTranslations {
  xAxis: Translation;
  yAxis: Translation;
  legend: Translation;
  tooltip: Translation;
}

export interface PaginationTranslations {
  previous: Translation;
  next: Translation;
  page: Translation;
  of: Translation;
  perPage: Translation;
  items: Translation;
  showing: Translation;
  to: Translation;
  viewDetails?: Translation;
}

export interface LogisticsTranslations {
  dashboard: Translation;
  tracking: Translation;
  analytics: Translation;
  sustainability: Translation;
}

export interface SupplyPlanningTranslations {
  demandForecasting: Translation;
  inventoryOptimization: Translation;
  productionPlanning: Translation;
  capacityManagement: Translation;
  supplyChainVisibility: Translation;
  riskManagement: Translation;
  supplierCollaboration: Translation;
  sAndOpPlanning: Translation;
  scenarioPlanning: Translation;
  performanceMonitoring: Translation;
  demandPlanningAccuracy: Translation;
  inventoryCarryingCost: Translation;
  productionCycleTime: Translation;
  capacityUtilizationRate: Translation;
  supplyChainLeadTime: Translation;
  supplierOnTimeDelivery: Translation;
  forecastErrorRate: Translation;
  inventoryObsolescenceRate: Translation;
  productionScheduleAdherence: Translation;
  supplyChainDisruptionFrequency: Translation;
  tabs?: any;
  searchItems: Translation;
  supplier: Translation;
  status: Translation;
  statusTypes: {
    planned: Translation;
    ordered: Translation;
    confirmed: Translation;
    shipped: Translation;
    received: Translation;
  };
  priority: Translation;
  priorityLevels: {
    critical: Translation;
    high: Translation;
    medium: Translation;
    low: Translation;
  };
  currentStock: Translation;
  recommendedQty: Translation;
  leadTime: Translation;
  days: Translation;
  creating: Translation;
  createPO: Translation;
  noRecommendedOrders: Translation;
  notifications: {
    poCreated: Translation;
    poCreatedDesc: Translation;
    poError: Translation;
    poErrorDesc: Translation;
    poUpdated: Translation;
    poUpdatedDesc: Translation;
  };
  avgLeadTime: Translation;
  leadTimeVariability: Translation;
  leadTimeReliability: Translation;
  acrossAllSuppliers: Translation;
  standardDeviation: Translation;
  ordersOnTime: Translation;
  fromLastMonth: Translation;
  generateRecommendations: Translation;
  leadTimeCalculations: Translation;
  leadTimeCalculationsDesc: Translation;
  leadTimeCategories: Translation;
  variabilityLevels: Translation;
  ddmrpImpact: Translation;
  moduleDescription: Translation;
  recommendedOrders: Translation;
  recommendedOrdersDesc: Translation;
  all: Translation;
  refresh: Translation;
  purchaseOrdersDesc: Translation;
  supplierManagementDesc: Translation;
  leadTimeManagementDesc: Translation;
  poNumber: Translation;
  quantity: Translation;
  orderDate: Translation;
  deliveryDate: Translation;
  actions: Translation;
  noPurchaseOrders: Translation;
  viewDetails: Translation;
  trackShipment: Translation;
  markAsReceived: Translation;
  cancel: Translation;
  reportIssue: Translation;
  createPurchaseOrder: Translation;
  editPurchaseOrder: Translation;
  selectStatus: Translation;
  selectDate: Translation;
  notes: Translation;
  notesPlaceholder: Translation;
  update: Translation;
  onTimeDelivery: Translation;
  supplierPerformance: Translation;
  qualityCompliance: Translation;
  supplierQuality: Translation;
  activeSuppliers: Translation;
  totalSuppliers: Translation;
  supplierPerformanceComparison: Translation;
  supplierPerformanceDesc: Translation;
  metrics: {
    reliability: Translation;
    leadTime: Translation;
    quality: Translation;
    cost: Translation;
  };
  supplierList: Translation;
  supplierListDesc: Translation;
  supplierName: Translation;
  reliability: Translation;
  leadTimeAdherence: Translation;
  qualityScore: Translation;
  costEfficiency: Translation;
  viewPerformance: Translation;
  contact: Translation;
  leadTimeTrends: Translation;
  sixMonthTrend: Translation;
  minLeadTime: Translation;
  maxLeadTime: Translation;
  skuLeadTimes: Translation;
  skuLeadTimesDesc: Translation;
  leadTimeDays: Translation;
  variability: Translation;
  trend: Translation;
  viewHistory: Translation;
  leadTimeOptimization: Translation;
  leadTimeOptimizationDesc: Translation;
  riskAnalysis: Translation;
  riskAnalysisDesc: Translation;
  runAnalysis: Translation;
  leadTimeReduction: Translation;
  leadTimeReductionDesc: Translation;
}

export interface DDSOPTranslations {
  title: Translation;
  description: Translation;
  strategicAlignment: Translation;
  demandDrivenPlanning: Translation;
  integratedExecution: Translation;
  performanceMeasurement: Translation;
  collaboration: Translation;
  visibility: Translation;
  agility: Translation;
  resilience: Translation;
  innovation: Translation;
  sustainability: Translation;
  customerCentricity: Translation;
  dataDrivenDecisionMaking: Translation;
  continuousImprovement: Translation;
  // Add the properties needed for getStatusBadge and getTrendIcon
  onTrack: Translation;
  warning: Translation;
  alert: Translation;
  upcoming: Translation;
  standby: Translation;
  pendingAction: Translation;
  inAssessment: Translation;
  monitored: Translation;
  improving: Translation;
  declining: Translation;
  stable: Translation;
  highImpact: Translation;
  mediumImpact: Translation;
  lowImpact: Translation;
}

export interface ZonesTranslations {
  green: Translation;
  yellow: Translation;
  red: Translation;
}

export interface SustainabilityTranslation {
  en: string;
  ar: string;
}

export interface SustainabilityMetrics {
  title: SustainabilityTranslation;
  carbonFootprint: SustainabilityTranslation;
  wasteReduction: SustainabilityTranslation;
  greenSuppliers: SustainabilityTranslation;
  yearlyReduction: SustainabilityTranslation;
  wasteEfficiency: SustainabilityTranslation;
  sustainableSourcing: SustainabilityTranslation;
}

export interface SustainabilityTranslations {
  [key: string]: SustainabilityTranslation;
}

export interface CommonTranslations {
  loading: Translation;
  noData: Translation;
  error: Translation;
  success: Translation;
  confirm: Translation;
  back: Translation;
  next: Translation;
  submit: Translation;
  skus: Translation;
  create: Translation;
  zones: Translation;
  inventoryTitle: Translation;
  bufferZones: Translation;
  skuClassification: Translation;
  leadTime: Translation;
  replenishmentOrders: Translation;
  bufferStatus: Translation;
  netFlowPosition: Translation;
  inventorySummary: Translation;
  chartTitles: Translation;
  replenishment: Translation;
  netFlow: Translation;
  inventoryTrends: Translation;
  previous: Translation;
  page: Translation;
  of: Translation;
  perPage: Translation;
  items: Translation;
  showing: Translation;
  to: Translation;
  settings: Translation;
  logout: Translation;
  cancel: Translation;
  save: Translation;
  delete: Translation;
  edit: Translation;
  search: Translation;
  filter: Translation;
  apply: Translation;
  reset: Translation;
  modules: Translation;
  skuCount: Translation;
  accuracyLabel: Translation;
  pipelineValue: Translation;
  activeCampaigns: Translation;
  onTimeDelivery: Translation;
  reportCount: Translation;
  thisQuarter: Translation;
  fromLastMonth: Translation;
  fromLastWeek: Translation;
  viewDetails: Translation;
}

export interface MarketingTranslations {
  campaignPerformance: Translation;
  leadGeneration: Translation;
  customerEngagement: Translation;
  brandAwareness: Translation;
  marketingRoi: Translation;
  websiteTraffic: Translation;
  conversionRates: Translation;
  socialMediaEngagement: Translation;
  emailMarketingPerformance: Translation;
  contentMarketingEffectiveness: Translation;
  seoPerformance: Translation;
  paidAdvertisingRoi: Translation;
  marketingAttribution: Translation;
  customerSegmentation: Translation;
  marketingAutomation: Translation;
  marketingTechnology: Translation;
  marketingBudgetAllocation: Translation;
  marketingTeamProductivity: Translation;
  competitiveAnalysis: Translation;
  marketTrends: Translation;
  customerInsights: Translation;
  marketingInnovation: Translation;
  brandReputation: Translation;
  customerLoyalty: Translation;
  marketingCompliance: Translation;
  marketingEthics: Translation;
  // Add the missing properties
  marketingModule: Translation;
  dashboard: Translation;
  calendar: Translation;
  analytics: Translation;
  forecastImpact: Translation;
  averageROI: Translation;
  avgDemandImpact: Translation;
  conversionRate: Translation;
  roi: Translation;
  demandImpact: Translation;
  customerAcquisition: Translation;
  baselineForecast: Translation;
  withCampaigns: Translation;
  averageUplift: Translation;
  campaignForecastDescription: Translation;
  supplyChainIntegration: Translation;
  inventory: Translation;
  forecast: Translation;
  supply: Translation;
  inventoryAlerts: Translation;
  forecastUpdates: Translation;
  supplyRequirements: Translation;
  leadTime: Translation;
  marketingMetrics: {
    campaignROI: Translation;
    customerAcquisition: Translation;
    conversionRate: Translation;
    demandImpact: Translation;
  };
  percentageReturn: Translation;
  percent: Translation;
  target: Translation;
  trend: Translation;
  improving: Translation;
  declining: Translation;
  stable: Translation;
}
