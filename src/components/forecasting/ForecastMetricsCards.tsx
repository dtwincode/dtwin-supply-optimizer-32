
import { Card } from "@/components/ui/card";
import { TrendingUp, AlertCircle, Zap, Share2 } from "lucide-react";
import { type ModelMetrics } from "@/utils/forecasting/metrics";

interface ForecastMetricsCardsProps {
  metrics: ModelMetrics;
}

export const ForecastMetricsCards = ({ metrics }: ForecastMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary-50 rounded-full">
            <TrendingUp className="h-6 w-6 text-primary-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Forecast Accuracy</p>
            <p className="text-2xl font-semibold">{(100 - metrics.mape).toFixed(1)}%</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-warning-50 rounded-full">
            <AlertCircle className="h-6 w-6 text-warning-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">MAPE</p>
            <p className="text-2xl font-semibold">{metrics.mape}%</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-success-50 rounded-full">
            <Zap className="h-6 w-6 text-success-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">MAE</p>
            <p className="text-2xl font-semibold">{metrics.mae}</p>
          </div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-info-50 rounded-full">
            <Share2 className="h-6 w-6 text-info-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">RMSE</p>
            <p className="text-2xl font-semibold">{metrics.rmse}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
