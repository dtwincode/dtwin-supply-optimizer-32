
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AlertCircle, ArrowDown, ArrowUp, BadgeCheck, BarChart3, Check, HeartPulse } from "lucide-react";
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
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'executiveSummary.kpis.inventoryTurnover',
    value: 4.8,
    change: 0.3,
    trend: 'up',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'executiveSummary.kpis.stockoutRate',
    value: 3.2,
    change: -1.8,
    trend: 'down',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'executiveSummary.kpis.planningCycleTime',
    value: 5.4,
    change: -0.9,
    trend: 'down',
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
  },
  { 
    id: 'alert2', 
    title: 'executiveSummary.alerts.demandSpike', 
    description: 'executiveSummary.alerts.demandSpikeDesc',
    impact: 'medium',
  }
];

// Module health data
const moduleHealth = [
  { name: 'inventory', status: 'healthy' },
  { name: 'supplyPlanning', status: 'healthy' },
  { name: 'salesPlanning', status: 'healthy' },
  { name: 'forecasting', status: 'warning' },
  { name: 'ddsop', status: 'healthy' },
  { name: 'logistics', status: 'healthy' },
];

const ExecutiveSummary = () => {
  const { language } = useLanguage();
  
  const formatNumber = (num: number): string => {
    return language === 'ar' ? toArabicNumerals(num) : num.toString();
  };

  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-md font-semibold flex items-center">
          <BadgeCheck className="mr-1 h-4 w-4 text-primary" />
          {getTranslation('common.executiveSummary.title', language) || "Executive Summary"}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* KPI Cards */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-2">
            {kpiData.map((kpi) => (
              <Card key={kpi.title} className="shadow-sm p-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {getTranslation(`common.dashboardMetrics.${kpi.title.split('.').pop()}`, language) || kpi.title}
                    </p>
                    <div className="text-md font-semibold">
                      {formatNumber(kpi.value)}%
                    </div>
                    <div className={`flex items-center text-xs ${
                      (kpi.title.includes('stockoutRate') || kpi.title.includes('cycleTime')) 
                        ? kpi.trend === 'down' ? 'text-green-500' : 'text-red-500'
                        : kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {kpi.trend === 'up' ? 
                        <ArrowUp className="h-3 w-3 mr-0.5" /> : 
                        <ArrowDown className="h-3 w-3 mr-0.5" />
                      }
                      <span>{formatNumber(Math.abs(kpi.change))}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Buffer Distribution Chart */}
        <div className="md:col-span-1">
          <Card className="p-2 h-full">
            <p className="text-xs font-medium mb-1">
              {getTranslation('common.executiveSummary.bufferDistribution', language) || "Buffer Distribution"}
            </p>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bufferData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={36}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {bufferData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-x-2 mt-1 justify-center">
              {bufferData.map((entry) => (
                <div key={entry.name} className="flex items-center">
                  <div className="w-2 h-2 mr-0.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs">
                    {entry.name}: {formatNumber(entry.value)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Critical Alerts */}
        <div className="md:col-span-1">
          <Card className="p-2 h-full">
            <p className="text-xs font-medium flex items-center mb-1">
              <AlertCircle className="mr-1 h-3 w-3 text-danger-500" />
              {getTranslation('common.executiveSummary.criticalAlerts', language) || "Critical Alerts"}
            </p>
            {criticalAlerts.map((alert) => (
              <Alert key={alert.id} variant="destructive" className="py-1 px-2 mb-1 border-l-2 border-l-danger-400">
                <AlertTitle className="text-xs font-medium">
                  {getTranslation(alert.title, language) || alert.title}
                  <span className={cn(
                    "ml-1 px-1 rounded text-xs",
                    alert.impact === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  )}>
                    {getTranslation(`executiveSummary.impact.${alert.impact}`, language) || alert.impact}
                  </span>
                </AlertTitle>
                <AlertDescription className="text-xs">
                  {getTranslation(alert.description, language) || alert.description}
                </AlertDescription>
              </Alert>
            ))}
          </Card>
        </div>

        {/* Performance Trend Chart */}
        <div className="md:col-span-2">
          <Card className="p-2">
            <p className="text-xs font-medium mb-1">
              {getTranslation('common.executiveSummary.performanceTrend', language) || "Supply Chain Performance"}
            </p>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[70, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
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
                    strokeDasharray="3 3"
                    name={getTranslation('executiveSummary.charts.target', language) || "Target"} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Module Health Status */}
        <div className="md:col-span-2">
          <Card className="p-2">
            <p className="text-xs font-medium flex items-center mb-1">
              <HeartPulse className="mr-1 h-3 w-3 text-success-500" />
              {getTranslation('common.executiveSummary.moduleHealth', language) || "Module Health"}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs">
              {moduleHealth.map((module) => (
                <div key={module.name} className={`flex items-center p-1 rounded-md 
                  ${module.status === 'healthy' ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 
                    ${module.status === 'healthy' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <span className="flex-1">{getTranslation(`navigation.${module.name}`, language)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Card>
  );
};

export default ExecutiveSummary;
