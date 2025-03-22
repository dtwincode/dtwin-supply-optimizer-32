
import React from 'react';
import { Truck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { LogisticsFilters } from './filters/LogisticsFilters';

export const LogisticsHeader = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.${key}`, language) || key;

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-dtwin-medium/10 rounded-full">
          <Truck className="h-6 w-6 text-dtwin-dark" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">
            {t('optimizeSupplyChain')}
          </p>
        </div>
      </div>
      <LogisticsFilters />
    </div>
  );
};
