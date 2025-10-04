import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'sonner';
import { useInventoryFilter } from '../InventoryFilterContext';
import { TrendingUp, Package, AlertTriangle } from 'lucide-react';

interface ComponentData {
  component_product_id: string;
  component_sku: string;
  component_name: string;
  component_category: string;
  location_id: string;
  component_adu: number;
  num_finished_goods_using: number;
  used_in_finished_goods: string[];
  demand_cv: number;
  high_variability: boolean;
}

export function ComponentDemandChart() {
  const { filters } = useInventoryFilter();
  const [topComponents, setTopComponents] = useState<ComponentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, [filters]);

  const loadChartData = async () => {
    try {
      setIsLoading(true);

      let query = supabase
        .from('component_demand_view')
        .select('*');

      if (filters.locationId) {
        query = query.eq('location_id', filters.locationId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Aggregate by component across all locations
      const aggregated = new Map<string, ComponentData>();
      
      (data || []).forEach((row: any) => {
        const key = row.component_product_id;
        
        if (!aggregated.has(key)) {
          aggregated.set(key, {
            component_product_id: row.component_product_id,
            component_sku: row.component_sku,
            component_name: row.component_name,
            component_category: row.component_category,
            location_id: 'ALL', // Aggregated across locations
            component_adu: 0,
            num_finished_goods_using: row.num_finished_goods_using,
            used_in_finished_goods: row.used_in_finished_goods || [],
            demand_cv: 0,
            high_variability: false
          });
        }
        
        const existing = aggregated.get(key)!;
        existing.component_adu += Number(row.component_adu || 0);
        
        // Average the CV across locations
        existing.demand_cv = ((existing.demand_cv + (row.demand_cv || 0)) / 2);
        existing.high_variability = existing.high_variability || row.high_variability;
      });

      // Convert to array and sort by ADU
      const aggregatedArray = Array.from(aggregated.values())
        .sort((a, b) => b.component_adu - a.component_adu)
        .slice(0, 10);

      setTopComponents(aggregatedArray);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading chart data:', error);
      toast.error('Failed to load chart data');
      setIsLoading(false);
    }
  };

  const getBarColor = (cv: number | null) => {
    if (!cv) return 'hsl(var(--primary))';
    if (cv > 0.5) return 'hsl(0, 70%, 50%)'; // Red
    if (cv > 0.3) return 'hsl(45, 90%, 50%)'; // Yellow
    return 'hsl(142, 70%, 45%)'; // Green
  };

  const aduChartData = topComponents.map(c => ({
    name: c.component_sku || c.component_name?.substring(0, 15),
    adu: Number(c.component_adu.toFixed(2)),
    cv: c.demand_cv,
    fullName: c.component_name
  }));

  const finishedGoodsChartData = topComponents.map(c => ({
    name: c.component_sku || c.component_name?.substring(0, 15),
    count: c.num_finished_goods_using,
    fullName: c.component_name
  }));

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Component Demand Analytics
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Top 10 components by Average Daily Usage (ADU)
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="adu" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="adu">
              <Package className="h-4 w-4 mr-2" />
              ADU by Component
            </TabsTrigger>
            <TabsTrigger value="complexity">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Finished Goods Usage
            </TabsTrigger>
            <TabsTrigger value="variability">
              <TrendingUp className="h-4 w-4 mr-2" />
              Variability Analysis
            </TabsTrigger>
          </TabsList>

          {/* ADU Bar Chart */}
          <TabsContent value="adu" className="space-y-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={aduChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: 'Average Daily Usage', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{payload[0].payload.fullName}</p>
                          <p className="text-sm text-muted-foreground">SKU: {payload[0].payload.name}</p>
                          <p className="text-lg font-bold text-primary mt-1">
                            ADU: {payload[0].value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            CV: {payload[0].payload.cv?.toFixed(3) || 'N/A'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="adu" radius={[8, 8, 0, 0]}>
                  {aduChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.cv)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(142, 70%, 45%)' }} />
                <span>Low Variability (CV ≤ 0.3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(45, 90%, 50%)' }} />
                <span>Medium Variability (0.3 &lt; CV ≤ 0.5)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(0, 70%, 50%)' }} />
                <span>High Variability (CV &gt; 0.5)</span>
              </div>
            </div>
          </TabsContent>

          {/* Finished Goods Usage Chart */}
          <TabsContent value="complexity" className="space-y-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={finishedGoodsChartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: '# of Finished Goods Using Component', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold">{payload[0].payload.fullName}</p>
                          <p className="text-sm text-muted-foreground">SKU: {payload[0].payload.name}</p>
                          <p className="text-lg font-bold text-primary mt-1">
                            Used in {payload[0].value} finished goods
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center text-sm text-muted-foreground">
              Components used in multiple finished goods may require higher safety stock
            </p>
          </TabsContent>

          {/* Variability Analysis */}
          <TabsContent value="variability" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-600">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    Low Variability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {topComponents.filter(c => c.demand_cv <= 0.3).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    CV ≤ 0.3 - Stable demand
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-yellow-600">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    Medium Variability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {topComponents.filter(c => c.demand_cv > 0.3 && c.demand_cv <= 0.5).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    0.3 &lt; CV ≤ 0.5 - Moderate variability
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-600">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    High Variability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {topComponents.filter(c => c.demand_cv > 0.5).length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    CV &gt; 0.5 - High variability risk
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Component Variability Details</h4>
              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {topComponents.map((comp, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2 bg-background rounded border"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{comp.component_name}</p>
                      <p className="text-xs text-muted-foreground">{comp.component_sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">CV: {comp.demand_cv?.toFixed(3) || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">ADU: {comp.component_adu.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
