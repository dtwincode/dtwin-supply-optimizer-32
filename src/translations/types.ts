
export interface TranslationValue {
  en: string;
  ar: string;
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

export interface ModuleTranslations {
  inventoryDescription: TranslationValue;
  forecastingDescription: TranslationValue;
  salesDescription: TranslationValue;
  marketingDescription: TranslationValue;
  logisticsDescription: TranslationValue;
  reportsDescription: TranslationValue;
  moduleDescriptions: TranslationValue;
}

export interface NavigationTranslations {
  dashboard: TranslationValue;
  sales: TranslationValue;
  inventory: TranslationValue;
  logistics: TranslationValue;
  forecasting: TranslationValue;
  supplyPlanning: TranslationValue;
  marketing: TranslationValue;
}

export interface DashboardMetricsTranslations {
  totalRevenue: TranslationValue;
  ordersProcessed: TranslationValue;
  customerSatisfaction: TranslationValue;
  averageOrderValue: TranslationValue;
  websiteTraffic: TranslationValue;
  conversionRate: TranslationValue;
  customerRetentionRate: TranslationValue;
  emailOpenRate: TranslationValue;
  socialMediaEngagement: TranslationValue;
}

export interface FinancialMetricsTranslations {
  grossProfit: TranslationValue;
  netIncome: TranslationValue;
  operatingMargin: TranslationValue;
  revenueGrowth: TranslationValue;
  costOfGoodsSold: TranslationValue;
  ebitda: TranslationValue;
  cashFlow: TranslationValue;
  accountsReceivable: TranslationValue;
  accountsPayable: TranslationValue;
  inventoryTurnover: TranslationValue;
}

export interface SustainabilityMetricsTranslations {
  carbonEmissions: TranslationValue;
  wasteReduction: TranslationValue;
  energyConsumption: TranslationValue;
  waterUsage: TranslationValue;
  recyclingRate: TranslationValue;
  sustainableSourcing: TranslationValue;
  employeeWellbeing: TranslationValue;
  communityEngagement: TranslationValue;
  ethicalPractices: TranslationValue;
  supplyChainSustainability: TranslationValue;
}

export interface ModulesSummaryTranslations {
  salesSummary: TranslationValue;
  inventorySummary: TranslationValue;
  logisticsSummary: TranslationValue;
  forecastingSummary: TranslationValue;
  supplyPlanningSummary: TranslationValue;
}

export interface CommonTranslations {
  // UI translations
  theme: TranslationValue;
  light: TranslationValue;
  dark: TranslationValue;
  system: TranslationValue;
  language: TranslationValue;
  english: TranslationValue;
  arabic: TranslationValue;
  signOut: TranslationValue;
  
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
  chartTitles: TranslationValue;
  zones: TranslationValue;
  
  // Pagination translations
  next: TranslationValue;
  previous: TranslationValue;
  page: TranslationValue;
  of: TranslationValue;
  perPage: TranslationValue;
  items: TranslationValue;
  showing: TranslationValue;
  to: TranslationValue;
  
