
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  RefreshCw,
  Filter,
  AlertTriangle,
  Info,
  LineChart,
  ArrowRight,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define an interface for ADU data
interface ADUData {
  id: string;
  product_id: string;
  location_id: string;
  average_daily_usage: number;
  period_start: string;
  period_end: string;
  trend_percentage: number;
  created_at: string;
}

export function ADUTab() {
  const { toast } = useToast();
  const [aduData, setAduData] = useState<ADUData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [trendData, setTrendData] = useState<any[]>([]);
  
  useEffect(() => {
    fetchADUData();
  }, []);
  
  const fetchADUData = async () => {
    try {
      setLoading(true);
      
      // In a real app, we'd have a table for this
      // Here, we'll check if our table exists, and if not, create sample data
      const { count } = await supabase
        .from('inventory_data')
        .select('*', { count: 'exact', head: true });
      
      if (count === 0) {
        // Generate sample inventory data
        await generateSampleData();
      }
      
      // Fetch inventory data
      const { data, error } = await supabase
        .from('inventory_data')
        .select('*');
        
      if (error) throw error;
      
      // Transform inventory data to include ADU information
      const transformedData: ADUData[] = (data || []).map(item => {
        const randomADU = Math.floor(Math.random() * 50) + 1;
        const randomTrend = (Math.random() * 20) - 10; // -10% to +10%
        
        // Calculate date range for last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        
        return {
          id: item.inventory_id,
          product_id: item.product_id,
          location_id: item.location_id,
          average_daily_usage: randomADU,
          period_start: startDate.toISOString(),
          period_end: endDate.toISOString(),
          trend_percentage: parseFloat(randomTrend.toFixed(2)),
          created_at: new Date().toISOString()
        };
      });
      
      setAduData(transformedData);
      
      // Generate trend data for chart
      generateTrendData(transformedData);
      
    } catch (error) {
      console.error("Error fetching ADU data:", error);
      toast({
        title: "Error",
        description: "Failed to load ADU data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const generateTrendData = (data: ADUData[]) => {
    // Take 5 random products
    const sampleProducts = data.slice(0, 5);
    
    // Generate daily data for the last 30 days
    const trendData = [];
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      
      const dataPoint: any = {
        date: date.toISOString().split('T')[0]
      };
      
      // Add ADU for each product with some random variation
      sampleProducts.forEach(product => {
        const baseADU = product.average_daily_usage;
        const variation = (Math.random() * 0.4) - 0.2; // -20% to +20%
        
        dataPoint[product.product_id] = Math.max(1, Math.round(baseADU * (1 + variation)));
      });
      
      trendData.push(dataPoint);
    }
    
    setTrendData(trendData);
  };
  
  const generateSampleData = async () => {
    try {
      // First check if we have locations
      const { count: locationCount } = await supabase
        .from('location_master')
        .select('*', { count: 'exact', head: true });
      
      if (locationCount === 0) {
        // Create sample locations
        const locationData = [
          { location_id: 'L001', warehouse: 'Main Warehouse', city: 'Chicago', region: 'Midwest' },
          { location_id: 'L002', warehouse: 'Distribution Center', city: 'Dallas', region: 'South' },
          { location_id: 'L003', warehouse: 'Retail Store', city: 'New York', region: 'East' }
        ];
        
        await supabase.from('location_master').insert(locationData);
      }
      
      // Check if we have inventory data
      const { count: inventoryCount } = await supabase
        .from('inventory_data')
        .select('*', { count: 'exact', head: true });
      
      if (inventoryCount === 0) {
        // Create sample inventory data
        const inventoryData = [];
        
        for (let i = 1; i <= 10; i++) {
          inventoryData.push({
            product_id: `P00${i}`,
            location_id: `L00${(i % 3) + 1}`,
            quantity_on_hand: Math.floor(Math.random() * 500) + 50,
            reserved_qty: Math.floor(Math.random() * 20),
            decoupling_point: i % 5 === 0 // Every 5th item is a decoupling point
          });
        }
        
        await supabase.from('inventory_data').insert(inventoryData);
        
        toast({
          title: "Sample data generated",
          description: "Sample inventory data created with ADU information"
        });
      }
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast({
        title: "Error",
        description: "Failed to generate sample data",
        variant: "destructive"
      });
    }
  };
  
  const getTrendBadge = (trend: number) => {
    if (trend > 5) return <Badge className="bg-green-100 text-green-800">Increasing</Badge>;
    if (trend < -5) return <Badge className="bg-red-100 text-red-800">Decreasing</Badge>;
    return <Badge className="bg-blue-100 text-blue-800">Stable</Badge>;
  };
  
  const getTrendIcon = (trend: number) => {
    if (trend > 5) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < -5) return <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />;
    return <ArrowRight className="h-4 w-4 text-blue-500" />;
  };
  
  const getFilteredData = () => {
    return aduData.filter(item => 
      item.product_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  const refreshData = () => {
    fetchADUData();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>ADU Analysis</CardTitle>
              <CardDescription>
                Average Daily Usage (ADU) analysis and trends
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="px-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 space-y-4">
              <TabsList>
                <TabsTrigger value="current">Current ADU</TabsTrigger>
                <TabsTrigger value="trends">ADU Trends</TabsTrigger>
                <TabsTrigger value="forecast">ADU Forecast</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <Input 
                  placeholder="Search by product ID or location" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>
            
            <TabsContent value="current">
              {loading ? (
                <div className="flex justify-center items-center py-10">
                  <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : getFilteredData().length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No ADU data found</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    No ADU data matching your filter criteria.
                  </p>
                  <Button onClick={() => setSearchQuery("")}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto px-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">ADU</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getFilteredData().map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product_id}</TableCell>
                          <TableCell>{item.location_id}</TableCell>
                          <TableCell className="text-right">{item.average_daily_usage}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span className="text-xs">
                                {new Date(item.period_start).toLocaleDateString()} - {new Date(item.period_end).toLocaleDateString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(item.trend_percentage)}
                              <span>{item.trend_percentage}%</span>
                              {getTrendBadge(item.trend_percentage)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trends">
              <div className="px-6">
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <LineChart className="h-5 w-5 mr-2 text-primary" />
                      ADU Trends (Last 30 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center items-center h-80">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReLineChart
                            data={trendData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {trendData.length > 0 && 
                              Object.keys(trendData[0])
                                .filter(key => key !== 'date')
                                .map((key, index) => {
                                  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
                                  return (
                                    <Line
                                      key={key}
                                      type="monotone"
                                      dataKey={key}
                                      stroke={colors[index % colors.length]}
                                      activeDot={{ r: 8 }}
                                      name={`Product ${key}`}
                                    />
                                  );
                                })
                            }
                          </ReLineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                  {trendData.length > 0 && 
                    Object.keys(trendData[0])
                      .filter(key => key !== 'date')
                      .map((key, index) => {
                        // Calculate average ADU for this product
                        const avgADU = trendData.reduce((sum, point) => sum + (point[key] || 0), 0) / trendData.length;
                        
                        // Calculate trend (compare first week to last week)
                        const firstWeek = trendData.slice(0, 7).reduce((sum, point) => sum + (point[key] || 0), 0) / 7;
                        const lastWeek = trendData.slice(-7).reduce((sum, point) => sum + (point[key] || 0), 0) / 7;
                        const trend = ((lastWeek - firstWeek) / firstWeek) * 100;
                        
                        return (
                          <Card key={key}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Product {key}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Average ADU:</span>
                                  <span className="font-medium">{avgADU.toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">30-Day Trend:</span>
                                  <div className="flex items-center gap-1">
                                    {getTrendIcon(trend)}
                                    <span className={
                                      trend > 0 ? 'text-green-600' : 
                                      trend < 0 ? 'text-red-600' : 'text-blue-600'
                                    }>
                                      {trend.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Status:</span>
                                  {getTrendBadge(trend)}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                  }
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="forecast">
              <div className="px-6">
                <Card className="border-dashed">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <Info className="h-10 w-10 text-primary mb-4" />
                      <h3 className="text-lg font-medium mb-2">ADU Forecasting</h3>
                      <p className="text-muted-foreground max-w-md mb-4">
                        ADU forecasting allows you to predict future usage patterns based on historical data and seasonal trends.
                      </p>
                      <Button>
                        Run ADU Forecast
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
