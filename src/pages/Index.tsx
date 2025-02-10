
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Package } from "lucide-react";

const mockData = {
  inventoryLevels: [
    { name: "Product A", stock: 65, buffer: 100 },
    { name: "Product B", stock: 45, buffer: 80 },
    { name: "Product C", stock: 90, buffer: 90 },
    { name: "Product D", stock: 30, buffer: 70 },
    { name: "Product E", stock: 85, buffer: 95 },
  ],
  demandTrend: [
    { date: "Jan", actual: 65, forecast: 62 },
    { date: "Feb", actual: 72, forecast: 70 },
    { date: "Mar", actual: 68, forecast: 65 },
    { date: "Apr", actual: 75, forecast: 78 },
    { date: "May", actual: 82, forecast: 80 },
    { date: "Jun", actual: 88, forecast: 85 },
  ],
};

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Overview Section */}
        <section>
          <h3 className="font-display text-2xl font-semibold mb-4">
            Inventory Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total SKUs</p>
                  <p className="text-3xl font-semibold">1,234</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Stock Value</p>
                  <p className="text-3xl font-semibold">$2.5M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success-DEFAULT" />
              </div>
            </Card>
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Buffer Alerts</p>
                  <p className="text-3xl font-semibold text-warning-DEFAULT">12</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning-DEFAULT" />
              </div>
            </Card>
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Stock Turnover</p>
                  <p className="text-3xl font-semibold">4.2x</p>
                </div>
                <TrendingDown className="h-8 w-8 text-danger-DEFAULT" />
              </div>
            </Card>
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DDMRP Buffer Status */}
          <Card className="p-6">
            <h4 className="font-display text-xl font-semibold mb-4">
              DDMRP Buffer Status
            </h4>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.inventoryLevels}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="stock"
                    fill="#10B981"
                    name="Current Stock"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="buffer"
                    fill="#F59E0B"
                    name="Buffer Level"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Demand Trend Analysis */}
          <Card className="p-6">
            <h4 className="font-display text-xl font-semibold mb-4">
              Demand Trend Analysis
            </h4>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.demandTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
