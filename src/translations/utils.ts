
import { translations } from './index';

export const getTranslation = (key: string, language: 'en' | 'ar' = 'en'): string => {
  try {
    // Handle nested keys (e.g. 'dashboard.title')
    const keyParts = key.split('.');
    const module = keyParts[0];
    const property = keyParts[1];
    
    // First check if it's a nested key
    if (keyParts.length > 1) {
      // Access translations like translations[language][module][property]
      if (translations[language] && 
          translations[language][module] && 
          translations[language][module][property]) {
        return translations[language][module][property];
      }
    }
    
    // For non-nested keys or fallback
    // Try to access common translations first
    if (translations[language]?.common?.[key]) {
      return translations[language].common[key];
    }
    
    // Check all modules if not found in common
    for (const mod in translations[language]) {
      if (translations[language][mod]?.[key]) {
        return translations[language][mod][key];
      }
    }
    
    // Default fallback
    console.warn(`Translation not found for key "${key}" in language "${language}"`);
    return key;
  } catch (error) {
    console.error('Error getting translation:', error);
    return key;
  }
};

export const toArabicNumerals = (num: string | number): string => {
  if (num === undefined || num === null) return '';
  
  const strNum = num.toString();
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  return strNum.replace(/[0-9]/g, match => {
    return arabicNumerals[parseInt(match)];
  });
};
