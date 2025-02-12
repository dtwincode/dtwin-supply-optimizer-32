
import { Card } from "@/components/ui/card";
import { TestDataChart } from "./test-chart/TestDataChart";
import { ForecastMetricsCards } from "./ForecastMetricsCards";

interface TestingChartProps {
  historicalData: any[];
  predictedData: any[];
}

export const TestingChart = ({ historicalData, predictedData }: TestingChartProps) => {
  // Add console logs to check data being passed
  console.log('TestingChart - historicalData:', historicalData);
  console.log('TestingChart - predictedData:', predictedData);

  // Mock metrics for demonstration
  const mockMetrics = {
    mape: 0,
    mae: 0,
    rmse: 0
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Demand Forecast</h3>
        <ForecastMetricsCards metrics={mockMetrics} />
      </div>
      <Card className="p-6">
        <div className="border rounded-lg p-4">
          <TestDataChart data={historicalData} />
        </div>
      </Card>
    </div>
  );
};
