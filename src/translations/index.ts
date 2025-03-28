
// Import individual translation modules
import { commonTranslations } from './common';
import { supplyPlanningTranslations } from './common/supplyPlanning';
import { dashboardTranslations } from './dashboard';
import { marketingTranslations } from './marketing';
import { salesTranslations } from './sales';
import { logisticsTranslations } from './common/logistics/index';
import { navigationTranslations } from './navigation';

// Define Language type
export type Language = 'en' | 'ar';

// Combine all translations
const allTranslations = {
  en: {
    common: commonTranslations.en,
    dashboard: dashboardTranslations.en,
    forecasting: {},
    inventory: {},
    marketing: marketingTranslations.en,
    ddsop: logisticsTranslations.ddom?.en || {},
    logistics: logisticsTranslations.en,
    sales: salesTranslations.en,
    nav: navigationTranslations.en,
    supplyPlanning: supplyPlanningTranslations.en
  },
  ar: {
    common: commonTranslations.ar,
    dashboard: dashboardTranslations.ar,
    forecasting: {},
    inventory: {},
    marketing: marketingTranslations.ar,
    ddsop: logisticsTranslations.ddom?.ar || {},
    logistics: logisticsTranslations.ar,
    sales: salesTranslations.ar,
    nav: navigationTranslations.ar,
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
  commonTranslations,
  dashboardTranslations,
  marketingTranslations,
  salesTranslations,
  logisticsTranslations,
  navigationTranslations,
  supplyPlanningTranslations
};