  // Module translations
  dashboard: TranslationValue;
  sales: TranslationValue;
  inventory: TranslationValue;
  logistics: TranslationValue;
  forecasting: TranslationValue;
  supplyPlanning: TranslationValue;
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
  // Additional properties from the sales.ts file
  title: TranslationValue;
  newPlan: TranslationValue;
  topDown: TranslationValue;
  bottomUp: TranslationValue;
  filters: {
    category: TranslationValue;
    region: TranslationValue;
    status: TranslationValue;
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
  adu: TranslationValue;
  inventorySummary: TranslationValue;
  onHand: TranslationValue;
  onOrder: TranslationValue;
  allocated: TranslationValue;
  available: TranslationValue;
  bufferPenetration: TranslationValue;
  avgDailyUsage: TranslationValue;
  orders: TranslationValue;
  status: TranslationValue;
  quantity: TranslationValue;
  expectedDelivery: TranslationValue;
  inventoryLevel: TranslationValue;
  reorderPoint: TranslationValue;
  safetyStock: TranslationValue;
  inventoryPolicy: TranslationValue;
  green: TranslationValue;
  yellow: TranslationValue;
  red: TranslationValue;
  tooHigh: TranslationValue;
  optimal: TranslationValue;
  warning: TranslationValue;
  tooLow: TranslationValue;
  bufferDetails: TranslationValue;
  bufferZone: TranslationValue;
  bufferValue: TranslationValue;
  yellowZone: TranslationValue;
  redZone: TranslationValue;
  greenZone: TranslationValue;
  decouplingPoint: TranslationValue;
  supplier: TranslationValue;
  manufacturer: TranslationValue;
  distributor: TranslationValue;
  warehouse: TranslationValue;
  retailer: TranslationValue;
  consumer: TranslationValue;
  daysOfStock: TranslationValue;
  aduAnalysis: TranslationValue;
  aiInsights: TranslationValue;
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
  logisticsTrackingMap: TranslationValue;
  liveOn: TranslationValue;
  liveOff: TranslationValue;
  layers: TranslationValue;
  mapLayers: TranslationValue;
  shipments: TranslationValue;
  warehouses: TranslationValue;
  trafficData: TranslationValue;
  weatherOverlay: TranslationValue;
  showDelayedOnly: TranslationValue;
  activeShipments: TranslationValue;
  facilities: TranslationValue;
  mapUnavailable: TranslationValue;
  mapError: TranslationValue;
  eta: TranslationValue;
  delayedEta: TranslationValue;
  liveTrackingEnabled: TranslationValue;
  locationUpdatesEnabled: TranslationValue;
  liveTrackingDisabled: TranslationValue;
  inTransit: TranslationValue;
  delivered: TranslationValue;
  outForDelivery: TranslationValue;
  delayed: TranslationValue;
  processing: TranslationValue;
  exception: TranslationValue;
  searchPlaceholder: TranslationValue;
  filterByStatus: TranslationValue;
  allStatuses: TranslationValue;
  filterByCarrier: TranslationValue;
  allCarriers: TranslationValue;
  filterByDate: TranslationValue;
  advancedFilters: TranslationValue;
  clearFilters: TranslationValue;
  mapView: TranslationValue;
  mapViewSettings: TranslationValue;
  mapViewDescription: TranslationValue;
  showRoutes: TranslationValue;
  showHeatmap: TranslationValue;
  clusterMarkers: TranslationValue;
  refreshData: TranslationValue;
  analyticsView: TranslationValue;
  priority: TranslationValue;
  selectPriority: TranslationValue;
  allPriorities: TranslationValue;
  highPriority: TranslationValue;
  mediumPriority: TranslationValue;
  lowPriority: TranslationValue;
  region: TranslationValue;
  selectRegion: TranslationValue;
  allRegions: TranslationValue;
  shippingMethod: TranslationValue;
  selectShipping: TranslationValue;
  allMethods: TranslationValue;
  express: TranslationValue;
  standard: TranslationValue;
  economy: TranslationValue;
  sameDay: TranslationValue;
  deliveryTimeRange: TranslationValue;
  day: TranslationValue;
  days: TranslationValue;
  costRange: TranslationValue;
  international: TranslationValue;
  customsClearance: TranslationValue;
  specialHandling: TranslationValue;
  resetFilters: TranslationValue;
  applyFilters: TranslationValue;
  carrierPerformance: TranslationValue;
  carbonFootprint: TranslationValue;
  delayRate: TranslationValue;
  predictedVolume: TranslationValue;
  weatherImpact: TranslationValue;
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
  orderRef: TranslationValue;
  carrier: TranslationValue;
  trackingNumber: TranslationValue;
  statusLabel: TranslationValue;
  purchaseOrderPipeline: TranslationValue;
  monitorAndTrack: TranslationValue;
  routeOptimizationDesc: TranslationValue;
  transportModesDesc: TranslationValue;
  documentManagement: TranslationValue;
  uploadAndManage: TranslationValue;
  uploadedDocuments: TranslationValue;
  onTimeDeliveryRate: TranslationValue;
  averageTransitTime: TranslationValue;
  deliverySuccessRate: TranslationValue;
  costPerShipment: TranslationValue;
  lastUpdated: TranslationValue;
  notAvailable: TranslationValue;
  supplier: TranslationValue;
  stage: TranslationValue;
  startDate: TranslationValue;
  completion: TranslationValue;
  blockers: TranslationValue;
  none: TranslationValue;
  poPipeline: TranslationValue;
  notifications: TranslationValue;
  new: TranslationValue;
  markAllRead: TranslationValue;
  noNotifications: TranslationValue;
  markRead: TranslationValue;
  dismiss: TranslationValue;
  allNotificationsRead: TranslationValue;
  justNow: TranslationValue;
  minutesAgo: TranslationValue;
  hoursAgo: TranslationValue;
  daysAgo: TranslationValue;
  alert: TranslationValue;
  success: TranslationValue;
  info: TranslationValue;
  warning: TranslationValue;
  notificationsTab: TranslationValue;
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
}

export interface Translations {
  dashboard: TranslationValue;
  navigationItems: NavigationItems;
  dashboardMetrics: DashboardMetricsTranslations;
  financialMetrics: FinancialMetricsTranslations;
  sustainabilityMetrics: SustainabilityMetricsTranslations;
  modulesSummary: ModulesSummaryTranslations;
  common: CommonTranslations;
  sales: SalesTranslations;
  supplyPlanning: SupplyPlanningTranslations;
  forecasting: ForecastingTranslations;
}
