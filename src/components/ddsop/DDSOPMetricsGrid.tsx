
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { TrendingUp, ShieldCheck, ArrowUpDown, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const DDSOPMetricsGrid = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.ddsop.${key}`, language) || key;
  
  const metrics = [
    {
      id: 'flow-index',
      name: t('flowIndex'),
      value: 87,
      target: 95,
      trend: 'increasing',
      icon: TrendingUp
    },
    {
      id: 'tactical-cycle',
      name: t('tacticalCycleAdherence'),
      value: 92,
      target: 90,
      trend: 'stable',
      icon: ShieldCheck
    },
    {
      id: 'demand-signal',
      name: t('demandSignalQuality'),
      value: 84,
      target: 85,
      trend: 'increasing',
      icon: ArrowUpDown
    },
    {
      id: 'execution-variance',
      name: t('executionVariance'),
      value: 78,
      target: 80,
      trend: 'decreasing',
      icon: AlertCircle
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="bg-primary-50 p-2 rounded-full">
                <metric.icon className="h-5 w-5 text-primary" />
              </div>
              <span className={`text-sm font-semibold ${
                metric.value >= metric.target ? 'text-green-600' : 'text-amber-600'
              }`}>
                {metric.value}%
              </span>
            </div>
            <h3 className="text-sm font-medium mb-1">{metric.name}</h3>
            <Progress 
              value={metric.value} 
              max={100} 
              className={`h-2 ${
                metric.value >= metric.target 
                  ? 'bg-green-500' 
                  : 'bg-amber-500'
              }`} 
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{t('target')}: {metric.target}%</span>
              <span className={`${
                metric.trend === 'increasing' 
                  ? 'text-green-600' 
                  : metric.trend === 'decreasing' 
                    ? 'text-red-600' 
                    : 'text-blue-600'
              }`}>
                {t(metric.trend)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
