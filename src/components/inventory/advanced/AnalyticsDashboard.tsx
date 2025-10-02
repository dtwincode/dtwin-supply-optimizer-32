import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';
import { useInventoryFilter } from '../InventoryFilterContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useInventoryConfig } from '@/hooks/useInventoryConfig';

export const AnalyticsDashboard: React.FC = () => {
  const { filters } = useInventoryFilter();
  const { getConfig } = useInventoryConfig();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [filters]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const rawData = await fetchInventoryPlanningView();
      
      let filtered = rawData;
      if (filters.productCategory) {
        filtered = filtered.filter(item => item.category === filters.productCategory);
      }
      if (filters.locationId) {
        filtered = filtered.filter(item => item.location_id === filters.locationId);
      }

      // Buffer status distribution
      const statusDist = [
        { name: 'Green', value: filtered.filter(i => i.buffer_status === 'GREEN').length, color: 'hsl(142 71% 45%)' },
        { name: 'Yellow', value: filtered.filter(i => i.buffer_status === 'YELLOW').length, color: 'hsl(48 96% 53%)' },
        { name: 'Red', value: filtered.filter(i => i.buffer_status === 'RED').length, color: 'hsl(0 84% 60%)' }
      ];

      // Category analysis
      const categories = [...new Set(filtered.map(i => i.category))];
      const categoryData = categories.map(cat => ({
        category: cat,
        items: filtered.filter(i => i.category === cat).length,
        avgStock: filtered.filter(i => i.category === cat).reduce((sum, i) => sum + i.on_hand, 0) / filtered.filter(i => i.category === cat).length,
        totalValue: filtered.filter(i => i.category === cat).reduce((sum, i) => sum + (i.on_hand * 100), 0)
      }));

      // Demand pattern (simulated weekly data)
      const demandPattern = Array.from({ length: 12 }, (_, i) => ({
        week: `W${i + 1}`,
        actual: Math.floor(Math.random() * 1000 + 500),
        forecast: Math.floor(Math.random() * 1000 + 500),
        accuracy: 85 + Math.random() * 10
      }));

      // Turnover analysis
      const turnoverLimit = getConfig('analytics_turnover_limit', 10);
      const turnoverData = filtered.slice(0, turnoverLimit).map(item => ({
        sku: item.sku,
        turnover: item.on_hand > 0 && item.average_daily_usage > 0 
          ? ((item.average_daily_usage * 365) / item.on_hand).toFixed(1)
          : '0',
        daysOfSupply: item.average_daily_usage > 0 
          ? (item.on_hand / item.average_daily_usage).toFixed(0)
          : '0'
      }));

      setData({
        statusDist,
        categoryData,
        demandPattern,
        turnoverData
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="h-80 bg-muted animate-pulse rounded" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Buffer Status Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Buffer Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.statusDist}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.statusDist.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Category Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.categoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="items" fill="hsl(var(--primary))" name="Item Count" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="avgStock" fill="hsl(142 71% 45%)" name="Avg Stock" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Demand Forecast Accuracy */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Demand Sensing & Forecast Accuracy</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.demandPattern}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="actual" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} name="Actual Demand" />
            <Area type="monotone" dataKey="forecast" stackId="2" stroke="hsl(142 71% 45%)" fill="hsl(142 71% 45%)" fillOpacity={0.6} name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <div className="text-2xl font-bold">{data.demandPattern[data.demandPattern.length - 1].accuracy.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground">Forecast Accuracy</div>
        </div>
      </Card>

      {/* Inventory Turnover */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top SKUs by Turnover Rate</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {data.turnoverData.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{item.sku}</div>
                <div className="text-xs text-muted-foreground">{item.daysOfSupply} days of supply</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{item.turnover}</div>
                <div className="text-xs text-muted-foreground">turns/year</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
