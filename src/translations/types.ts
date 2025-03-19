export interface TranslationValue {
  en: string;
  ar: string;
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
}

export interface SupplyPlanningTranslations {
  supplyPlanningTitle: TranslationValue;
  demandForecast: TranslationValue;
  inventoryLevels: TranslationValue;
  productionCapacity: TranslationValue;
  procurement: TranslationValue;
  distribution: TranslationValue;
  masterProductionSchedule: TranslationValue;
  materialsRequirementsPlanning: TranslationValue;
  capacityRequirementsPlanning: TranslationValue;
  salesAndOperationsPlanning: TranslationValue;
  demandPlanning: TranslationValue;
  supplyChainOptimization: TranslationValue;
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
}
