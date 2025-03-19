
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { LogisticsMetricsCard } from './LogisticsMetricsCard';
import { TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';

export const LogisticsMetricsGrid = () => {
  const { language } = useLanguage();
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <LogisticsMetricsCard
        icon={TrendingUp}
        label={getTranslation("common.logistics.onTimeDeliveryRate", language)}
        value="88.5%"
        bgColor="bg-blue-100"
        textColor="text-blue-700"
        metricType="on_time_delivery"
      />
      <LogisticsMetricsCard
        icon={Clock}
        label={getTranslation("common.logistics.averageTransitTime", language)}
        value="3.2 days"
        bgColor="bg-amber-100"
        textColor="text-amber-700"
        metricType="avg_transit_time"
      />
      <LogisticsMetricsCard
        icon={CheckCircle}
        label={getTranslation("common.logistics.deliverySuccessRate", language)}
        value="96.7%"
        bgColor="bg-green-100"
        textColor="text-green-700"
        metricType="delivery_success"
      />
      <LogisticsMetricsCard
        icon={DollarSign}
        label={getTranslation("common.logistics.costPerShipment", language)}
        value="$245.75"
        bgColor="bg-purple-100"
        textColor="text-purple-700"
        metricType="cost_per_shipment"
      />
    </div>
  );
};
