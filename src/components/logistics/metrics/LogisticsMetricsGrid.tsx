
import { MetricsCard } from '../analytics/MetricsCard';

export const LogisticsMetricsGrid = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricsCard
        title="On-Time Delivery Rate"
        metricType="on_time_delivery"
      />
      <MetricsCard
        title="Average Transit Time"
        metricType="avg_transit_time"
      />
      <MetricsCard
        title="Delivery Success Rate"
        metricType="delivery_success"
      />
      <MetricsCard
        title="Cost per Shipment"
        metricType="cost_per_shipment"
      />
    </div>
  );
};
