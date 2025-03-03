
import { DashboardMetrics, FinancialMetrics, SustainabilityMetrics, ModulesSummary, TranslationValue } from './types';

export const dashboardTitle: TranslationValue = {
  en: "Supply Chain Dashboard",
  ar: "لوحة تحكم سلسلة التوريد"
};

export const dashboardMetricsTranslations: DashboardMetrics = {
  totalSKUs: {
    en: "Total SKUs",
    ar: "إجمالي وحدات التخزين"
  },
  bufferPenetration: {
    en: "Buffer Penetration",
    ar: "اختراق المخزون"
  },
  orderStatus: {
    en: "Order Status",
    ar: "حالة الطلب"
  },
  flowIndex: {
    en: "Flow Index",
    ar: "مؤشر التدفق"
  }
};

export const financialMetricsTranslations: FinancialMetrics = {
  title: {
    en: "Financial Performance",
    ar: "الأداء المالي"
  },
  revenue: {
    en: "Revenue",
    ar: "الإيرادات"
  },
  operatingCosts: {
    en: "Operating Costs",
    ar: "تكاليف التشغيل"
  },
  profitMargin: {
    en: "Profit Margin",
    ar: "هامش الربح"
  }
};

export const sustainabilityMetricsTranslations: SustainabilityMetrics = {
  title: {
    en: "Sustainability",
    ar: "الاستدامة"
  },
  carbonFootprint: {
    en: "Carbon Footprint",
    ar: "البصمة الكربونية"
  },
  wasteReduction: {
    en: "Waste Reduction",
    ar: "تقليل النفايات"
  },
  greenSuppliers: {
    en: "Green Suppliers",
    ar: "الموردون الخضر"
  },
  yearlyReduction: {
    en: "Annual reduction in CO2 emissions",
    ar: "تخفيض سنوي في انبعاثات ثاني أكسيد الكربون"
  },
  wasteEfficiency: {
    en: "Improvement in waste management efficiency",
    ar: "تحسين كفاءة إدارة النفايات"
  },
  sustainableSourcing: {
    en: "Suppliers meeting sustainability standards",
    ar: "الموردون الذين يلبون معايير الاستدامة"
  }
};

export const modulesSummaryTranslations: ModulesSummary = {
  inventoryManagement: {
    en: "Inventory Management",
    ar: "إدارة المخزون"
  },
  demandForecasting: {
    en: "Demand Forecasting",
    ar: "التنبؤ بالطلب"
  },
  salesPlanning: {
    en: "Sales Planning",
    ar: "تخطيط المبيعات"
  },
  marketingCampaigns: {
    en: "Marketing Campaigns",
    ar: "الحملات التسويقية"
  },
  logistics: {
    en: "Logistics",
    ar: "الخدمات اللوجستية"
  },
  reportsAnalytics: {
    en: "Reports & Analytics",
    ar: "التقارير والتحليلات"
  },
  viewDetails: {
    en: "View Details",
    ar: "عرض التفاصيل"
  }
};
