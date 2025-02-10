type TranslationValue = {
  en: string;
  ar: string;
};

type NavigationItems = {
  dashboard: TranslationValue;
  forecasting: TranslationValue;
  inventory: TranslationValue;
  salesPlanning: TranslationValue;
  marketing: TranslationValue;
  logistics: TranslationValue;
  reports: TranslationValue;
  askAI: TranslationValue;
  settings: TranslationValue;
};

type DashboardMetrics = {
  totalSKUs: TranslationValue;
  bufferPenetration: TranslationValue;
  orderStatus: TranslationValue;
  flowIndex: TranslationValue;
};

type FinancialMetrics = {
  revenue: TranslationValue;
  operatingCosts: TranslationValue;
  profitMargin: TranslationValue;
  title: TranslationValue;
};

type SustainabilityMetrics = {
  carbonFootprint: TranslationValue;
  wasteReduction: TranslationValue;
  greenSuppliers: TranslationValue;
  title: TranslationValue;
};

type ModulesSummary = {
  inventoryManagement: TranslationValue;
  demandForecasting: TranslationValue;
  salesPlanning: TranslationValue;
  marketingCampaigns: TranslationValue;
  logistics: TranslationValue;
  reportsAnalytics: TranslationValue;
  viewDetails: TranslationValue;
};

type Translations = {
  dashboard: TranslationValue;
  navigationItems: NavigationItems;
  dashboardMetrics: DashboardMetrics;
  financialMetrics: FinancialMetrics;
  sustainabilityMetrics: SustainabilityMetrics;
  modulesSummary: ModulesSummary;
  common: {
    skus: TranslationValue;
    active: TranslationValue;
    pipeline: TranslationValue;
    onTime: TranslationValue;
    reports: TranslationValue;
    description: TranslationValue;
    accuracy: TranslationValue;
    planAndTrack: TranslationValue;
    manageInitiatives: TranslationValue;
    optimizeDelivery: TranslationValue;
    accessInsights: TranslationValue;
    chartTitles: {
      bufferProfile: TranslationValue;
      demandVariability: TranslationValue;
    };
    zones: {
      green: TranslationValue;
      yellow: TranslationValue;
      red: TranslationValue;
    };
  };
};

export const translations: Translations = {
  dashboard: {
    en: "Supply Chain Dashboard",
    ar: "لوحة تحكم سلسلة التوريد"
  },
  navigationItems: {
    dashboard: {
      en: "Dashboard",
      ar: "لوحة التحكم"
    },
    forecasting: {
      en: "Forecasting",
      ar: "التنبؤ"
    },
    inventory: {
      en: "Inventory",
      ar: "المخزون"
    },
    salesPlanning: {
      en: "Sales Planning",
      ar: "تخطيط المبيعات"
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
    settings: {
      en: "Settings",
      ar: "الإعدادات"
    }
  },
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
  financialMetrics: {
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
  },
  sustainabilityMetrics: {
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
    }
  },
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
  },
  common: {
    skus: {
      en: "SKUs",
      ar: "وحدات تخزين"
    },
    active: {
      en: "active",
      ar: "نشط"
    },
    pipeline: {
      en: "pipeline",
      ar: "قيد التنفيذ"
    },
    onTime: {
      en: "on-time",
      ar: "في الوقت المحدد"
    },
    reports: {
      en: "reports",
      ar: "تقارير"
    },
    description: {
      en: "Track and manage inventory levels",
      ar: "تتبع وإدارة مستويات المخزون"
    },
    accuracy: {
      en: "accuracy",
      ar: "دقة"
    },
    planAndTrack: {
      en: "Plan and track sales activities",
      ar: "تخطيط وتتبع أنشطة المبيعات"
    },
    manageInitiatives: {
      en: "Manage marketing initiatives",
      ar: "إدارة المبادرات التسويقية"
    },
    optimizeDelivery: {
      en: "Optimize delivery operations",
      ar: "تحسين عمليات التسليم"
    },
    accessInsights: {
      en: "Access business insights",
      ar: "الوصول إلى رؤى الأعمال"
    },
    chartTitles: {
      bufferProfile: {
        en: "Buffer Profile Distribution",
        ar: "توزيع نسب المخزون"
      },
      demandVariability: {
        en: "Demand Variability Analysis",
        ar: "تحليل تغير الطلب"
      }
    },
    zones: {
      green: {
        en: "Green Zone",
        ar: "المنطقة الخضراء"
      },
      yellow: {
        en: "Yellow Zone",
        ar: "المنطقة الصفراء"
      },
      red: {
        en: "Red Zone",
        ar: "المنطقة الحمراء"
      }
    }
  }
};

// Helper function to convert numbers to Arabic numerals
export const toArabicNumerals = (num: number | string): string => {
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
};

export const getTranslation = (key: string, language: 'en' | 'ar'): string => {
  const keys = key.split('.');
  let current: any = translations;
  
  for (const k of keys) {
    if (current[k]) {
      current = current[k];
    } else {
      return key;
    }
  }
  
  return current[language] || key;
};
