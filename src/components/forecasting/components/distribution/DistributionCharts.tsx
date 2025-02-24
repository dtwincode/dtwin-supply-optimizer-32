
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DistributionChartsProps {
  selectedSKU: string;
  distributionData: any[];
  weeklyDistribution: any[];
  onSelectSKU: (sku: string) => void;
  forecastPeriod: string;
}

export const DistributionCharts = ({
  selectedSKU,
  distributionData,
  weeklyDistribution,
  onSelectSKU,
  forecastPeriod
}: DistributionChartsProps) => {
  const getQuantitiesChartData = () => {
    return distributionData.map(item => ({
      sku: item.sku,
      "Min Quantity": item.minQuantity,
      "Optimal Quantity": item.optimalQuantity,
      "Max Quantity": item.maxQuantity,
      "Current Stock": item.currentStock
    }));
  };

  return (
    <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
      <Card className="p-6 shadow-sm">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Distribution Quantities Comparison</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getQuantitiesChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sku" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Min Quantity" fill="#8884d8" />
                <Bar dataKey="Optimal Quantity" fill="#82ca9d" />
                <Bar dataKey="Max Quantity" fill="#ffc658" />
                <Bar dataKey="Current Stock" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Weekly Distribution</h3>
            <Select value={selectedSKU} onValueChange={onSelectSKU}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select SKU" />
              </SelectTrigger>
              <SelectContent>
                {distributionData.map(item => (
                  <SelectItem key={item.sku} value={item.sku}>
                    {item.sku}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="planned" 
                  stroke="#82ca9d" 
                  name="Planned Quantity"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="minimum" 
                  stroke="#8884d8" 
                  strokeDasharray="5 5"
                  name="Minimum"
                />
                <Line 
                  type="monotone" 
                  dataKey="maximum" 
                  stroke="#ffc658" 
                  strokeDasharray="5 5"
                  name="Maximum"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </div>
  );
};
