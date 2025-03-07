
import { MetricsCard } from '../analytics/MetricsCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

export const LogisticsMetricsGrid = () => {
  const { language } = useLanguage();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <MetricsCard
        title={getTranslation("common.logistics.onTimeDeliveryRate", language)}
        metricType="on_time_delivery"
      />
      <MetricsCard
        title={getTranslation("common.logistics.averageTransitTime", language)}
        metricType="avg_transit_time"
      />
      <MetricsCard
        title={getTranslation("common.logistics.deliverySuccessRate", language)}
        metricType="delivery_success"
      />
      <MetricsCard
        title={getTranslation("common.logistics.costPerShipment", language)}
        metricType="cost_per_shipment"
      />
    </div>
  );
};
