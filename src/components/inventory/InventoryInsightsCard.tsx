import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
  Legend
} from "recharts";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useThresholdConfig } from "@/hooks/useThresholdConfig";
import { useInventoryData } from "@/hooks/useInventoryData";
import { InventoryItem } from "@/types/inventory";
import { ArrowUpCircle, ArrowDownCircle, AlertTriangle, Info } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export const InventoryInsightsCard = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("buffer");
  const { config, loading: configLoading } = useThresholdConfig();
  const { items, loading: itemsLoading } = useInventoryData();
  
  const [bufferDistribution, setBufferDistribution] = useState<any[]>([]);
  const [serviceDistribution, setServiceDistribution] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [isLoadingPerformance, setIsLoadingPerformance] = useState(true);
  
  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setIsLoadingPerformance(true);
        const { data, error } = await supabase
          .from('performance_tracking')
          .select('*')
          .order('period_month', { ascending: false })
          .limit(6);
          
        if (error) throw error;
        
        setPerformanceData(data || []);
      } catch (err) {
        console.error("Error fetching performance data:", err);
      } finally {
        setIsLoadingPerformance(false);
      }
    };
    
    fetchPerformanceData();
  }, []);
  
  useEffect(() => {
    if (itemsLoading || !items) return;
    
    const bufferGroups = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      unknown: 0
    };
    
    const serviceGroups = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      unknown: 0
    };
    
    items.forEach((item: InventoryItem) => {
      if (item.bufferPenetration) {
        if (item.bufferPenetration > 90) bufferGroups.critical++;
        else if (item.bufferPenetration > 70) bufferGroups.high++;
        else if (item.bufferPenetration > 40) bufferGroups.medium++;
        else if (item.bufferPenetration >= 0) bufferGroups.low++;
        else bufferGroups.unknown++;
      } else {
        bufferGroups.unknown++;
      }
      
      if (item.serviceLevel) {
        if (item.serviceLevel > 98) serviceGroups.excellent++;
        else if (item.serviceLevel > 95) serviceGroups.good++;
        else if (item.serviceLevel > 90) serviceGroups.fair++;
        else if (item.serviceLevel >= 0) serviceGroups.poor++;
        else serviceGroups.unknown++;
      } else {
        serviceGroups.unknown++;
      }
    });
    
    setBufferDistribution([
      { name: 'Critical', value: bufferGroups.critical, color: '#ef4444' },
      { name: 'High', value: bufferGroups.high, color: '#f97316' },
      { name: 'Medium', value: bufferGroups.medium, color: '#facc15' },
      { name: 'Low', value: bufferGroups.low, color: '#22c55e' }
    ]);
    
    setServiceDistribution([
      { name: 'Excellent', value: serviceGroups.excellent, color: '#22c55e' },
      { name: 'Good', value: serviceGroups.good, color: '#84cc16' },
      { name: 'Fair', value: serviceGroups.fair, color: '#facc15' },
      { name: 'Poor', value: serviceGroups.poor, color: '#ef4444' }
    ]);
    
  }, [items, itemsLoading]);
  
  const getDynamicRecommendations = () => {
    if (!items || items.length === 0) return [];
    
    const recommendations = [];
    
    const criticalItems = items.filter(item => 
      item.bufferPenetration && item.bufferPenetration > 80
    );
    
    if (criticalItems.length > 0) {
      recommendations.push({
        type: "critical",
        message: `${criticalItems.length} items have critical buffer penetration and need urgent replenishment.`,
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />
      });
    }
    
    const lowServiceLevelLocations = performanceData.filter(item => 
      item.service_level && item.service_level < 90
    );
    
    if (lowServiceLevelLocations.length > 0) {
      recommendations.push({
        type: "warning",
        message: `${lowServiceLevelLocations.length} locations have service levels below target. Consider buffer adjustments.`,
        icon: <ArrowUpCircle className="h-5 w-5 text-amber-500" />
      });
    }
    
    if (config && config.first_time_adjusted) {
      recommendations.push({
        type: "info",
        message: `Bayesian threshold values updated. Variability threshold: ${config.demand_variability_threshold.toFixed(2)}, Decoupling threshold: ${config.decoupling_threshold.toFixed(2)}`,
        icon: <Info className="h-5 w-5 text-blue-500" />
      });
    } else if (config) {
      recommendations.push({
        type: "info",
        message: `Using default threshold values. Variability: ${config.demand_variability_threshold.toFixed(2)}, Decoupling: ${config.decoupling_threshold.toFixed(2)}. Run Bayesian updating to optimize.`,
        icon: <Info className="h-5 w-5 text-blue-500" />
      });
    }
    
    return recommendations;
  };
  
  const recommendations = getDynamicRecommendations();
  
  const chartColors = {
    green: theme === 'dark' ? '#4ade80' : '#22c55e',
    yellow: theme === 'dark' ? '#facc15' : '#eab308',
    red: theme === 'dark' ? '#f87171' : '#ef4444',
    blue: theme === 'dark' ? '#60a5fa' : '#3b82f6',
    gray: theme === 'dark' ? '#9ca3af' : '#6b7280'
  };
  
  const getPerformanceData = () => {
    if (!performanceData || performanceData.length === 0) return [];
    
    return performanceData.map(item => ({
      month: new Date(item.period_month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      serviceLevel: item.service_level,
      stockouts: item.stockout_count,
      overstocks: item.overstock_count
    })).reverse();
  };
  
  const monteCarloData = [
    { name: 'P10', sku1: 120, sku2: 180, sku3: 220 },
    { name: 'P25', sku1: 150, sku2: 200, sku3: 250 },
    { name: 'P50', sku1: 180, sku2: 230, sku3: 290 },
    { name: 'P75', sku1: 210, sku2: 260, sku3: 340 },
    { name: 'P90', sku1: 250, sku2: 300, sku3: 410 },
  ];
  
  if (itemsLoading || configLoading || isLoadingPerformance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inventory Insights</CardTitle>
          <CardDescription>Loading inventory analytics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <Progress value={80} className="w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Inventory Insights</span>
          <Badge variant="outline" className="ml-2 font-mono text-xs">
            Phase 7 Complete
          </Badge>
        </CardTitle>
        <CardDescription>
          Analysis based on 7-phase inventory model and Bayesian threshold learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length > 0 && (
          <div className="mb-6 space-y-3">
            {recommendations.map((rec, idx) => (
              <Alert key={idx} variant={rec.type === "critical" ? "destructive" : "default"} className="py-2">
                <div className="flex items-center">
                  {rec.icon}
                  <AlertDescription className="ml-2">{rec.message}</AlertDescription>
                </div>
              </Alert>
            ))}
          </div>
        )}
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="buffer">Buffer Analysis</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="thresholds">Bayesian Thresholds</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buffer" className="pt-4">
            <h3 className="text-sm font-medium mb-3">Buffer Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bufferDistribution}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    name="Items" 
                    fill={chartColors.blue}
                    barSize={40}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="pt-4">
            <h3 className="text-sm font-medium mb-3">Service Level Performance</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getPerformanceData()}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="serviceLevel" 
                    name="Service Level %" 
                    stroke={chartColors.green} 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stockouts" 
                    name="Stockouts" 
                    stroke={chartColors.red} 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="overstocks" 
                    name="Overstocks" 
                    stroke={chartColors.yellow} 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="thresholds" className="pt-4">
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                <h3 className="text-sm font-medium">Demand Variability Threshold</h3>
                <div className="flex items-center">
                  <Progress 
                    value={config?.demand_variability_threshold ? config.demand_variability_threshold * 100 : 60} 
                    className="h-2.5 flex-1" 
                  />
                  <span className="ml-2 text-sm tabular-nums">
                    {config?.demand_variability_threshold?.toFixed(2) || 0.60}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1">
                <h3 className="text-sm font-medium">Decoupling Point Threshold</h3>
                <div className="flex items-center">
                  <Progress 
                    value={config?.decoupling_threshold ? config.decoupling_threshold * 100 : 75} 
                    className="h-2.5 flex-1" 
                  />
                  <span className="ml-2 text-sm tabular-nums">
                    {config?.decoupling_threshold?.toFixed(2) || 0.75}
                  </span>
                </div>
              </div>
              
              <div className="bg-muted/50 p-3 rounded-md mt-4">
                <h4 className="text-xs font-medium mb-1">Bayesian Learning Status</h4>
                <p className="text-xs text-muted-foreground">
                  {config?.first_time_adjusted 
                    ? "Thresholds have been optimized based on historical data using Bayesian methods." 
                    : "Thresholds are using default values. Run Bayesian optimization to improve."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
