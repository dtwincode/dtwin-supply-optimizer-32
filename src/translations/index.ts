
import { Translations } from './types';
import { navigationTranslations } from './navigation';
import { dashboardTitle, dashboardMetricsTranslations, financialMetricsTranslations, sustainabilityMetricsTranslations, modulesSummaryTranslations } from './dashboard';
import { commonTranslations } from './common';
import { salesTranslations } from './sales';
export { toArabicNumerals } from './utils';

export const translations: Translations = {
  dashboard: dashboardTitle,
  navigationItems: navigationTranslations,
  dashboardMetrics: dashboardMetricsTranslations,
  financialMetrics: financialMetricsTranslations,
  sustainabilityMetrics: sustainabilityMetricsTranslations,
  modulesSummary: modulesSummaryTranslations,
  common: commonTranslations,
  sales: salesTranslations
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
