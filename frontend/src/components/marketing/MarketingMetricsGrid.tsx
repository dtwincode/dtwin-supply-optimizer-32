
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Sample marketing metrics data - in a real app, this would come from an API
const marketingMetrics = [
  {
    id: 'campaign-roi',
    name: 'marketingMetrics.campaignROI',
    value: 280,
    target: 250,
    unit: 'percentageReturn',
    trend: 'improving'
  },
  {
    id: 'customer-acquisition',
    name: 'marketingMetrics.customerAcquisition',
    value: 68,
    target: 75,
    trend: 'stable'
  },
  {
    id: 'conversion-rate',
    name: 'marketingMetrics.conversionRate',
    value: 3.2,
    target: 3.0,
    unit: 'percent',
    trend: 'improving'
  },
  {
    id: 'demand-impact',
    name: 'marketingMetrics.demandImpact',
    value: 15,
    target: 10,
    unit: 'percent',
    trend: 'improving'
  }
];

export const MarketingMetricsGrid = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`marketing.${key}`, language) || key;
  
  // Map icons to metrics for display
  const metricsWithIcons = marketingMetrics.map(metric => {
    let icon;
    switch(metric.id) {
      case 'campaign-roi':
        icon = DollarSign;
        break;
      case 'customer-acquisition':
        icon = Users;
        break;
      case 'conversion-rate':
        icon = TrendingUp;
        break;
      case 'demand-impact':
        icon = Target;
        break;
      default:
        icon = TrendingUp;
    }
    return { ...metric, icon };
  });

  // Format metric value display
  const renderMetricValue = (metric) => {
    if (metric.unit === 'percentageReturn') {
      return `${metric.value}%`;
    } else if (metric.unit === 'percent') {
      return `${metric.value}%`;
    }
    return `${metric.value}%`;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {metricsWithIcons.map((metric) => (
        <Card key={metric.id} className="overflow-hidden">
          <CardContent className="p-2">
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-sm font-medium">{t(metric.name)}</h3>
              <span className="text-lg font-bold">
                {renderMetricValue(metric)}
              </span>
            </div>
            
            <Progress 
              value={metric.value} 
              max={100} 
              className={`h-1.5 ${
                metric.value >= parseInt(String(metric.target)) 
                  ? 'bg-green-500' 
                  : 'bg-amber-500'
              }`} 
            />
            
            <div className="flex justify-between text-xs mt-1">
              <span className="text-muted-foreground">{t('target')}: {metric.target}</span>
              <div className="flex items-center">
                <span className="text-muted-foreground">{t('trend')}: </span>
                <span className={`${
                  metric.trend === 'improving' 
                    ? 'text-green-600' 
                    : metric.trend === 'declining' 
                      ? 'text-red-600' 
                      : 'text-blue-600'
                } ml-1`}>
                  {t(metric.trend)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
