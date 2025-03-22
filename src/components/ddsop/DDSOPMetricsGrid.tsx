
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { TrendingUp, ShieldCheck, ArrowUpDown, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const DDSOPMetricsGrid = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;
  
  const metrics = [
    {
      id: 'cycle-adherence',
      name: t('tacticalCycleAdherence'),
      value: 92,
      target: 95,
      trend: 'improving',
      icon: ShieldCheck
    },
    {
      id: 'market-response',
      name: t('marketResponseTime'),
      value: 3.5,
      unit: t('days'),
      target: '> 5',
      trend: 'stable',
      icon: Clock
    },
    {
      id: 'signal-detection',
      name: t('signalDetectionRate'),
      value: 87,
      target: 90,
      trend: 'stable',
      icon: ArrowUpDown
    },
    {
      id: 'adjustment-accuracy',
      name: t('adjustmentAccuracy'),
      value: 83,
      target: 85,
      trend: 'improving',
      icon: AlertCircle
    }
  ];

  // Ensure we can display metrics properly for different value types
  const renderMetricValue = (metric) => {
    if (metric.unit) {
      return `${metric.value} ${metric.unit}`;
    }
    return `${metric.value}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base font-medium">{metric.name}</h3>
              <span className="text-xl font-bold">
                {renderMetricValue(metric)}
              </span>
            </div>
            
            {!metric.unit && (
              <Progress 
                value={metric.value} 
                max={100} 
                className={`h-2 ${
                  metric.value >= parseInt(String(metric.target)) 
                    ? 'bg-green-500' 
                    : 'bg-amber-500'
                }`} 
              />
            )}
            
            <div className="flex justify-between text-xs mt-2">
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
