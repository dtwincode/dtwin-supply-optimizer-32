
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastMetricsCards } from "@/components/forecasting/ForecastMetricsCards";
import { Card } from "@/components/ui/card";

interface ForecastAnalysisTabProps {
  filteredData: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

export const ForecastAnalysisTab = ({
  filteredData,
  confidenceIntervals
}: ForecastAnalysisTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <ForecastMetricsCards 
          metrics={{
            mape: 12.5,
            mae: 45.2,
            rmse: 52.8,
            accuracy: 87.5
          }}
        />
      </Card>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Forecast Visualization</h3>
            <p className="text-sm text-muted-foreground">
              Historical data and forecast predictions with confidence intervals
            </p>
          </div>
          <ForecastChart
            data={filteredData}
            confidenceIntervals={confidenceIntervals}
          />
        </div>
      </Card>
    </div>
  );
};
