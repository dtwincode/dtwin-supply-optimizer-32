
// Import individual translation modules
import { commonTranslations } from './common/index';
import { salesTranslations } from './sales/index';
import { navigationTranslations } from './navigation/index';
import { dashboardMetricsTranslations } from './dashboard';
import { utils } from './utilities';
import { toArabicNumerals } from './utils';

// Combine all translations
const allTranslations = {
  en: {
    common: commonTranslations.en,
    sales: salesTranslations.en,
    navigation: navigationTranslations.en,
    dashboard: dashboardMetricsTranslations.en,
  },
  ar: {
    common: commonTranslations.ar,
    sales: salesTranslations.ar,
    navigation: navigationTranslations.ar,
    dashboard: dashboardMetricsTranslations.ar,
  }
};

// Utility function to get translations based on the language and nested path
export const getTranslation = (path: string, language = 'en') => {
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
  dashboardMetricsTranslations,
  toArabicNumerals
};
