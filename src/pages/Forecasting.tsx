
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp, AlertCircle, Zap } from "lucide-react";

// Mock data - replace with actual API data
const forecastData = [
  { month: "Jan", actual: 65, forecast: 62, variance: -3 },
  { month: "Feb", actual: 72, forecast: 70, variance: -2 },
  { month: "Mar", actual: 68, forecast: 65, variance: -3 },
  { month: "Apr", actual: 75, forecast: 78, variance: 3 },
  { month: "May", actual: 82, forecast: 80, variance: -2 },
  { month: "Jun", actual: 88, forecast: 85, variance: -3 },
  { month: "Jul", actual: null, forecast: 92, variance: null },
  { month: "Aug", actual: null, forecast: 88, variance: null },
  { month: "Sep", actual: null, forecast: 85, variance: null },
];

const patternData = [
  { name: "Seasonal", value: 35 },
  { name: "Trend", value: 25 },
  { name: "Cyclical", value: 20 },
  { name: "Random", value: 20 },
];

const Forecasting = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Demand Forecasting</h1>
          <div className="flex gap-4">
            <Select defaultValue="6m">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Forecast Horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="12m">12 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Forecast Accuracy</p>
                <p className="text-2xl font-semibold">95.2%</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-warning-50 rounded-full">
                <AlertCircle className="h-6 w-6 text-warning-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">MAPE</p>
                <p className="text-2xl font-semibold">4.8%</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-success-50 rounded-full">
                <Zap className="h-6 w-6 text-success-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bias</p>
                <p className="text-2xl font-semibold">-1.2%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Demand Forecast</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10B981"
                    name="Actual Demand"
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#F59E0B"
                    name="Forecast"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Demand Patterns</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patternData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="#10B981"
                    name="Pattern Distribution (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
