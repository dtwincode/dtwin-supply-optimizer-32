
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { Card } from "@/components/ui/card";

interface ForecastAnalysisTabProps {
  filteredData: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

export const ForecastAnalysisTab = ({
  filteredData,
  confidenceIntervals
}: ForecastAnalysisTabProps) => {
  if (!filteredData || filteredData.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-gray-500">No data available. Please adjust your filters.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-medium">1</span>
            <h4 className="text-lg font-semibold">Historical Data</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-medium">2</span>
            <h4 className="text-lg font-semibold">Forecasted Data</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-medium">3</span>
            <h4 className="text-lg font-semibold">Confidence Intervals</h4>
          </div>
        </div>
        
        <Card className="p-6">
          <ForecastChart
            data={filteredData}
            confidenceIntervals={confidenceIntervals}
          />
        </Card>
      </div>
    </div>
  );
};
