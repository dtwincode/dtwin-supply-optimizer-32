
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
      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">No Data Available</h3>
          <p className="text-gray-500">Please select different filters or ensure data is loaded.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Time Series Analysis</h3>
        <ForecastChart
          data={filteredData}
          confidenceIntervals={confidenceIntervals}
        />
      </Card>
    </div>
  );
};
