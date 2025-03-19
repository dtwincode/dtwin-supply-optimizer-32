
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getLogisticsMetrics } from '@/services/logisticsAnalyticsService';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

interface LogisticsMetricsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
  metricType: string;
}

export const LogisticsMetricsCard = ({
  icon: Icon,
  label,
  value: defaultValue,
  bgColor,
  textColor,
  metricType
}: LogisticsMetricsCardProps) => {
  const [hasError, setHasError] = useState(false);
  const { language } = useLanguage();
  
  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['logistics-metrics', metricType],
    queryFn: () => getLogisticsMetrics(metricType),
    placeholderData: [
      {
        id: 'placeholder',
        metric_type: metricType,
        metric_value: metricType === 'on_time_delivery' ? 88.5 :
                      metricType === 'avg_transit_time' ? 3.2 :
                      metricType === 'delivery_success' ? 96.7 :
                      metricType === 'cost_per_shipment' ? 245.75 : 0,
        dimension: null,
        timestamp: new Date().toISOString(),
        metadata: {}
      }
    ],
  });

  useEffect(() => {
    if (isError) {
      setHasError(true);
    }
  }, [isError]);

  const latestMetric = metrics?.[0];
  const displayValue = isLoading ? defaultValue : 
    (latestMetric?.metric_value !== undefined ? 
      (metricType === 'on_time_delivery' || metricType === 'delivery_success' ? 
        `${latestMetric.metric_value.toFixed(1)}%` : 
      metricType === 'avg_transit_time' ? 
        `${latestMetric.metric_value.toFixed(1)} days` : 
      metricType === 'cost_per_shipment' ? 
        `$${latestMetric.metric_value.toFixed(2)}` : 
        latestMetric.metric_value.toFixed(2)) : 
      defaultValue);

  const formatDate = (dateString: string) => {
    if (!dateString) return getTranslation("common.logistics.notAvailable", language);
    const date = new Date(dateString);
    return date.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  if (isError || hasError) {
    return (
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
          <div className={`p-3 ${bgColor} rounded-full`}>
            <Icon className={`h-6 w-6 ${textColor}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <div className="flex items-center mt-1">
              <AlertTriangle className="h-4 w-4 text-destructive mr-1" />
              <span className="text-sm text-destructive">
                {language === 'en' ? 'Metrics unavailable' : 'المقاييس غير متوفرة'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${bgColor} rounded-full`}>
          {isLoading ? (
            <Loader2 className={`h-6 w-6 ${textColor} animate-spin`} />
          ) : (
            <Icon className={`h-6 w-6 ${textColor}`} />
          )}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold">{displayValue}</p>
          <p className="text-xs text-muted-foreground mt-1" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {getTranslation("common.logistics.lastUpdated", language)}: {latestMetric?.timestamp ? formatDate(latestMetric.timestamp) : getTranslation("common.logistics.notAvailable", language)}
          </p>
        </div>
      </div>
    </Card>
  );
}
