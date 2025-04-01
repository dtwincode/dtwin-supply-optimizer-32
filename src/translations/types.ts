
export interface NavigationItems {
  dashboard: Translation;
  ddsop: Translation;
  forecasting: Translation;
  inventory: Translation;
  inventoryPlanning: Translation;
  inventoryClassification: Translation;
  supplyPlanning: Translation;
  salesPlanning: Translation;
  returnsManagement: Translation;
  marketing: Translation;
  logistics: Translation;
  reports: Translation;
  askAI: Translation;
  data: Translation;
  guidelines: Translation;
}

export interface Translation {
  en: string;
  ar: string;
}

export interface TranslationSet {
  [key: string]: Translation;
}

export interface Translations {
  navigation: NavigationItems;
  common: TranslationSet;
  auth: TranslationSet;
  dashboard: TranslationSet;
  inventory: TranslationSet;
  forecasting: TranslationSet;
  settings: TranslationSet;
  errors: TranslationSet;
}

export interface TranslationKey {
  section: keyof Translations;
  key: string;
}
