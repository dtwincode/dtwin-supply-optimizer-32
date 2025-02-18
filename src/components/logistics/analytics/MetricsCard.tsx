
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getLogisticsMetrics } from '@/services/logisticsAnalyticsService';

interface MetricsCardProps {
  title: string;
  metricType: string;
}

export const MetricsCard = ({ title, metricType }: MetricsCardProps) => {
  const { data: metrics } = useQuery({
    queryKey: ['logistics-metrics', metricType],
    queryFn: () => getLogisticsMetrics(metricType),
  });

  const latestMetric = metrics?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {latestMetric?.metric_value.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">
          Last updated: {latestMetric?.timestamp ? new Date(latestMetric.timestamp).toLocaleString() : 'N/A'}
        </p>
      </CardContent>
    </Card>
  );
};
