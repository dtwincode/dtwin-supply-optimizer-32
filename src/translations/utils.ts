
/**
 * Utility functions for translations
 */

import { translations } from './index';

/**
 * Gets a translation by key and language
 * @param key The translation key with dot notation (e.g., 'common.save')
 * @param language The language code ('en' or 'ar')
 * @returns The translated string or the key if not found
 */
export const getTranslation = (key: string, language: 'en' | 'ar'): string => {
  try {
    const keys = key.split('.');
    let current: any = translations[language] || {};
    
    for (const k of keys) {
      if (current[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      current = current[k];
    }
    
    return current || key;
  } catch (error) {
    console.error(`Error getting translation for key: ${key}`, error);
    return key;
  }
};

/**
 * Converts Western Arabic numerals to Eastern Arabic numerals for Arabic localization
 * @param value The number or string to convert
 * @returns The converted string
 */
export const toArabicNumerals = (value: number | string): string => {
  if (value === undefined || value === null) return '';
  
  const strValue = String(value);
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return strValue.replace(/[0-9]/g, (digit) => {
    return arabicDigits[parseInt(digit)];
  });
};
