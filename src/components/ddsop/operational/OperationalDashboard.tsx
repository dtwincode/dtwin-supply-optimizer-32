
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, Activity, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Progress } from '@/components/ui/progress';
import { VarianceChart } from './VarianceChart';
import { ExecutionMetrics } from './ExecutionMetrics';
import { ddomMetrics } from '@/data/ddsopMetricsData';

export const OperationalDashboard: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;

  const getMetricIcon = (metricId: string, status: string) => {
    switch (metricId) {
      case 'flow-index':
        return <Activity className={`h-5 w-5 ${status === 'success' ? 'text-green-500' : status === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />;
      case 'tactical-cycle':
        return <CheckCircle className={`h-5 w-5 ${status === 'success' ? 'text-green-500' : status === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />;
      case 'demand-signal':
        return <AlertCircle className={`h-5 w-5 ${status === 'success' ? 'text-green-500' : status === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />;
      case 'execution-variance':
        return <Target className={`h-5 w-5 ${status === 'success' ? 'text-green-500' : status === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />;
      case 'adaptive-response':
        return <Clock className={`h-5 w-5 ${status === 'success' ? 'text-green-500' : status === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />;
      default:
        return <Activity className={`h-5 w-5 ${status === 'success' ? 'text-green-500' : status === 'warning' ? 'text-amber-500' : 'text-red-500'}`} />;
    }
  };

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {ddomMetrics.map((metric) => (
          <Card key={metric.id} className="shadow-sm">
            <CardContent className="pt-6 pb-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  {getMetricIcon(metric.id, metric.status)}
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
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VarianceChart />
        <ExecutionMetrics />
      </div>
    </div>
  );
};
