
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { generateTestData, TestDataParams, getModelExample } from "@/utils/forecasting/metrics";

interface TestingChartProps {
  historicalData: any[];
  predictedData: any[];
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export const TestingChart = ({ 
  historicalData, 
  predictedData, 
  timeRange, 
  onTimeRangeChange 
}: TestingChartProps) => {
  const [testParams, setTestParams] = useState<TestDataParams>({
    length: 52, // One year of weekly data
    trend: 0.05,
    seasonality: 0.2,
    noise: 0.1,
    baseValue: 1000
  });

  const [testData, setTestData] = useState<number[]>([]);

  const generateNewTestData = () => {
    const newData = generateTestData(testParams);
    setTestData(newData);
  };

  const formattedData = testData.map((value, index) => ({
    date: new Date(Date.now() - (testData.length - index) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    actual: value,
  }));

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Model Testing Results</h3>
        <div className="flex gap-4">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="60">Last 60 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
              <SelectItem value="180">Last 180 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={generateNewTestData}
            className="flex items-center gap-2"
          >
            <Wand2 className="h-4 w-4" />
            Generate Test Data
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Trend Factor</label>
          <input
            type="range"
            min="0"
            max="0.2"
            step="0.01"
            value={testParams.trend}
            onChange={(e) => setTestParams(prev => ({ ...prev, trend: parseFloat(e.target.value) }))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">{testParams.trend}</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Seasonality Factor</label>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={testParams.seasonality}
            onChange={(e) => setTestParams(prev => ({ ...prev, seasonality: parseFloat(e.target.value) }))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">{testParams.seasonality}</span>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Noise Factor</label>
          <input
            type="range"
            min="0"
            max="0.3"
            step="0.05"
            value={testParams.noise}
            onChange={(e) => setTestParams(prev => ({ ...prev, noise: parseFloat(e.target.value) }))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">{testParams.noise}</span>
        </div>
      </div>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#10B981"
              name="Test Data"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
