
import { inventoryTranslations } from './common/inventory';
import { sustainabilityTranslations } from './common/sustainability';
import { commonTranslations } from './common';
import { zonesTranslations } from './common/zones';
import { dashboardMetricsTranslations, financialMetricsTranslations } from './dashboard';

// Function to convert Arabic numerals for display purposes
export function toArabicNumerals(str: string) {
  return str.replace(/[0-9]/g, (d) => {
    return String.fromCharCode(d.charCodeAt(0) + 1584);
  });
}

// Synthetic translation objects for missing files
const errorTranslations = {
  notFound: {
    en: "Not Found",
    ar: "غير موجود"
  },
  serverError: {
    en: "Server Error",
    ar: "خطأ في الخادم"
  },
  validationError: {
    en: "Validation Error",
    ar: "خطأ في التحقق"
  }
};

const orderTranslations = {
  status: {
    pending: {
      en: "Pending",
      ar: "قيد الانتظار"
    },
    processing: {
      en: "Processing",
      ar: "قيد المعالجة"
    },
    shipped: {
      en: "Shipped",
      ar: "تم الشحن"
    },
    delivered: {
      en: "Delivered",
      ar: "تم التسليم"
    },
    cancelled: {
      en: "Cancelled",
      ar: "تم الإلغاء"
    }
  }
};

const analyticsTranslations = {
  title: {
    en: "Analytics",
    ar: "التحليلات"
  },
  metrics: {
    en: "Metrics",
    ar: "المقاييس"
  },
  trends: {
    en: "Trends",
    ar: "الاتجاهات"
  }
};

const statusTranslations = {
  success: {
    en: "Success",
    ar: "نجاح"
  },
  error: {
    en: "Error",
    ar: "خطأ"
  },
  warning: {
    en: "Warning",
    ar: "تحذير"
  },
  info: {
    en: "Information",
    ar: "معلومات"
  }
};

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
        return translationObject[keyParts[0]][language] || key;
      } else {
        translationObject = commonTranslations;
      }
    } else if (keyParts[0] === 'dashboard') {
      translationObject = dashboardMetricsTranslations;
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
