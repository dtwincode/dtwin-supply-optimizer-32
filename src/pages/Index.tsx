
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
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpDown,
  Clock,
  Truck,
  ShieldAlert,
  Zap
} from "lucide-react";

// Mock data - replace with actual API data later
const bufferProfileData = [
  { category: "Raw Materials", green: 65, yellow: 20, red: 15 },
  { category: "WIP", green: 55, yellow: 30, red: 15 },
  { category: "Finished Goods", green: 70, yellow: 20, red: 10 },
];

const demandVariabilityData = [
  { date: "Week 1", ADU: 100, demand: 95, buffer: 120 },
  { date: "Week 2", ADU: 100, demand: 110, buffer: 120 },
  { date: "Week 3", ADU: 100, demand: 85, buffer: 120 },
  { date: "Week 4", ADU: 100, demand: 120, buffer: 120 },
  { date: "Week 5", ADU: 100, demand: 90, buffer: 120 },
  { date: "Week 6", ADU: 100, demand: 105, buffer: 120 },
];

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* DDMRP Overview Section */}
        <section>
          <h3 className="font-display text-2xl font-semibold mb-4">
            DDMRP Dashboard
          </h3>
          
          {/* Primary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
                  <p className="text-sm text-gray-500">Buffer Penetration</p>
                  <p className="text-3xl font-semibold">78%</p>
                </div>
                <ShieldAlert className="h-8 w-8 text-success-500" />
              </div>
            </Card>
            
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Order Status</p>
                  <p className="text-3xl font-semibold">92%</p>
                </div>
                <Zap className="h-8 w-8 text-warning-500" />
              </div>
            </Card>
            
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Flow Index</p>
                  <p className="text-3xl font-semibold">4.2x</p>
                </div>
                <ArrowUpDown className="h-8 w-8 text-danger-500" />
              </div>
            </Card>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-50 rounded-full">
                  <Clock className="h-6 w-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Lead Time</p>
                  <p className="text-2xl font-semibold">5.2 days</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-warning-50 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-warning-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock Outs</p>
                  <p className="text-2xl font-semibold">2.3%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-success-50 rounded-full">
                  <Truck className="h-6 w-6 text-success-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">On-Time Delivery</p>
                  <p className="text-2xl font-semibold">95.8%</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buffer Profile Distribution */}
          <Card className="p-6">
            <h4 className="font-display text-xl font-semibold mb-4">
              Buffer Profile Distribution
            </h4>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bufferProfileData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="green"
                    stackId="stack"
                    fill="#10B981"
                    name="Green Zone"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="yellow"
                    stackId="stack"
                    fill="#F59E0B"
                    name="Yellow Zone"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="red"
                    stackId="stack"
                    fill="#EF4444"
                    name="Red Zone"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Demand Variability Analysis */}
          <Card className="p-6">
            <h4 className="font-display text-xl font-semibold mb-4">
              Demand Variability Analysis
            </h4>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandVariabilityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ADU"
                    stroke="#10B981"
                    name="Average Daily Usage"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="demand"
                    stroke="#F59E0B"
                    name="Actual Demand"
                  />
                  <Line
                    type="monotone"
                    dataKey="buffer"
                    stroke="#6B7280"
                    name="Buffer Level"
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
