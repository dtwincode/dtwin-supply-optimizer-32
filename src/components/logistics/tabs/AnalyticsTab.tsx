
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileBarChart, MapPin, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { CarrierPerformanceAnalytics } from '@/components/logistics/analytics/CarrierPerformanceAnalytics';
import { WeatherImpactAnalysis } from '@/components/logistics/analytics/WeatherImpactAnalysis';

export const AnalyticsTab = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.${key}`, language) || key;

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CarrierPerformanceAnalytics />
        <WeatherImpactAnalysis />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <FileBarChart className="h-5 w-5 mr-2 text-dtwin-medium" />
              {t('deliveryPerformance')}
            </h2>
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
              <span className="text-muted-foreground">
                {t('advancedAnalytics')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-md lg:col-span-2">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-dtwin-medium" />
              {t('geographicDistribution')}
            </h2>
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
              <span className="text-muted-foreground">
                {t('heatmapAnalytics')}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-dtwin-medium" />
              {t('riskAnalysis')}
            </h2>
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded">
              <span className="text-muted-foreground">
                {t('deliveryRiskAssessment')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
