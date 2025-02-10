
import { TranslationValue } from '../types';

export type PaginationTranslations = {
  items: TranslationValue;
  showing: TranslationValue;
  to: TranslationValue;
  of: TranslationValue;
  previous: TranslationValue;
  viewDetails: TranslationValue;
};

export const paginationTranslations: PaginationTranslations = {
  items: {
    en: "items",
    ar: "العناصر"
  },
  showing: {
    en: "Showing",
    ar: "عرض"
  },
  to: {
    en: "to",
    ar: "إلى"
  },
  of: {
    en: "of",
    ar: "من"
  },
  previous: {
    en: "Previous",
    ar: "السابق"
  },
  viewDetails: {
    en: "View Details",
    ar: "عرض التفاصيل"
  }
};
