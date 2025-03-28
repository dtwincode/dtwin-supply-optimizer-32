
// Import individual translation modules
import { commonTranslations } from './common';
import { supplyPlanningTranslations } from './common/supplyPlanning';
import { dashboardTranslations } from './dashboard';
import { marketingTranslations } from './marketing';
import { salesTranslations } from './sales';
import { logisticsTranslations } from './common/logistics/index';
import { navigationTranslations } from './navigation';
import { toArabicNumerals } from './utils';

// Define Language type
export type Language = 'en' | 'ar';

// Combine all translations
const allTranslations = {
  en: {
    common: commonTranslations.en || commonTranslations,
    dashboard: dashboardTranslations || {},
    forecasting: {},
    inventory: {},
    marketing: marketingTranslations.en || marketingTranslations,
    ddsop: logisticsTranslations.ddom?.en || {},
    logistics: logisticsTranslations.en || logisticsTranslations,
    sales: salesTranslations.en || salesTranslations,
    nav: navigationTranslations || {},
    supplyPlanning: supplyPlanningTranslations.en
  },
  ar: {
    common: commonTranslations.ar || {},
    dashboard: dashboardTranslations || {},
    forecasting: {},
    inventory: {},
    marketing: marketingTranslations.ar || marketingTranslations,
    ddsop: logisticsTranslations.ddom?.ar || {},
    logistics: logisticsTranslations.ar || logisticsTranslations,
    sales: salesTranslations.ar || salesTranslations,
    nav: navigationTranslations || {},
    supplyPlanning: supplyPlanningTranslations.ar
  }
};

// Utility function to get translations based on the language and nested path
export const getTranslation = (path: string, language: Language = 'en'): string => {
  const keys = path.split('.');
  try {
    let result = allTranslations[language as keyof typeof allTranslations] as any;
    
    for (const key of keys) {
      if (result && key in result) {
        result = result[key];
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
    
    return result as string;
  } catch (error) {
    console.error(`Error getting translation for path: ${path}`, error);
    return path;
  }
};

// Export utility functions and needed translations
export {
  toArabicNumerals,
  commonTranslations,
  dashboardTranslations,
  marketingTranslations,
  salesTranslations,
  logisticsTranslations,
  navigationTranslations,
  supplyPlanningTranslations
};
