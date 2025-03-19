
// Common translation types
export interface TranslationItem {
  en: string;
  ar: string;
}

// Main translations container type
export interface Translations {
  dashboard: TranslationItem;
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

// Navigation translations
export interface NavigationTranslations {
  dashboard: TranslationItem;
  inventory: TranslationItem;
  forecasting: TranslationItem;
  sales: TranslationItem;
  logistics: TranslationItem;
  supplyPlanning: TranslationItem;
  marketing: TranslationItem;
  reports: TranslationItem;
  settings: TranslationItem;
  guidelines: TranslationItem;
  askAI: TranslationItem;
}

// Dashboard translations
export interface DashboardMetricsTranslations {
  dashboardTitle: TranslationItem;
  inventoryValue: TranslationItem;
  forecastAccuracy: TranslationItem;
  serviceLevel: TranslationItem;
  stockoutsReduction: TranslationItem;
  leadTimeVariance: TranslationItem;
  inventoryTurnover: TranslationItem;
  stockCoverageDays: TranslationItem;
  [key: string]: TranslationItem;
}

export interface FinancialMetricsTranslations {
  workingCapital: TranslationItem;
  inventoryCost: TranslationItem;
  stockoutCost: TranslationItem;
  carryingCost: TranslationItem;
  [key: string]: TranslationItem;
}

export interface SustainabilityMetricsTranslations {
  wasteReduction: TranslationItem;
  co2Emissions: TranslationItem;
  energyConsumption: TranslationItem;
  [key: string]: TranslationItem;
}

export interface ModulesSummaryTranslations {
  inventoryOptimization: TranslationItem;
  forecastingPerformance: TranslationItem;
  salesPlanning: TranslationItem;
  supplyPlanning: TranslationItem;
  [key: string]: TranslationItem;
}

// Common translations sections
export interface CommonTranslations {
  ui: UITranslations;
  chartTitles: Record<string, TranslationItem>;
  zones: Record<string, TranslationItem>;
  pagination: PaginationTranslations;
  modules: ModuleTranslations;
  logistics: Record<string, any>;
  inventory: Record<string, any>;
  forecasting: Record<string, any>;
}

export interface UITranslations {
  save: TranslationItem;
  cancel: TranslationItem;
  submit: TranslationItem;
  create: TranslationItem;
  edit: TranslationItem;
  delete: TranslationItem;
  filter: TranslationItem;
  search: TranslationItem;
  loading: TranslationItem;
  noData: TranslationItem;
  confirmDelete: TranslationItem;
  [key: string]: TranslationItem;
}

export interface PaginationTranslations {
  next: TranslationItem;
  previous: TranslationItem;
  page: TranslationItem;
  of: TranslationItem;
  perPage: TranslationItem;
  items: TranslationItem;
  showing: TranslationItem;
  to: TranslationItem;
  [key: string]: TranslationItem;
}

export interface ModuleTranslations {
  sales: TranslationItem;
  inventory: TranslationItem;
  forecasting: TranslationItem;
  logistics: TranslationItem;
  supplyPlanning: TranslationItem;
  [key: string]: TranslationItem;
}

// Sales translations
export interface SalesTranslations {
  title: TranslationItem;
  newPlan: TranslationItem;
  topDown: TranslationItem;
  bottomUp: TranslationItem;
  filters: {
    category: TranslationItem;
    region: TranslationItem;
    status: TranslationItem;
  };
  salesPerformance: TranslationItem;
  revenue: TranslationItem;
  orders: TranslationItem;
  customers: TranslationItem;
  categories: TranslationItem;
  channels: TranslationItem;
  growth: TranslationItem;
  conversion: TranslationItem;
  salesTarget: TranslationItem;
  [key: string]: any;
}

// Supply Planning translations
export interface SupplyPlanningTranslations {
  title: TranslationItem;
  overview: TranslationItem;
  leadTimes: TranslationItem;
  orders: TranslationItem;
  supplierManagement: TranslationItem;
  recommendations: TranslationItem;
  purchaseOrders: TranslationItem;
  [key: string]: TranslationItem | Record<string, any>;
}

// Forecasting translations
export interface ForecastingTranslations {
  title: TranslationItem;
  accuracy: TranslationItem;
  models: TranslationItem;
  parameters: TranslationItem;
  historical: TranslationItem;
  predicted: TranslationItem;
  whatIf: TranslationItem;
  validation: TranslationItem;
  analysis: TranslationItem;
  distribution: TranslationItem;
  reconciliation: TranslationItem;
  factors: TranslationItem;
  [key: string]: TranslationItem | Record<string, any>;
}

// Helper to convert Arabic numerals
export function toArabicNumerals(num: number): string {
  return num.toString();
}
