
import { TestingChart } from "@/components/forecasting/TestingChart";

interface ModelTestingTabProps {
  historicalData: any[];
  predictedData: any[];
}

export const ModelTestingTab = ({
  historicalData,
  predictedData
}: ModelTestingTabProps) => {
  return (
    <TestingChart
      historicalData={historicalData}
      predictedData={predictedData}
    />
  );
};
