
import { Translations } from './types';
import { navigationTranslations } from './navigation';
import { uiTranslations } from './common/ui';
import { inventoryTranslations } from './common/inventory';
import { supplyPlanningTranslations } from './common/supplyPlanning';
import { moduleTranslations } from './common/modules';
import { chartTranslations } from './common/charts';
import { paginationTranslations } from './common/pagination';
import { logisticsTranslations } from './common/logistics';
import { ddsopTranslations } from './common/ddsop';
import { toArabicNumerals } from './utils';

export { toArabicNumerals };

export const translations: Translations = {
  dashboard: {
    en: 'Dashboard',
    ar: 'لوحة القيادة',
  },
  navigationItems: navigationTranslations,
  common: {
    ...uiTranslations,
    
    // Inventory translations
    inventoryTitle: inventoryTranslations.inventoryTitle,
    bufferZones: inventoryTranslations.bufferZones,
    skuClassification: inventoryTranslations.skuClassification,
    leadTime: inventoryTranslations.leadTime,
    replenishmentOrders: inventoryTranslations.replenishmentOrders,
    bufferStatus: inventoryTranslations.bufferStatus,
    netFlowPosition: inventoryTranslations.netFlowPosition,
    inventorySummary: inventoryTranslations.inventorySummary,
    
    // Chart translations
    chartTitles: chartTranslations.chartTitles,
    zones: chartTranslations.zones,
    
    // Pagination translations
    next: paginationTranslations.next,
    previous: paginationTranslations.previous,
    page: paginationTranslations.page,
    of: paginationTranslations.of,
    perPage: paginationTranslations.perPage,
    items: paginationTranslations.items,
    showing: paginationTranslations.showing,
    to: paginationTranslations.to,
    
    // Dashboard metrics
    skuCount: {
      en: "SKU Count",
      ar: "عدد وحدات التخزين"
    },
    accuracyLabel: {
      en: "Accuracy",
      ar: "الدقة"
    },
    pipelineValue: {
      en: "Pipeline Value",
      ar: "قيمة خط الأنابيب"
    },
    activeCampaigns: {
      en: "Active Campaigns",
      ar: "الحملات النشطة"
    },
    onTimeDelivery: {
      en: "On-Time Delivery",
      ar: "التسليم في الوقت المحدد"
    },
    reportCount: {
      en: "Available Reports",
      ar: "التقارير المتاحة"
    },
    thisQuarter: {
      en: "this quarter",
      ar: "هذا الربع"
    },
    fromLastMonth: {
      en: "from last month",
      ar: "من الشهر الماضي"
    },
    fromLastWeek: {
      en: "from last week",
      ar: "من الأسبوع الماضي"
    },
    viewDetails: {
      en: "View Details",
      ar: "عرض التفاصيل"
    },
    modules: {
      en: "Modules",
      ar: "الوحدات"
    },
    
    // Module translations
    ...moduleTranslations,
    
    // Include full sections as nested objects
    logistics: logisticsTranslations,
    inventory: inventoryTranslations
  },
  sales: {
    en: {
      title: "Sales Planning",
      description: "Manage and track your sales plans",
    },
    ar: {
      title: "تخطيط المبيعات",
      description: "إدارة وتتبع خطط المبيعات الخاصة بك",
    }
  },
  supplyPlanning: supplyPlanningTranslations,
  ddsop: ddsopTranslations,
  // Dashboard metrics translations
  dashboardMetrics: {
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
  },
  // Financial metrics translations
  financialMetrics: {
    title: {
      en: "Financial Metrics",
      ar: "المقاييس المالية"
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
  },
  // Sustainability metrics translations
  sustainabilityMetrics: {
    title: {
      en: "Sustainability Metrics",
      ar: "مقاييس الاستدامة"
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
      ar: "الموردين الخضر"
    },
    yearlyReduction: {
      en: "Yearly reduction",
      ar: "تخفيض سنوي"
    },
    wasteEfficiency: {
      en: "Waste efficiency",
      ar: "كفاءة النفايات"
    },
    sustainableSourcing: {
      en: "Sustainable sourcing",
      ar: "التوريد المستدام"
    }
  },
  // Module summary translations
  modulesSummary: {
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
      ar: "حملات التسويق"
    },
    logistics: {
      en: "Logistics",
      ar: "الخدمات اللوجستية"
    },
    reportsAnalytics: {
      en: "Reports & Analytics",
      ar: "التقارير والتحليلات"
    }
  }
};

export type Language = 'en' | 'ar';

export function getTranslation(key: string, language: Language) {
  const keys = key.split('.');
  let current: any = translations;

  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return the key as fallback instead of undefined
    }
    current = current[k];
  }

  return current[language];
}
