
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Clock, Activity, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Progress } from '@/components/ui/progress';
import { DDOMVarianceChart } from './DDOMVarianceChart';
import { DDOMExecutionMetrics } from './DDOMExecutionMetrics';

export const DDOMOperationalDashboard: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`common.logistics.ddom.${key}`, language) || key;

  // Sample DDOM compliance metrics
  const ddomMetrics = [
    { 
      id: 'flow-index', 
      name: t('flowIndex'), 
      value: 86, 
      target: 90, 
      status: 'warning', 
      icon: <Activity className="h-4 w-4 text-amber-500" /> 
    },
    { 
      id: 'tactical-cycle', 
      name: t('tacticalCycleAdherence'), 
      value: 92, 
      target: 90, 
      status: 'success', 
      icon: <CheckCircle className="h-4 w-4 text-green-500" /> 
    },
    { 
      id: 'demand-signal', 
      name: t('demandSignalQuality'), 
      value: 78, 
      target: 85, 
      status: 'danger', 
      icon: <AlertCircle className="h-4 w-4 text-red-500" /> 
    },
    { 
      id: 'execution-variance', 
      name: t('executionVariance'), 
      value: 88, 
      target: 85, 
      status: 'success', 
      icon: <Target className="h-4 w-4 text-green-500" /> 
    },
    { 
      id: 'adaptive-response', 
      name: t('adaptiveResponseTime'), 
      value: 4.2, 
      unit: t('hours'), 
      target: "< 5.0",
      status: 'success', 
      icon: <Clock className="h-4 w-4 text-green-500" /> 
    }
  ];

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

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'success':
        return t('onTrack');
      case 'warning':
        return t('warning');
      case 'danger':
        return t('alert');
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {ddomMetrics.map((metric) => (
          <Card key={metric.id} className="shadow-sm">
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  {metric.icon}
                  <span className="ml-1.5 text-xs font-medium">{metric.name}</span>
                </div>
                <span className="text-lg font-bold">
                  {typeof metric.value === 'number' ? 
                    (metric.unit ? `${metric.value} ${metric.unit}` : `${metric.value}%`) : 
                    metric.value}
                </span>
              </div>
              
              {typeof metric.value === 'number' && !metric.unit && (
                <div className="space-y-1">
                  <Progress 
                    value={metric.value} 
                    max={100} 
                    className={`h-1.5 ${getProgressColor(metric.status)}`} 
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{t('status')}: {getStatusTranslation(metric.status)}</span>
                    <span>{t('target')}: {metric.target}%</span>
                  </div>
                </div>
              )}
              
              {typeof metric.value === 'number' && metric.unit && (
                <div className="mt-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{t('status')}: {getStatusTranslation(metric.status)}</span>
                    <span>{t('target')}: {metric.target}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DDOMVarianceChart />
        <DDOMExecutionMetrics />
      </div>
    </div>
  );
};
