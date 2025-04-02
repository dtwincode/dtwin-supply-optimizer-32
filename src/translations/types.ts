
export type Translations = {
  [key: string]: string | Translations;
};

export type Translation = {
  [key: string]: string | Translation;
};

export type TranslationSet = {
  en: string;
  ar: string;
};
