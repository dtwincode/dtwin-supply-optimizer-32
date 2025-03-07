
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getLogisticsMetrics } from '@/services/logisticsAnalyticsService';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

interface MetricsCardProps {
  title: string;
  metricType: string;
}

export const MetricsCard = ({ title, metricType }: MetricsCardProps) => {
  const [hasError, setHasError] = useState(false);
  const { language } = useLanguage();
  
  const { data: metrics, isLoading, isError } = useQuery({
    queryKey: ['logistics-metrics', metricType],
    queryFn: () => getLogisticsMetrics(metricType),
    // Fallback to dummy data if the query fails
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

  // Use an effect to set the error state based on isError
  useEffect(() => {
    if (isError) {
      setHasError(true);
    }
  }, [isError]);

  const latestMetric = metrics?.[0];

  const formatDate = (dateString: string) => {
    if (!dateString) return getTranslation("logistics.notAvailable", language);
    const date = new Date(dateString);
    return date.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || hasError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">
              {language === 'en' ? 'Metrics unavailable' : 'المقاييس غير متوفرة'}
            </span>
          </div>
          <div className="text-2xl font-bold text-muted-foreground">--</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {latestMetric?.metric_value !== undefined ? latestMetric.metric_value.toFixed(2) : '--'}
        </div>
        <p className="text-xs text-muted-foreground" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {getTranslation("logistics.lastUpdated", language)}: {latestMetric?.timestamp ? formatDate(latestMetric.timestamp) : getTranslation("logistics.notAvailable", language)}
        </p>
      </CardContent>
    </Card>
  );
};
