
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { LogisticsOrdersTable } from '@/components/logistics/orders/LogisticsOrdersTable';
import { LogisticsMap } from '@/components/logistics/LogisticsMap';
import { RealTimeNotifications } from '@/components/logistics/notifications/RealTimeNotifications';
import { PredictiveETA } from '@/components/logistics/predictions/PredictiveETA';
import { WeatherImpactAnalysis } from '@/components/logistics/analytics/WeatherImpactAnalysis';

export const DashboardTab = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.${key}`, language) || key;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-md">
          <CardContent className="p-0">
            <LogisticsMap />
          </CardContent>
        </Card>
        <div className="lg:col-span-1">
          <RealTimeNotifications />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictiveETA />
        <WeatherImpactAnalysis />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center">
          <Package className="h-5 w-5 mr-2 text-dtwin-medium" />
          {t('recentShipments')}
        </h2>
        <LogisticsOrdersTable />
      </div>
    </div>
  );
};
