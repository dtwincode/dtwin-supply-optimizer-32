
import { NavigationItems } from './types';

// Export the navigation items
export const navigationItems: NavigationItems = {
  dashboard: {
    en: "Dashboard",
    ar: "لوحة التحكم"
  },
  ddsop: {
    en: "DD S&OP",
    ar: "التخطيط الطلبي للمبيعات والعمليات"
  },
  forecasting: {
    en: "Forecasting",
    ar: "التنبؤ"
  },
  inventory: {
    en: "Inventory",
    ar: "المخزون"
  },
  inventoryClassification: {
    en: "SKU Classification",
    ar: "تصنيف وحدات التخزين"
  },
  supplyPlanning: {
    en: "Supply Planning",
    ar: "تخطيط الإمداد"
  },
  salesPlanning: {
    en: "Sales Planning",
    ar: "تخطيط المبيعات"
  },
  returnsManagement: {
    en: "Returns Management",
    ar: "إدارة المرتجعات"
  },
  marketing: {
    en: "Marketing",
    ar: "التسويق"
  },
  logistics: {
    en: "Logistics",
    ar: "الخدمات اللوجستية"
  },
  reports: {
    en: "Reports",
    ar: "التقارير"
  },
  askAI: {
    en: "Ask AI",
    ar: "اسأل الذكاء الاصطناعي"
  },
  data: {
    en: "Data Management",
    ar: "إدارة البيانات"
  },
  guidelines: {
    en: "Guidelines",
    ar: "الإرشادات"
  }
};

// Export the navigation items with the specific name expected in index.ts
export const navigationTranslations = navigationItems;
