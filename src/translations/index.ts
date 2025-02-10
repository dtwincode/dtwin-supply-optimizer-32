
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

type Translations = {
  dashboard: TranslationValue;
  navigationItems: NavigationItems;
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
  }
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

