
import { Translations } from './types';
import { navigationTranslations } from './navigation';
import { dashboardTitle, dashboardMetricsTranslations, financialMetricsTranslations, sustainabilityMetricsTranslations, modulesSummaryTranslations } from './dashboard';
import { commonTranslations } from './common';
import { salesTranslations } from './sales';
import { supplyPlanningTranslations } from './common/supplyPlanning';
import { forecastingTranslations } from './common/forecasting';
export { toArabicNumerals } from './utils';

export const translations: Translations = {
  dashboard: dashboardTitle,
  navigationItems: navigationTranslations,
  dashboardMetrics: dashboardMetricsTranslations,
  financialMetrics: financialMetricsTranslations,
  sustainabilityMetrics: sustainabilityMetricsTranslations,
  modulesSummary: modulesSummaryTranslations,
  common: commonTranslations,
  sales: salesTranslations,
  supplyPlanning: supplyPlanningTranslations,
  forecasting: forecastingTranslations
};

export const getTranslation = (key: string, language: 'en' | 'ar'): string => {
  const keys = key.split('.');
  let current: any = translations;
  
  for (const k of keys) {
    if (current[k]) {
      current = current[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key; // Return the key itself instead of adding dots
    }
  }
  
  if (typeof current === 'object' && current[language]) {
    return current[language];
  }
  
  return key; // Return the key if translation not found
};
