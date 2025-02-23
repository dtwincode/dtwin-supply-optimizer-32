
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { Card } from "@/components/ui/card";
import { ForecastDataPoint } from "@/types/forecasting";

interface ForecastAnalysisTabProps {
  filteredData: ForecastDataPoint[];
  confidenceIntervals: Array<{ upper: number; lower: number; }>;
}

export const ForecastAnalysisTab = ({
  filteredData,
  confidenceIntervals
}: ForecastAnalysisTabProps) => {
  // Calculate metrics from filteredData
  const calculateMetrics = (data: ForecastDataPoint[]) => {
    const actualValues = data.filter(d => d.actual !== null).map(d => d.actual!);
    const forecastValues = data.filter(d => d.actual !== null).map(d => d.forecast);
    
    if (actualValues.length === 0) {
      return {
        mape: 0,
        mae: 0,
        rmse: 0
      };
    }

    // Calculate MAPE
    const mape = actualValues.reduce((sum, actual, i) => {
      return sum + Math.abs((actual - forecastValues[i]) / actual);
    }, 0) / actualValues.length * 100;

    // Calculate MAE
    const mae = actualValues.reduce((sum, actual, i) => {
      return sum + Math.abs(actual - forecastValues[i]);
    }, 0) / actualValues.length;

    // Calculate RMSE
    const rmse = Math.sqrt(
      actualValues.reduce((sum, actual, i) => {
        return sum + Math.pow(actual - forecastValues[i], 2);
      }, 0) / actualValues.length
    );

    return {
      mape,
      mae,
      rmse
    };
  };

  const metrics = calculateMetrics(filteredData);

  return (
    <div className="space-y-6">
      <ForecastMetricsCards metrics={metrics} />
      
      <Card className="p-6">
        <div className="space-y-2 mb-4">
          <h3 className="text-lg font-semibold">Forecast Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Visual analysis of forecasted values with confidence intervals
          </p>
        </div>
        <div className="h-[400px]">
          <ForecastChart 
            data={filteredData} 
            confidenceIntervals={confidenceIntervals}
          />
        </div>
      </Card>
    </div>
  );
};
