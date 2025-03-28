
import React, { createContext, useContext } from 'react';
import { getTranslation } from '@/translations';
import { useLanguage } from './LanguageContext';

type I18nContextType = {
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();

  const t = (key: string) => getTranslation(key, language);

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
