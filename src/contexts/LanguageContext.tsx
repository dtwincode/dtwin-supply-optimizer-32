
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: 'en';
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Set language to English only
  const language = 'en';
  const isRTL = false;

  useEffect(() => {
    document.dir = 'ltr';
    document.documentElement.lang = language;
    document.body.classList.remove('rtl');
  }, []);

  return (
    <LanguageContext.Provider value={{ language, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
