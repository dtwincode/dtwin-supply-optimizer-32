
import { TranslationsType } from './types';
import { commonTranslations } from './common';
import { navigationTranslations } from './navigation';
import { dashboardTranslations } from './dashboard';
import { inventoryTranslations } from './inventory';
import { marketingTranslations } from './marketing';
import { salesTranslations } from './sales';
import { chartTranslations } from './common/charts';

// Export utility functions
export { getTranslation, toArabicNumerals } from './utils';

export const translations: TranslationsType = {
  en: {
    common: {
      ...commonTranslations.en,
      chartTitles: chartTranslations.en.chartTitles,
      zones: chartTranslations.en.zones
    },
    navigation: navigationTranslations,
    dashboard: dashboardTranslations.en,
    inventory: inventoryTranslations,
    marketing: marketingTranslations,
    sales: salesTranslations
  },
  ar: {
    common: {
      ...commonTranslations.ar,
      chartTitles: chartTranslations.ar.chartTitles,
      zones: chartTranslations.ar.zones
    },
    navigation: navigationTranslations,
    dashboard: dashboardTranslations.ar,
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
  salesTranslations,
  chartTranslations
};
