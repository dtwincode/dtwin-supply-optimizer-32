
import React from 'react';
import { Truck } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { LogisticsFilters } from './filters/LogisticsFilters';

export const LogisticsHeader = () => {
  const { t } = useI18n();

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-dtwin-medium/10 rounded-full">
          <Truck className="h-6 w-6 text-dtwin-dark" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('common.logistics.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('common.logistics.optimizeSupplyChain')}
          </p>
        </div>
      </div>
      <LogisticsFilters />
    </div>
  );
};
