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
  Zap,
  Boxes,
  LineChart as LineChartIcon,
  ShoppingBag,
  Megaphone,
  FileText,
  BrainCircuit,
  DollarSign,
  Leaf,
  Shield,
  Users,
  BadgeCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { getTranslation } from "@/utils/translation";
import { toArabicNumerals } from "@/utils/arabicNumerals";

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

const modulesSummary = [
  {
    title: "Inventory Management",
    icon: Boxes,
    stats: "1,234 SKUs",
    description: "Track and manage inventory levels",
    route: "/inventory",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Demand Forecasting",
    icon: LineChartIcon,
    stats: "92% accuracy",
    description: "Predict future demand patterns",
    route: "/forecasting",
    color: "text-green-500",
    bgColor: "bg-green-50"
  },
  {
    title: "Sales Planning",
    icon: ShoppingBag,
    stats: "₪2.1M pipeline",
    description: "Plan and track sales activities",
    route: "/sales-planning",
    color: "text-purple-500",
    bgColor: "bg-purple-50"
  },
  {
    title: "Marketing Campaigns",
    icon: Megaphone,
    stats: "12 active",
    description: "Manage marketing initiatives",
    route: "/marketing",
    color: "text-pink-500",
    bgColor: "bg-pink-50"
  },
  {
    title: "Logistics",
    icon: Truck,
    stats: "95.8% on-time",
    description: "Optimize delivery operations",
    route: "/logistics",
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  {
    title: "Reports & Analytics",
    icon: FileText,
    stats: "24 reports",
    description: "Access business insights",
    route: "/reports",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50"
  }
];

const financialMetrics = [
  {
    title: "Revenue",
    value: "₪12.4M",
    change: "+8.2%",
    trend: "up",
  },
  {
    title: "Operating Costs",
    value: "₪4.2M",
    change: "-3.1%",
    trend: "down",
  },
  {
    title: "Profit Margin",
    value: "24.5%",
    change: "+2.1%",
    trend: "up",
  }
];

const sustainabilityMetrics = [
  {
    title: "Carbon Footprint",
    value: "12.3k",
    unit: "CO₂e",
    change: "-5.2%",
  },
  {
    title: "Waste Reduction",
    value: "85%",
    change: "+2.1%",
  },
  {
    title: "Green Suppliers",
    value: "76%",
    change: "+4.3%",
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const formatNumber = (num: number): string => {
    if (language === 'ar') {
      return toArabicNumerals(num);
    }
    return num.toString();
  };

  const formatCurrency = (amount: number): string => {
    if (language === 'ar') {
      return `₪${toArabicNumerals(amount.toLocaleString())}`;
    }
    return `₪${amount.toLocaleString()}`;
  };

  const formatPercentage = (percentage: number): string => {
    if (language === 'ar') {
      return `${toArabicNumerals(percentage)}%`;
    }
    return `${percentage}%`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        <section>
          <h3 className="font-display text-2xl font-semibold mb-4">
            {getTranslation('dashboard', language)}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{getTranslation('dashboardMetrics.totalSKUs', language)}</p>
                  <p className="text-3xl font-semibold">{formatNumber(1234)}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </Card>
            
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{getTranslation('dashboardMetrics.bufferPenetration', language)}</p>
                  <p className="text-3xl font-semibold">{formatPercentage(78)}</p>
                </div>
                <ShieldAlert className="h-8 w-8 text-success-500" />
              </div>
            </Card>
            
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{getTranslation('dashboardMetrics.orderStatus', language)}</p>
                  <p className="text-3xl font-semibold">{formatPercentage(92)}</p>
                </div>
                <Zap className="h-8 w-8 text-warning-500" />
              </div>
            </Card>
            
            <Card className="p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{getTranslation('dashboardMetrics.flowIndex', language)}</p>
                  <p className="text-3xl font-semibold">{formatNumber(4.2)}x</p>
                </div>
                <ArrowUpDown className="h-8 w-8 text-danger-500" />
              </div>
            </Card>
          </div>

          <div className="mb-8">
            <h4 className="font-display text-xl font-semibold mb-4">
              {getTranslation('financialMetrics.title', language)}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {financialMetrics.map((metric) => (
                <Card key={metric.title} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {getTranslation(`financialMetrics.${metric.title.toLowerCase()}`, language)}
                      </p>
                      <p className="text-2xl font-semibold mt-1">
                        {language === 'ar' ? toArabicNumerals(metric.value) : metric.value}
                      </p>
                      <p className={`text-sm mt-1 ${
                        metric.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {language === 'ar' ? toArabicNumerals(metric.change) : metric.change}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-primary" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="font-display text-xl font-semibold mb-4">
              {getTranslation('sustainabilityMetrics.title', language)}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sustainabilityMetrics.map((metric) => (
                <Card key={metric.title} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {getTranslation(`sustainabilityMetrics.${metric.title.toLowerCase()}`, language)}
                      </p>
                      <p className="text-2xl font-semibold mt-1">
                        {formatNumber(parseFloat(metric.value))}
                        {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
                      </p>
                      <p className="text-sm text-green-500 mt-1">{metric.change}</p>
                    </div>
                    <Leaf className="h-8 w-8 text-green-500" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {modulesSummary.map((module) => (
              <Card 
                key={module.title} 
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(module.route)}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${module.bgColor}`}>
                    <module.icon className={`h-6 w-6 ${module.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1">
                      {getTranslation(`modulesSummary.${module.title.replace(/\s+/g, '').toLowerCase()}`, language)}
                    </h4>
                    <p className="text-2xl font-semibold mb-2">
                      {language === 'ar' ? toArabicNumerals(module.stats) : module.stats}
                    </p>
                    <p className="text-sm text-gray-500">{module.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm">
                    {getTranslation('modulesSummary.viewDetails', language)} →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
