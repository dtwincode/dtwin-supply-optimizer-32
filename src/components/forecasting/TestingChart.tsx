
import { Card } from "@/components/ui/card";
import { TestDataChart } from "./test-chart/TestDataChart";

interface TestingChartProps {
  historicalData: any[];
  predictedData: any[];
}

export const TestingChart = ({ historicalData, predictedData }: TestingChartProps) => {
  // Add console logs to check data being passed
  console.log('TestingChart - historicalData:', historicalData);
  console.log('TestingChart - predictedData:', predictedData);

  return (
    <Card className="p-4">
      <TestDataChart data={historicalData} />
    </Card>
  );
};
