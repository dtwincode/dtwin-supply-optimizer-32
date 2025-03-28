
// Import individual translation modules
import { commonTranslations } from './common/common';
import { authTranslations } from './common/auth';
import { navTranslations } from './common/nav';
import { dashboardTranslations } from './common/dashboard';
import { forecastingTranslations } from './common/forecasting';
import { inventoryTranslations } from './common/inventory';
import { marketingTranslations } from './common/marketing';
import { ddsopTranslations } from './common/ddsop';
import { logisticsTranslations } from './common/logistics';
import { reportsTranslations } from './common/reports';
import { settingsTranslations } from './common/settings';
import { supplyPlanningTranslations } from './common/supplyPlanning';

// Combine all translations
const allTranslations = {
  en: {
    common: commonTranslations.en,
    auth: authTranslations.en,
    nav: navTranslations.en,
    dashboard: dashboardTranslations.en,
    forecasting: forecastingTranslations.en,
    inventory: inventoryTranslations.en,
    marketing: marketingTranslations.en,
    ddsop: ddsopTranslations.en,
    logistics: logisticsTranslations.en,
    reports: reportsTranslations.en,
    settings: settingsTranslations.en,
    supplyPlanning: supplyPlanningTranslations.en
  },
  ar: {
    common: commonTranslations.ar,
    auth: authTranslations.ar,
    nav: navTranslations.ar,
    dashboard: dashboardTranslations.ar,
    forecasting: forecastingTranslations.ar,
    inventory: inventoryTranslations.ar,
    marketing: marketingTranslations.ar,
    ddsop: ddsopTranslations.ar,
    logistics: logisticsTranslations.ar,
    reports: reportsTranslations.ar,
    settings: settingsTranslations.ar,
    supplyPlanning: supplyPlanningTranslations.ar
  }
};

// Utility function to get translations based on the language and nested path
export const getTranslation = (path: string, language: string = 'en'): string => {
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

// Export all individual translation objects
export {
  commonTranslations,
  authTranslations,
  navTranslations,
  dashboardTranslations,
  forecastingTranslations,
  inventoryTranslations,
  marketingTranslations,
  ddsopTranslations,
  logisticsTranslations,
  reportsTranslations,
  settingsTranslations,
  supplyPlanningTranslations
};
