
import { TranslationValue } from '../types';

export type ChartTranslations = {
  chartTitles: {
    bufferProfile: TranslationValue;
    demandVariability: TranslationValue;
  };
  zones: {
    green: TranslationValue;
    yellow: TranslationValue;
    red: TranslationValue;
  };
};

export const chartTranslations: ChartTranslations = {
  chartTitles: {
    bufferProfile: {
      en: "Buffer Profile Distribution",
      ar: "توزيع نسب المخزون"
    },
    demandVariability: {
      en: "Demand Variability Analysis",
      ar: "تحليل تغير الطلب"
    }
  },
  zones: {
    green: {
      en: "Green Zone",
      ar: "المنطقة الخضراء"
    },
    yellow: {
      en: "Yellow Zone",
      ar: "المنطقة الصفراء"
    },
    red: {
      en: "Red Zone",
      ar: "المنطقة الحمراء"
    }
  }
};
