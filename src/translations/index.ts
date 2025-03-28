
// Import individual translation modules
import { commonTranslations } from './common/index';
import { salesTranslations } from './sales/index';
import { navigationTranslations } from './navigation/index';
import { dashboardMetricsTranslations } from './dashboard';
import { utils } from './utilities';

// Utility function to convert numbers to Arabic numerals
export const toArabicNumerals = (num: number | string): string => {
  const strNum = num.toString();
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return strNum.replace(/[0-9]/g, (d) => arabicDigits[parseInt(d)]);
};

// Define Language type
export type Language = 'en' | 'ar';

// Combine all translations
const allTranslations = {
  en: {
    common: commonTranslations.en,
    sales: salesTranslations.en,
    navigation: navigationTranslations.en,
    dashboard: dashboardMetricsTranslations.en,
    utils: utils.en,
    settings: {
      title: "Settings",
      dataUpload: "Data Upload",
      preferences: "Preferences",
      integration: "Integration",
      users: "Users",
      userPreferences: "User Preferences",
      preferencesContent: "Configure your personal preferences and application settings here.",
      apiIntegration: "API Integration",
      apiIntegrationContent: "Set up and manage connections to external systems and APIs.",
      userManagement: "User Management",
      userManagementContent: "Manage user accounts, roles, and permissions.",
      integratedData: "Integrated Data Preview"
    }
  },
  ar: {
    common: commonTranslations.ar,
    sales: salesTranslations.ar,
    navigation: navigationTranslations.ar,
    dashboard: dashboardMetricsTranslations.ar,
    utils: utils.ar,
    settings: {
      title: "الإعدادات",
      dataUpload: "تحميل البيانات",
      preferences: "التفضيلات",
      integration: "التكامل",
      users: "المستخدمين",
      userPreferences: "تفضيلات المستخدم",
      preferencesContent: "قم بتكوين تفضيلاتك الشخصية وإعدادات التطبيق هنا.",
      apiIntegration: "تكامل واجهة برمجة التطبيقات",
      apiIntegrationContent: "إعداد وإدارة الاتصالات بالأنظمة الخارجية وواجهات برمجة التطبيقات.",
      userManagement: "إدارة المستخدمين",
      userManagementContent: "إدارة حسابات المستخدمين والأدوار والأذونات.",
      integratedData: "معاينة البيانات المتكاملة"
    }
  }
};

// Utility function to get translations based on the language and nested path
export const getTranslation = (path: string, language: Language = 'en') => {
  const keys = path.split('.');
  try {
    let result = allTranslations[language as keyof typeof allTranslations];
    for (const key of keys) {
      if (result && key in result) {
        result = result[key as keyof typeof result];
      } else {
        console.warn(`Translation missing for path: ${path} in ${language}`);
        // Try to get the English version as fallback
        if (language !== 'en') {
          return getTranslation(path, 'en');
        }
        // If still not found, return the path as is
        return path;
      }
    }
    return result;
  } catch (error) {
    console.error(`Error getting translation for path: ${path}`, error);
    return path;
  }
};

// Export all individual translation objects and utilities
export {
  commonTranslations,
  salesTranslations,
  navigationTranslations,
  dashboardMetricsTranslations
};
