
import { TranslationsType } from './types';
import { commonTranslations } from './common';
import { navigationTranslations } from './navigation';
import { dashboardTranslations } from './dashboard';
import { inventoryTranslations } from './inventory';
import { marketingTranslations } from './marketing';
import { salesTranslations } from './sales';

// Export utility functions
export { getTranslation, toArabicNumerals } from './utils';

export const translations: TranslationsType = {
  en: {
    common: commonTranslations.en,
    navigation: navigationTranslations,
    dashboard: dashboardTranslations,
    inventory: inventoryTranslations,
    marketing: marketingTranslations,
    sales: salesTranslations
  },
  ar: {
    common: commonTranslations.ar,
    navigation: navigationTranslations,
    dashboard: dashboardTranslations,
    inventory: inventoryTranslations,
    marketing: marketingTranslations,
    sales: salesTranslations
  }
};

// Re-export translations for more direct access
export { 
  commonTranslations,
  navigationTranslations,
  dashboardTranslations,
  inventoryTranslations,
  marketingTranslations,
  salesTranslations
};
