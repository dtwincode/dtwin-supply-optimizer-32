
import { Translations } from './types';
import { enTranslations } from './en';
import { arTranslations } from './ar';
import { dashboardTranslations } from './common/dashboard';
import { modulesSummaryTranslations } from './common/modules';
import { uiTranslations } from './common/ui';
import { navigationTranslations } from './navigation';
import { salesTranslations } from './common/sales';
import { supplyPlanningTranslations } from './common/supplyPlanning';
import { financialMetricsTranslations } from './common/financialMetrics';
import { sustainabilityMetricsTranslations } from './common/sustainabilityMetrics';
import { ddsopTranslations } from './common/ddsop';

export const translations: Translations = {
  dashboard: {
    en: 'Dashboard',
    ar: 'لوحة القيادة',
  },
  navigationItems: navigationTranslations,
  dashboardMetrics: dashboardTranslations,
  financialMetrics: financialMetricsTranslations,
  sustainabilityMetrics: sustainabilityMetricsTranslations,
  modulesSummary: modulesSummaryTranslations,
  common: {
    ...uiTranslations,
  },
  sales: salesTranslations,
  supplyPlanning: supplyPlanningTranslations,
  ddsop: ddsopTranslations
};

export type Language = 'en' | 'ar';

export function getTranslation(key: string, language: Language) {
  const keys = key.split('.');
  let current: any = translations;

  for (const k of keys) {
    if (current[k] === undefined) {
      console.warn(`Translation key not found: ${key}`);
      return undefined;
    }
    current = current[k];
  }

  return current[language];
}
