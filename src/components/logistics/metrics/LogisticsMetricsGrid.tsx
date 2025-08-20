import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { LogisticsMetricsCard } from "./LogisticsMetricsCard";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  DollarSign,
  Truck,
  Leaf,
  AlertTriangle,
  BarChart,
  Globe,
} from "lucide-react";

export const LogisticsMetricsGrid = () => {
  const { language } = useLanguage();

  return (
    <div
      className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <LogisticsMetricsCard
        icon={TrendingUp}
        label={getTranslation("logistics.onTimeDeliveryRate", language)}
        value="88.5%"
        bgColor="bg-blue-100"
        textColor="text-blue-700"
        metricType="on_time_delivery"
      />
      <LogisticsMetricsCard
        icon={Clock}
        label={getTranslation("logistics.averageTransitTime", language)}
        value="3.2 days"
        bgColor="bg-amber-100"
        textColor="text-amber-700"
        metricType="avg_transit_time"
      />
      <LogisticsMetricsCard
        icon={CheckCircle}
        label={getTranslation("logistics.deliverySuccessRate", language)}
        value="96.7%"
        bgColor="bg-green-100"
        textColor="text-green-700"
        metricType="delivery_success"
      />
      <LogisticsMetricsCard
        icon={DollarSign}
        label={getTranslation("logistics.costPerShipment", language)}
        value="﷼245.75"
        bgColor="bg-purple-100"
        textColor="text-purple-700"
        metricType="cost_per_shipment"
      />
      <LogisticsMetricsCard
        icon={Truck}
        label={
          getTranslation("logistics.carrierPerformance", language) ||
          "Carrier Performance"
        }
        value="92.4%"
        bgColor="bg-blue-100"
        textColor="text-blue-700"
        metricType="carrier_performance"
      />
      <LogisticsMetricsCard
        icon={Leaf}
        label={
          getTranslation("logistics.carbonFootprint", language) ||
          "Carbon Footprint"
        }
        value="124.5 kg"
        bgColor="bg-green-100"
        textColor="text-green-700"
        metricType="carbon_footprint"
      />
      <LogisticsMetricsCard
        icon={AlertTriangle}
        label={getTranslation("logistics.delayRate", language) || "Delay Rate"}
        value="4.2%"
        bgColor="bg-orange-100"
        textColor="text-orange-700"
        metricType="delay_rate"
      />
      <LogisticsMetricsCard
        icon={BarChart}
        label={
          getTranslation("logistics.predictedVolume", language) ||
          "Predicted Volume"
        }
        value="+8.3%"
        bgColor="bg-indigo-100"
        textColor="text-indigo-700"
        metricType="predicted_volume"
      />
      <LogisticsMetricsCard
        icon={Globe}
        label={
          getTranslation("logistics.weatherImpact", language) ||
          "Weather Impact"
        }
        value="Medium"
        bgColor="bg-cyan-100"
        textColor="text-cyan-700"
        metricType="weather_impact"
      />
    </div>
  );
};
