
import { Translations, Language } from './types';
import { navigationTranslations } from './navigation';
import { dashboardTranslations, executiveSummaryTranslations } from './common/dashboard';
import { modulesSummaryTranslations } from './common/modules';
import { uiTranslations } from './common/ui';
import { chartTranslations } from './common/charts';
import { inventoryTranslations } from './common/inventory';
import { paginationTranslations } from './common/pagination';
import { supplyPlanningTranslations } from './common/supplyPlanning';
import { financialMetricsTranslations } from './common/financialMetrics';
import { sustainabilityMetricsTranslations } from './common/sustainabilityMetrics';
import { logisticsTranslations } from './common/logistics';
import { ddsopTranslations } from './common/ddsop';
import { formatNumber } from './utils';
import { commonTranslations } from './common';
import { salesTranslations } from './sales';
import { marketingTranslations } from './marketing';

export { formatNumber };
export type { Language };

export const translations: Translations = {
  navigationItems: navigationTranslations,
  dashboardMetrics: dashboardTranslations,
  financialMetrics: financialMetricsTranslations,
  sustainabilityMetrics: sustainabilityMetricsTranslations,
  modulesSummary: modulesSummaryTranslations,
  common: commonTranslations,
  executiveSummary: executiveSummaryTranslations,
  sales: salesTranslations,
  supplyPlanning: supplyPlanningTranslations,
  ddsop: ddsopTranslations,
  marketing: marketingTranslations,
  inventory: inventoryTranslations,
  ui: uiTranslations,
  charts: chartTranslations,
  pagination: paginationTranslations
};

export function getTranslation(key: string, language: Language) {
  const keys = key.split('.');
  let current: any = translations;

  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return the key as fallback instead of undefined
    }
    current = current[k];
  }

  // If the current value is an object with language keys, return the value for the specified language
  if (current && typeof current === 'object' && 'en' in current) {
    return current['en'];
  }
  
  // If the current value is already a string, return it directly
  return current;
}
