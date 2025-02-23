
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastTable } from "@/components/forecasting/ForecastTable";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ForecastDistributionTabProps {
  forecastTableData: any[];
}

export const ForecastDistributionTab = ({ 
  forecastTableData 
}: ForecastDistributionTabProps) => {
  return (
    <div className="space-y-6">
      {/* Charts and Tables */}
      <div className="space-y-6">
        {/* Forecast Distribution Chart */}
        <Card className="p-6">
          <div className="space-y-2 mb-4">
            <h3 className="text-lg font-semibold">Forecast Distribution</h3>
            <p className="text-sm text-muted-foreground">
              Visual representation of forecast distribution and patterns
            </p>
          </div>
          <div className="h-[400px]">
            <ForecastChart data={forecastTableData} confidenceIntervals={[]} />
          </div>
        </Card>

        <Separator />

        {/* Forecast Table */}
        <Card className="p-6">
          <div className="space-y-2 mb-4">
            <h3 className="text-lg font-semibold">Forecast Details</h3>
            <p className="text-sm text-muted-foreground">
              Detailed view of forecasted values and actual data
            </p>
          </div>
          <ForecastTable data={forecastTableData} />
        </Card>
      </div>
    </div>
  );
};
