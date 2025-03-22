
import React from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { MetricIconRenderer } from "../utilities/MetricIconRenderer";

interface MetricCardProps {
  metric: {
    id: string;
    name: string;
    status: string;
    value: number | string;
    target?: number;
    unit?: string;
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Card key={metric.id} className="shadow-sm">
      <CardContent className="pt-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <MetricIconRenderer metricId={metric.id} status={metric.status} />
            <span className="ml-2 text-sm font-medium">{t(metric.name)}</span>
          </div>
          <span className="text-xl font-bold">
            {typeof metric.value === 'number' ? 
              (metric.unit ? `${metric.value} ${t(metric.unit)}` : `${metric.value}%`) : 
              metric.value}
          </span>
        </div>
        
        {typeof metric.value === 'number' && !metric.unit && (
          <div className="space-y-1">
            <Progress 
              value={metric.value} 
              max={100} 
              className={`h-2 ${getProgressColor(metric.status)}`} 
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('status')}: {t(metric.status)}</span>
              <span>{t('target')}: {metric.target}%</span>
            </div>
          </div>
        )}
        
        {typeof metric.value === 'number' && metric.unit && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{t('status')}: {t(metric.status)}</span>
              <span>{t('target')}: {metric.target}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
