
import React, { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { ShieldCheck, ArrowUpDown, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Define metrics directly in the component for now
// This can be moved to a data file later
const cycleMetrics = [
  {
    id: 'cycle-adherence',
    name: 'tacticalCycleAdherence',
    value: 92,
    target: '90%',
    trend: 'improving'
  },
  {
    id: 'response-time',
    name: 'adaptiveResponseTime',
    value: 24,
    unit: 'hours',
    target: '36',
    trend: 'improving'
  },
  {
    id: 'signal-detection',
    name: 'signalDetectionRate',
    value: 85,
    target: '80%',
    trend: 'stable'
  },
  {
    id: 'adjustment-accuracy',
    name: 'adjustmentAccuracy',
    value: 78,
    target: '85%',
    trend: 'declining'
  }
];

export const DDSOPMetricsGrid = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(`ddsop.${key}`, language) || key;
  
  useEffect(() => {
    console.log("DDSOPMetricsGrid rendered with language:", language);
  }, [language]);
  
  // Map icons to metrics for display
  const metricsWithIcons = cycleMetrics.map(metric => {
    let icon;
    switch(metric.id) {
      case 'cycle-adherence':
        icon = ShieldCheck;
        break;
      case 'response-time':
        icon = Clock;
        break;
      case 'signal-detection':
        icon = ArrowUpDown;
        break;
      case 'adjustment-accuracy':
        icon = AlertCircle;
        break;
      default:
        icon = AlertCircle;
    }
    return { ...metric, icon };
  });

  // Ensure we can display metrics properly for different value types
  const renderMetricValue = (metric) => {
    if (metric.unit) {
      return `${metric.value} ${t(metric.unit)}`;
    }
    return `${metric.value}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsWithIcons.map((metric) => (
        <Card key={metric.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base font-medium">{t(metric.name)}</h3>
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
