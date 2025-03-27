
import { inventoryTranslations } from './common/inventory';
import { sustainabilityTranslations } from './common/sustainability';
import { dashboardTranslations } from './dashboard';
import { commonTranslations } from './common';
import { errorTranslations } from './errors';
import { orderTranslations } from './orders';
import { analyticsTranslations } from './analytics';
import { statusTranslations } from './status';
import { zonesTranslations } from './common/zones';

// Function to convert Arabic numerals for display purposes
export function toArabicNumerals(str: string) {
  return str.replace(/[0-9]/g, (d) => {
    return String.fromCharCode(d.charCodeAt(0) + 1584);
  });
}

export function getTranslation(key: string, language: 'en' | 'ar' = 'en'): string {
  const keyParts = key.split('.');
  
  try {
    // Determine which translation object to use based on the first part of the key
    let translationObject;
    
    if (keyParts[0] === 'common') {
      if (keyParts[1] === 'inventory') {
        translationObject = inventoryTranslations;
        keyParts.shift(); // Remove 'common' from keyParts
      } else if (keyParts[1] === 'zones') {
        translationObject = zonesTranslations;
        keyParts.shift(); // Remove 'common' from keyParts
      } else if (keyParts[1] === 'sustainability') {
        translationObject = sustainabilityTranslations;
        keyParts.shift(); // Remove 'common' from keyParts
        // Use the second part of the key directly since we've shifted 'common'
        return translationObject[keyParts[1]][language] || key;
      } else {
        translationObject = commonTranslations;
      }
    } else if (keyParts[0] === 'dashboard') {
      translationObject = dashboardTranslations;
    } else if (keyParts[0] === 'error') {
      translationObject = errorTranslations;
    } else if (keyParts[0] === 'order') {
      translationObject = orderTranslations;
    } else if (keyParts[0] === 'analytics') {
      translationObject = analyticsTranslations;
    } else if (keyParts[0] === 'status') {
      translationObject = statusTranslations;
    } else if (keyParts[0] === 'sustainability') {
      translationObject = sustainabilityTranslations;
    } else if (keyParts[0] === 'zones') {
      translationObject = zonesTranslations;
    } else {
      translationObject = commonTranslations;
    }
    
    // Navigate through the translation object using key parts
    let result = translationObject;
    for (const part of keyParts) {
      if (result[part]) {
        result = result[part];
      } else {
        // If we can't find the key part, return the original key
        return key;
      }
    }
    
    // Return the translation in the requested language or the key if not found
    return typeof result === 'object' && result[language] ? result[language] : key;
  } catch (error) {
    console.error(`Translation error for key: ${key}`, error);
    return key;
  }
}
