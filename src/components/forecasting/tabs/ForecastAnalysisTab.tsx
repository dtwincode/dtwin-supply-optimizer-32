
import { ForecastChart } from "@/components/forecasting/ForecastChart";

interface ForecastAnalysisTabProps {
  filteredData: any[];
  confidenceIntervals: { upper: number; lower: number }[];
}

export const ForecastAnalysisTab = ({
  filteredData,
  confidenceIntervals
}: ForecastAnalysisTabProps) => {
  return (
    <ForecastChart
      data={filteredData}
      confidenceIntervals={confidenceIntervals}
    />
  );
};
