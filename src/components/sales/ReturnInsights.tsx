
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { ProductReturn } from "@/types/sales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, BarChart3, PieChart, Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
} from "recharts";

interface ReturnInsightsProps {
  returns: ProductReturn[];
}

export const ReturnInsights = ({ returns }: ReturnInsightsProps) => {
  const { language } = useLanguage();
  
  // Prepare data for charts
  const returnByCondition = [
    { name: "New", value: returns.filter(r => r.condition === "new").length, color: "#10b981" },
    { name: "Damaged", value: returns.filter(r => r.condition === "damaged").length, color: "#f59e0b" },
    { name: "Expired", value: returns.filter(r => r.condition === "expired").length, color: "#ef4444" },
  ];
  
  const returnByLocation = [
    { name: "Central", value: returns.filter(r => r.location.region.includes("Central")).length },
    { name: "Western", value: returns.filter(r => r.location.region.includes("Western")).length },
    { name: "Eastern", value: returns.filter(r => r.location.region.includes("Eastern")).length },
  ];
  
  // Generate dummy time series data
  const generateTimeSeriesData = () => {
    const now = new Date();
    const data: Array<{ date: string; returns: number; impact: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        returns: Math.floor(Math.random() * 5) + 1,
        impact: Math.floor(Math.random() * 10) - 5,
      });
    }
    return data;
  };
  
  const timeSeriesData = generateTimeSeriesData();
  
  // Generate reasons data
  const reasonsData = [
    { name: "Quality Issue", value: 8 },
    { name: "Wrong Order", value: 5 },
    { name: "Damaged in Transit", value: 4 },
    { name: "Customer Changed Mind", value: 3 },
    { name: "Other", value: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {getTranslation('sales.returnInsights', language) || "Return Insights"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {getTranslation('sales.trends', language) || "Trends"}
            </TabsTrigger>
            <TabsTrigger value="reasons" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              {getTranslation('sales.reasons', language) || "Reasons"}
            </TabsTrigger>
            <TabsTrigger value="impact" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {getTranslation('sales.forecastImpact', language) || "Forecast Impact"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getTranslation('sales.returnsTrend', language) || "Returns Over Time"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={timeSeriesData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="returns" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#colorReturns)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getTranslation('sales.returnsByCondition', language) || "Returns by Condition"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={returnByCondition}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                        >
                          {returnByCondition.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reasons">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getTranslation('sales.topReturnReasons', language) || "Top Return Reasons"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={reasonsData}
                        layout="vertical"
                        margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getTranslation('sales.returnsByRegion', language) || "Returns by Region"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={returnByLocation}
                        margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#82ca9d" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="impact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getTranslation('sales.forecastImpactOverTime', language) || "Forecast Impact Over Time"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={timeSeriesData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="impact" fill="#f87171" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getTranslation('sales.recommendedActions', language) || "Recommended Actions"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 bg-red-100 p-2 rounded-full">
                        <BarChart className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{getTranslation('sales.adjustForecast', language) || "Adjust Forecast"}</h4>
                        <p className="text-sm text-gray-500">{getTranslation('sales.adjustForecastDesc', language) || "Reduce Q2 forecast by 3.5% for electronics category due to consistent quality returns."}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 bg-yellow-100 p-2 rounded-full">
                        <PieChart className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{getTranslation('sales.reviewQuality', language) || "Review Quality"}</h4>
                        <p className="text-sm text-gray-500">{getTranslation('sales.reviewQualityDesc', language) || "Investigate increasing quality issues with smartphone product line in Central Region."}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{getTranslation('sales.reallocateInventory', language) || "Reallocate Inventory"}</h4>
                        <p className="text-sm text-gray-500">{getTranslation('sales.reallocateInventoryDesc', language) || "Redistribute new-condition returns to Western Region where demand is higher."}</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
