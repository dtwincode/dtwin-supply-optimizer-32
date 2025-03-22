
import { LanguageType, TranslationKey } from './types';
import { commonTranslations } from './common';
import { navigationTranslations } from './navigation';
import { dashboardMetricsTranslations, financialMetricsTranslations, sustainabilityMetricsTranslations, modulesSummaryTranslations } from './dashboard';
import { salesTranslations } from './sales';
import { ddsopTranslations } from './ddsop';
import { toArabicNumerals } from './utils';

// Helper function to find a translation by key, traversing the key path
export const getTranslation = (keyPath: string, language: LanguageType): string | undefined => {
  try {
    const parts = keyPath.split('.');
    let current: any = {
      ...commonTranslations[language],
      ...navigationTranslations[language],
      dashboard: {
        ...dashboardMetricsTranslations,
        ...financialMetricsTranslations,
        ...sustainabilityMetricsTranslations,
        ...modulesSummaryTranslations
      },
      ...salesTranslations[language],
      ...ddsopTranslations[language],
      // Add more translation sets here as needed
    };

    for (const part of parts) {
      if (current[part] === undefined) {
        // console.warn(`Translation key not found: ${keyPath} for language ${language}`);
        return part; // Return the last part of the key as a fallback
      }
      current = current[part];
    }

    if (typeof current !== 'string') {
      // console.warn(`Translation key ${keyPath} does not resolve to a string for language ${language}`);
      return parts[parts.length - 1]; // Return the last part of the key as a fallback
    }

    return current;
  } catch (error) {
    console.error(`Error getting translation for key ${keyPath}:`, error);
    return keyPath.split('.').pop(); // Return the last part of the key as a fallback
  }
};

export { toArabicNumerals };
export * from './types';
