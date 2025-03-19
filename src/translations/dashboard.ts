
import { 
  DashboardMetricsTranslations, 
  FinancialMetricsTranslations, 
  SustainabilityMetricsTranslations, 
  ModulesSummaryTranslations, 
  TranslationItem 
} from './types';

export const dashboardTitle: TranslationItem = {
  en: "Dashboard",
  ar: "لوحة المعلومات"
};

export const dashboardMetricsTranslations: DashboardMetricsTranslations = {
  dashboardTitle: {
    en: "Dashboard Metrics",
    ar: "مقاييس لوحة المعلومات"
  },
  inventoryValue: {
    en: "Inventory Value",
    ar: "قيمة المخزون"
  },
  forecastAccuracy: {
    en: "Forecast Accuracy",
    ar: "دقة التنبؤ"
  },
  serviceLevel: {
    en: "Service Level",
    ar: "مستوى الخدمة"
  },
  stockoutsReduction: {
    en: "Stockouts Reduction",
    ar: "تقليل نفاد المخزون"
  },
  leadTimeVariance: {
    en: "Lead Time Variance",
    ar: "تباين وقت الانتظار"
  },
  inventoryTurnover: {
    en: "Inventory Turnover",
    ar: "دوران المخزون"
  },
  stockCoverageDays: {
    en: "Stock Coverage Days",
    ar: "أيام تغطية المخزون"
  }
};

export const financialMetricsTranslations: FinancialMetricsTranslations = {
  workingCapital: {
    en: "Working Capital",
    ar: "رأس المال العامل"
  },
  inventoryCost: {
    en: "Inventory Cost",
    ar: "تكلفة المخزون"
  },
  stockoutCost: {
    en: "Stockout Cost",
    ar: "تكلفة نفاد المخزون"
  },
  carryingCost: {
    en: "Carrying Cost",
    ar: "تكلفة الاحتفاظ"
  }
};

export const sustainabilityMetricsTranslations: SustainabilityMetricsTranslations = {
  wasteReduction: {
    en: "Waste Reduction",
    ar: "تقليل النفايات"
  },
  co2Emissions: {
    en: "CO2 Emissions",
    ar: "انبعاثات ثاني أكسيد الكربون"
  },
  energyConsumption: {
    en: "Energy Consumption",
    ar: "استهلاك الطاقة"
  }
};

export const modulesSummaryTranslations: ModulesSummaryTranslations = {
  inventoryOptimization: {
    en: "Inventory Optimization",
    ar: "تحسين المخزون"
  },
  forecastingPerformance: {
    en: "Forecasting Performance",
    ar: "أداء التنبؤ"
  },
  salesPlanning: {
    en: "Sales Planning",
    ar: "تخطيط المبيعات"
  },
  supplyPlanning: {
    en: "Supply Planning",
    ar: "تخطيط التوريد"
  },
  // Adding missing translations from console logs
  reportsAnalytics: {
    en: "Reports & Analytics",
    ar: "التقارير والتحليلات"
  }
};
