
import { translations } from './types';
import { navigationTranslations } from './navigation';
import { dashboardTranslations } from './dashboard';
import { inventoryTranslations } from './inventory';
import { salesTranslations } from './sales';
import { marketingTranslations } from './marketing';
import { commonTranslations } from './common';
import { utilsTranslations } from './utilities';
import { financialMetricsTranslations } from './common/financialMetrics';
import { sustainabilityMetricsTranslations } from './common/sustainabilityMetrics';
import { modulesSummaryTranslations } from './common/modules';
import { uiTranslations } from './common/ui';
import { paginationTranslations } from './common/pagination';
import { toArabicNumerals } from './utils';

// Settings translations
const settingsTranslations = {
  en: {
    title: "Data Management",
    subtitle: "Upload and manage your data",
    tabs: {
      masterData: "Master Data",
      historicalData: "Historical Data",
      settings: "Settings"
    },
    masterData: {
      title: "Master Data",
      description: "Upload and manage your master data",
      products: "Products",
      locations: "Locations",
      vendors: "Vendors",
      productHierarchy: "Product Hierarchy",
      locationHierarchy: "Location Hierarchy"
    },
    historicalData: {
      title: "Historical Data",
      description: "Upload and manage your historical data",
      sales: "Sales",
      inventory: "Inventory",
      leadTime: "Lead Time",
      replenishment: "Replenishment"
    },
    upload: {
      title: "Upload Data",
      description: "Upload your data in CSV or Excel format",
      button: "Upload",
      dragDrop: "Drag and drop files here or click to browse",
      formats: "Supported formats",
      success: "Data uploaded successfully",
      error: "Error uploading data"
    }
  },
  ar: {
    title: "إدارة البيانات",
    subtitle: "تحميل وإدارة بياناتك",
    tabs: {
      masterData: "البيانات الرئيسية",
      historicalData: "البيانات التاريخية",
      settings: "الإعدادات"
    },
    masterData: {
      title: "البيانات الرئيسية",
      description: "تحميل وإدارة البيانات الرئيسية الخاصة بك",
      products: "المنتجات",
      locations: "المواقع",
      vendors: "الموردين",
      productHierarchy: "هيكل المنتجات",
      locationHierarchy: "هيكل المواقع"
    },
    historicalData: {
      title: "البيانات التاريخية",
      description: "تحميل وإدارة البيانات التاريخية الخاصة بك",
      sales: "المبيعات",
      inventory: "المخزون",
      leadTime: "وقت التسليم",
      replenishment: "إعادة التزويد"
    },
    upload: {
      title: "تحميل البيانات",
      description: "قم بتحميل بياناتك بتنسيق CSV أو Excel",
      button: "تحميل",
      dragDrop: "اسحب وأفلت الملفات هنا أو انقر للتصفح",
      formats: "التنسيقات المدعومة",
      success: "تم تحميل البيانات بنجاح",
      error: "خطأ في تحميل البيانات"
    }
  }
};

// Common translations for custom modules and features
const commonCustomTranslations = {
  en: {
    modules: "System Modules",
    skuCount: "SKUs",
    accuracyLabel: "Accuracy",
    pipelineValue: "Pipeline Value",
    activeCampaigns: "Active Campaigns",
    onTimeDelivery: "On-Time Delivery",
    reportCount: "Available Reports",
    chartTitles: {
      bufferProfile: "Buffer Profile by Category",
      demandVariability: "Demand Variability vs Buffer Levels"
    },
    zones: {
      green: "Green Zone",
      yellow: "Yellow Zone",
      red: "Red Zone"
    }
  },
  ar: {
    modules: "وحدات النظام",
    skuCount: "وحدات التخزين",
    accuracyLabel: "الدقة",
    pipelineValue: "قيمة الأنابيب",
    activeCampaigns: "الحملات النشطة",
    onTimeDelivery: "التسليم في الوقت المحدد",
    reportCount: "التقارير المتاحة",
    chartTitles: {
      bufferProfile: "ملف المخزون حسب الفئة",
      demandVariability: "تباين الطلب مقابل مستويات المخزون"
    },
    zones: {
      green: "المنطقة الخضراء",
      yellow: "المنطقة الصفراء",
      red: "المنطقة الحمراء"
    }
  }
};

// Full combined translations
export const allTranslations: translations = {
  en: {
    common: {
      ...commonTranslations.en,
      ...commonCustomTranslations.en
    },
    sales: salesTranslations.en,
    navigation: navigationTranslations.en,
    dashboard: dashboardTranslations.en,
    utils: utilsTranslations.en,
    inventory: inventoryTranslations.en,
    marketing: marketingTranslations.en,
    settings: settingsTranslations.en
  },
  ar: {
    common: {
      ...commonTranslations.ar,
      ...commonCustomTranslations.ar
    },
    sales: salesTranslations.ar,
    navigation: navigationTranslations.ar,
    dashboard: dashboardTranslations.ar,
    utils: utilsTranslations.ar,
    inventory: inventoryTranslations.ar,
    marketing: marketingTranslations.ar,
    settings: settingsTranslations.ar
  }
};

// Helper function to get translation by key
export const getTranslation = (key: string, language: 'en' | 'ar'): string => {
  const parts = key.split('.');
  let current: any = allTranslations[language];
  
  for (const part of parts) {
    if (!current[part]) {
      console.warn(`Translation not found for key: ${key} in ${language}`);
      return key;
    }
    current = current[part];
  }
  
  return current;
};

export { toArabicNumerals };
