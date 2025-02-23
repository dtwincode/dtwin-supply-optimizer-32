
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
  return (
    <div className="space-y-6">
      <ForecastMetricsCards data={filteredData} />
      
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
