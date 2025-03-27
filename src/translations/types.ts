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

export interface DashboardTranslations {
  totalRevenue: Translation;
  orders: Translation;
  customers: Translation;
  averageOrderValue: Translation;
  topSellingProducts: Translation;
  revenueByChannel: Translation;
  customerAcquisitionCost: Translation;
  customerLifetimeValue: Translation;
  salesPerformance: Translation;
  marketingSpend: Translation;
  websiteTraffic: Translation;
  conversionRate: Translation;
  inventoryTurnover: Translation;
  stockLevels: Translation;
  supplierPerformance: Translation;
  leadTime: Translation;
  productionEfficiency: Translation;
  capacityUtilization: Translation;
  transportationCosts: Translation;
  deliveryPerformance: Translation;
  customerSatisfaction: Translation;
  netPromoterScore: Translation;
  customerRetentionRate: Translation;
  financialSummary: Translation;
  environmentalImpact: Translation;
  socialResponsibility: Translation;
  governanceCompliance: Translation;
}

export interface FinancialMetricsTranslations {
  revenue: Translation;
  grossProfit: Translation;
  netIncome: Translation;
  operatingMargin: Translation;
  currentRatio: Translation;
  debtToEquityRatio: Translation;
  returnOnAssets: Translation;
  earningsPerShare: Translation;
}

export interface ModulesSummaryTranslations {
  inventory: Translation;
  sales: Translation;
  marketing: Translation;
  logistics: Translation;
  supplyPlanning: Translation;
  reports: Translation;
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

export interface ExecutiveSummaryTranslations {
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
}

export interface InventoryTranslations {
  inventoryTitle: Translation;
  bufferZones: Translation;
  bufferStatus: Translation;
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
}

export interface UITranslations {
  // Define UI-specific translations here
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
}

export interface ChartTranslations {
  // Define chart-specific translations here
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
}

export interface LogisticsTranslations {
  dashboard: Translation;
  tracking: Translation;
  analytics: Translation;
  sustainability: Translation;
}

export interface DDsopTranslations {
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

// Add new interface for our comprehensive sustainability translations
export interface SustainabilityTranslations {
  [key: string]: SustainabilityTranslation;
}
