
import { TrendingUp, AlertCircle, Zap, Share2 } from "lucide-react";
import { type ModelMetrics } from "@/utils/forecasting/metricsCalculation";

interface ForecastMetricsCardsProps {
  metrics: ModelMetrics;
}

export const ForecastMetricsCards = ({ metrics }: ForecastMetricsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-50 rounded-full">
            <TrendingUp className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Forecast Accuracy</p>
            <p className="text-xl font-semibold">{(100 - metrics.mape).toFixed(1)}%</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-warning-50 rounded-full">
            <AlertCircle className="h-5 w-5 text-warning-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">MAPE</p>
            <p className="text-xl font-semibold">{metrics.mape}%</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-success-50 rounded-full">
            <Zap className="h-5 w-5 text-success-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">MAE</p>
            <p className="text-xl font-semibold">{metrics.mae}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-3 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-info-50 rounded-full">
            <Share2 className="h-5 w-5 text-info-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">RMSE</p>
            <p className="text-xl font-semibold">{metrics.rmse}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
