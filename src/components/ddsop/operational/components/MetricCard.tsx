
import React from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

interface MetricCardProps {
  metric: {
    id: string;
    name: string;
    status: string;
    value: number | string;
    target?: number;
    unit?: string;
    trend?: string;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getTrendColor = (trend?: string) => {
    if (!trend) return 'text-blue-500';
    
    switch (trend.toLowerCase()) {
      case 'improving':
        return 'text-green-500';
      case 'declining':
        return 'text-red-500';
      case 'stable':
      default:
        return 'text-blue-500';
    }
  };

  // Format the value display
  const displayValue = typeof metric.value === 'number' 
    ? (metric.unit ? metric.value : `${metric.value}%`) 
    : metric.value;
  
  // Format the target display
  const displayTarget = metric.target && (metric.unit 
    ? `${metric.target} ${t(metric.unit)}` 
    : metric.target);

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium">{t(metric.name)}</h3>
            <span className="text-2xl font-bold">
              {displayValue}
              {typeof metric.value === 'number' && metric.unit && 
                <span className="ml-2">{t(metric.unit)}</span>
              }
            </span>
          </div>
          
          {typeof metric.value === 'number' && !metric.unit && (
            <Progress 
              value={metric.value} 
              max={100} 
              className={`h-2 mb-2 ${getProgressColor(metric.status)}`} 
            />
          )}
          
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{t('target')}: {displayTarget}</span>
            {metric.trend && (
              <div className="flex items-center">
                <span className="mr-1">{t('trend')}:</span>
                <span className={getTrendColor(metric.trend)}>
                  {t(metric.trend.toLowerCase())}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
