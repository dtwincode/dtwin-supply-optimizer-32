
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";
import { RefreshCw } from "lucide-react";

interface BufferAnalysisTabProps {
  data: InventoryPlanningItem[];
  loading: boolean;
}

export function BufferAnalysisTab({ data, loading }: BufferAnalysisTabProps) {
  // Prepare data for Lead Time vs Safety Stock chart
  const leadTimeVsSafetyStock = useMemo(() => {
    return data.map(item => ({
      productId: item.product_id,
      leadTimeDays: item.lead_time_days,
      safetyStock: item.safety_stock,
      averageDailyUsage: item.average_daily_usage
    }));
  }, [data]);

  // Prepare data for buffer profile distribution chart
  const bufferProfileDistribution = useMemo(() => {
    const profiles: Record<string, number> = {};
    
    data.forEach(item => {
      const profile = item.buffer_profile_id || 'Unknown';
      profiles[profile] = (profiles[profile] || 0) + 1;
    });
    
    return Object.entries(profiles).map(([name, value]) => ({ name, value }));
  }, [data]);

  // Prepare data for min/max/safety stock by product chart
  const stockLevelsByProduct = useMemo(() => {
    return data.slice(0, 10).map(item => ({
      name: item.product_id,
      safetyStock: item.safety_stock,
      minStock: item.min_stock_level,
      maxStock: item.max_stock_level
    }));
  }, [data]);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-muted-foreground">
        No planning data found with the current filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Min, Max, and Safety Stock Levels (Top 10 Products)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stockLevelsByProduct}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="safetyStock" name="Safety Stock" fill="#FF8042" />
                <Bar dataKey="minStock" name="Min Stock" fill="#FFBB28" />
                <Bar dataKey="maxStock" name="Max Stock" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lead Time vs Safety Stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={leadTimeVsSafetyStock}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
              >
                <XAxis dataKey="leadTimeDays" angle={0} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="safetyStock" name="Safety Stock" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buffer Profile Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bufferProfileDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bufferProfileDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
