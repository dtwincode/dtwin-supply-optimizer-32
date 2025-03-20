
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, ArrowDown, ArrowUp, BadgeCheck, BarChart3, Check, Clock, HeartPulse, LineChart as LineChartIcon, RefreshCw, ShieldAlert, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toArabicNumerals } from "@/translations";

// KPI data
const kpiData = [
  {
    title: 'executiveSummary.kpis.orderFulfillment',
    value: 92.7,
    change: 3.5,
    trend: 'up',
    icon: Check,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'executiveSummary.kpis.inventoryTurnover',
    value: 4.8,
    change: 0.3,
    trend: 'up',
    icon: RefreshCw,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'executiveSummary.kpis.stockoutRate',
    value: 3.2,
    change: -1.8,
    trend: 'down',
    icon: ShieldAlert,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'executiveSummary.kpis.planningCycleTime',
    value: 5.4,
    change: -0.9,
    trend: 'down',
    icon: Clock,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
  }
];

// Performance overview data
const performanceData = [
  { name: 'Jan', actual: 82, target: 80 },
  { name: 'Feb', actual: 84, target: 82 },
  { name: 'Mar', actual: 86, target: 84 },
  { name: 'Apr', actual: 83, target: 86 },
  { name: 'May', actual: 88, target: 88 },
  { name: 'Jun', actual: 90, target: 90 },
  { name: 'Jul', actual: 92, target: 92 },
];

// Buffer distribution data
const bufferData = [
  { name: 'Green', value: 65, color: '#10B981' },
  { name: 'Yellow', value: 25, color: '#F59E0B' },
  { name: 'Red', value: 10, color: '#EF4444' },
];

// Critical alerts
const criticalAlerts = [
  { 
    id: 'alert1', 
    title: 'executiveSummary.alerts.lowBuffer', 
    description: 'executiveSummary.alerts.lowBufferDesc',
    impact: 'high',
    module: 'inventory'
  },
  { 
    id: 'alert2', 
    title: 'executiveSummary.alerts.demandSpike', 
    description: 'executiveSummary.alerts.demandSpikeDesc',
    impact: 'medium',
    module: 'forecasting'
  }
];

const ExecutiveSummary = () => {
  const { language, isRTL } = useLanguage();
  
  const formatNumber = (num: number): string => {
    return language === 'ar' ? toArabicNumerals(num) : num.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-xl font-semibold flex items-center">
          <BadgeCheck className="mr-2 h-5 w-5 text-primary" />
          {getTranslation('executiveSummary.title', language) || "Executive Summary"}
        </h3>
        <span className="text-sm text-muted-foreground">
          {getTranslation('executiveSummary.lastUpdated', language) || "Last updated:"} {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {getTranslation(kpi.title, language) || kpi.title}
                  </p>
                  <div className="text-2xl font-semibold mt-1">
                    {formatNumber(kpi.value)}%
                  </div>
                  <div className={`flex items-center text-sm mt-1 ${
                    (kpi.title.includes('stockoutRate') || kpi.title.includes('cycleTime')) 
                      ? kpi.trend === 'down' ? 'text-green-500' : 'text-red-500'
                      : kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {kpi.trend === 'up' ? 
                      <ArrowUp className="h-4 w-4 mr-1" /> : 
                      <ArrowDown className="h-4 w-4 mr-1" />
                    }
                    <span>{formatNumber(Math.abs(kpi.change))}%</span>
                  </div>
                </div>
                <div className={`${kpi.bgColor} p-3 rounded-full`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>
              {getTranslation('executiveSummary.performanceTrend', language) || "Supply Chain Performance"}
            </CardTitle>
            <CardDescription>
              {getTranslation('executiveSummary.performanceTrendDesc', language) || "Actual vs Target performance over time"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name={getTranslation('executiveSummary.charts.actual', language) || "Actual"} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#9ca3af" 
                    strokeDasharray="5 5"
                    name={getTranslation('executiveSummary.charts.target', language) || "Target"} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Buffer Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              {getTranslation('executiveSummary.bufferDistribution', language) || "Buffer Distribution"}
            </CardTitle>
            <CardDescription>
              {getTranslation('executiveSummary.bufferDistributionDesc', language) || "Current buffer status across all SKUs"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bufferData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {bufferData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-4">
                {bufferData.map((entry) => (
                  <div key={entry.name} className="flex items-center">
                    <div className="w-3 h-3 mr-1 rounded-full" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm">
                      {getTranslation(`common.zones.${entry.name.toLowerCase()}`, language) || entry.name}: {formatNumber(entry.value)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <div className="space-y-4">
        <h4 className="font-semibold flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-danger-500" />
          {getTranslation('executiveSummary.criticalAlerts', language) || "Critical Alerts"}
        </h4>
        
        {criticalAlerts.length > 0 ? (
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <Alert key={alert.id} variant="destructive" className="border-l-4 border-l-danger-400">
                <AlertTitle className="font-semibold flex items-center">
                  {getTranslation(alert.title, language) || alert.title}
                  <span className={cn(
                    "ml-2 px-2 py-0.5 rounded text-xs font-medium",
                    alert.impact === 'high' ? 'bg-red-100 text-red-700' : 
                    alert.impact === 'medium' ? 'bg-amber-100 text-amber-700' : 
                    'bg-blue-100 text-blue-700'
                  )}>
                    {getTranslation(`executiveSummary.impact.${alert.impact}`, language) || alert.impact}
                  </span>
                </AlertTitle>
                <AlertDescription>
                  {getTranslation(alert.description, language) || alert.description}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              {getTranslation('executiveSummary.noAlerts', language) || "No critical alerts at this time"}
            </p>
          </div>
        )}
      </div>

      {/* Module Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HeartPulse className="mr-2 h-5 w-5 text-success-500" />
            {getTranslation('executiveSummary.moduleHealth', language) || "Module Health"}
          </CardTitle>
          <CardDescription>
            {getTranslation('executiveSummary.moduleHealthDesc', language) || "Current status of all system modules"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-green-50 rounded-md">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="flex-1">{getTranslation('navigationItems.inventory', language)}</span>
              <span className="text-sm text-green-600">{getTranslation('executiveSummary.status.healthy', language) || "Healthy"}</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-md">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="flex-1">{getTranslation('navigationItems.supplyPlanning', language)}</span>
              <span className="text-sm text-green-600">{getTranslation('executiveSummary.status.healthy', language) || "Healthy"}</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-md">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="flex-1">{getTranslation('navigationItems.salesPlanning', language)}</span>
              <span className="text-sm text-green-600">{getTranslation('executiveSummary.status.healthy', language) || "Healthy"}</span>
            </div>
            <div className="flex items-center p-3 bg-amber-50 rounded-md">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
              <span className="flex-1">{getTranslation('navigationItems.forecasting', language)}</span>
              <span className="text-sm text-amber-600">{getTranslation('executiveSummary.status.warning', language) || "Warning"}</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-md">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="flex-1">{getTranslation('navigationItems.ddsop', language)}</span>
              <span className="text-sm text-green-600">{getTranslation('executiveSummary.status.healthy', language) || "Healthy"}</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-md">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="flex-1">{getTranslation('navigationItems.logistics', language)}</span>
              <span className="text-sm text-green-600">{getTranslation('executiveSummary.status.healthy', language) || "Healthy"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutiveSummary;
