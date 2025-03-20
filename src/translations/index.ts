
import { Translations } from './types';
import { navigationTranslations } from './navigation';
import { dashboardTranslations } from './common/dashboard';
import { modulesSummaryTranslations } from './common/modules';
import { uiTranslations } from './common/ui';
import { chartTranslations } from './common/charts';
import { inventoryTranslations } from './common/inventory';
import { paginationTranslations } from './common/pagination';
import { supplyPlanningTranslations } from './common/supplyPlanning';
import { financialMetricsTranslations } from './common/financialMetrics';
import { sustainabilityMetricsTranslations } from './common/sustainabilityMetrics';
import { logisticsTranslations } from './common/logistics';
import { ddsopTranslations } from './common/ddsop';
import { salesTranslations } from './common/sales';
import { toArabicNumerals } from './utils';

export { toArabicNumerals };

export const translations: Translations = {
  dashboard: {
    en: 'Dashboard',
    ar: 'لوحة القيادة',
  },
  navigationItems: navigationTranslations,
  dashboardMetrics: dashboardTranslations,
  financialMetrics: financialMetricsTranslations,
  sustainabilityMetrics: sustainabilityMetricsTranslations,
  modulesSummary: modulesSummaryTranslations,
  common: {
    // UI translations
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
    
    // Include full sections as nested objects
    logistics: logisticsTranslations,
    inventory: inventoryTranslations,
    ddsop: ddsopTranslations
  },
  sales: salesTranslations,
  supplyPlanning: supplyPlanningTranslations,
  ddsop: ddsopTranslations,
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
