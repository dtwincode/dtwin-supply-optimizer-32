
import { translations } from './types';
import { navigationTranslations } from './navigation';
import { dashboardTranslations } from './dashboard';
import { uiTranslations } from './common/ui';
import { paginationTranslations } from './common/pagination';
import { financialMetricsTranslations } from './common/financialMetrics';
import { sustainabilityMetricsTranslations } from './common/sustainabilityMetrics';
import { modulesSummaryTranslations } from './common/modules';
import { commonTranslations } from './common';
import { utilsTranslations } from './utilities';
import { toArabicNumerals } from './utils';

// Full combined translations
export const allTranslations: translations = {
  en: {
    common: commonTranslations,
    sales: {
      title: "Sales",
      orders: "Orders",
      customers: "Customers",
      quotes: "Quotes",
      opportunities: "Opportunities",
      pipeline: "Sales Pipeline",
      forecasting: "Sales Forecasting",
      performance: "Performance",
      metrics: {
        revenue: "Revenue",
        orders: "Orders",
        customers: "Customers",
        avgOrderValue: "Avg Order Value",
        returnRate: "Return Rate"
      }
    },
    navigation: {
      dashboard: "Dashboard",
      forecasting: "Forecasting",
      inventory: "Inventory",
      marketing: "Marketing",
      sales: "Sales",
      logistics: "Logistics",
      reporting: "Reporting",
      settings: "Settings"
    },
    dashboard: dashboardTranslations,
    utils: utilsTranslations.en,
    inventory: {
      title: "Inventory",
      subtitle: "Manage your inventory",
      metrics: {
        onHand: "On Hand",
        onOrder: "On Order",
        allocated: "Allocated",
        available: "Available",
        stockouts: "Stockouts",
        overstock: "Overstock",
        turnover: "Turnover"
      }
    },
    marketing: {
      title: "Marketing",
      subtitle: "Manage your marketing campaigns",
      metrics: {
        campaigns: "Campaigns",
        leads: "Leads",
        conversion: "Conversion Rate",
        cac: "Customer Acquisition Cost",
        roi: "ROI"
      }
    },
    settings: {
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
    }
  },
  ar: {
    common: commonTranslations,
    sales: {
      title: "المبيعات",
      orders: "الطلبات",
      customers: "العملاء",
      quotes: "عروض الأسعار",
      opportunities: "الفرص",
      pipeline: "خط أنابيب المبيعات",
      forecasting: "التنبؤ بالمبيعات",
      performance: "الأداء",
      metrics: {
        revenue: "الإيرادات",
        orders: "الطلبات",
        customers: "العملاء",
        avgOrderValue: "متوسط قيمة الطلب",
        returnRate: "معدل العودة"
      }
    },
    navigation: {
      dashboard: "لوحة القيادة",
      forecasting: "التنبؤ",
      inventory: "المخزون",
      marketing: "التسويق",
      sales: "المبيعات",
      logistics: "الخدمات اللوجستية",
      reporting: "التقارير",
      settings: "الإعدادات"
    },
    dashboard: dashboardTranslations,
    utils: utilsTranslations.ar,
    inventory: {
      title: "المخزون",
      subtitle: "إدارة المخزون الخاص بك",
      metrics: {
        onHand: "في المتناول",
        onOrder: "تحت الطلب",
        allocated: "المخصص",
        available: "المتاح",
        stockouts: "نفاد المخزون",
        overstock: "فائض المخزون",
        turnover: "معدل الدوران"
      }
    },
    marketing: {
      title: "التسويق",
      subtitle: "إدارة حملاتك التسويقية",
      metrics: {
        campaigns: "الحملات",
        leads: "العملاء المحتملين",
        conversion: "معدل التحويل",
        cac: "تكلفة اكتساب العملاء",
        roi: "العائد على الاستثمار"
      }
    },
    settings: {
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

export { toArabicNumerals, commonTranslations };
export { uiTranslations, financialMetricsTranslations, sustainabilityMetricsTranslations, modulesSummaryTranslations, paginationTranslations };
