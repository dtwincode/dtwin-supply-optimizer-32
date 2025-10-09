import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Calendar, BarChart3 } from "lucide-react";
import { format } from "date-fns";

interface DailySalesRecord {
  product_id: string;
  location_id: string;
  sales_date: string;
  qty: number;
}

interface SalesSummary {
  product_id: string;
  location_id: string;
  total_qty: number;
  avg_daily_qty: number;
  days_with_sales: number;
  last_sale_date: string;
  trend: 'up' | 'down' | 'stable';
}

export function DailySalesAnalysis() {
  // Fetch from daily_sales_base (optimized aggregated view)
  const { data: dailySalesData, isLoading } = useQuery({
    queryKey: ["daily-sales-base"],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from("daily_sales_base" as any)
        .select("*")
        .gte("sales_date", thirtyDaysAgo.toISOString().split('T')[0])
        .order("sales_date", { ascending: false });

      if (error) throw error;
      return (data || []) as any as DailySalesRecord[];
    },
  });

  // Calculate summary metrics from daily_sales_base
  const summaryData: SalesSummary[] = dailySalesData
    ? Object.values(
        dailySalesData.reduce((acc, record) => {
          const key = `${record.product_id}-${record.location_id}`;
          
          if (!acc[key]) {
            acc[key] = {
              product_id: record.product_id,
              location_id: record.location_id,
              total_qty: 0,
              days_with_sales: 0,
              last_sale_date: record.sales_date,
              recent_sales: [] as number[],
            };
          }
          
          acc[key].total_qty += record.qty || 0;
          acc[key].days_with_sales += 1;
          
          // Track recent sales for trend calculation
          if (acc[key].recent_sales.length < 14) {
            acc[key].recent_sales.push(record.qty || 0);
          }
          
          // Update last sale date if more recent
          if (record.sales_date > acc[key].last_sale_date) {
            acc[key].last_sale_date = record.sales_date;
          }
          
          return acc;
        }, {} as any)
      )
      .map((item: any) => {
        const avg_daily_qty = item.total_qty / Math.max(item.days_with_sales, 1);
        
        // Calculate trend based on recent vs earlier sales
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (item.recent_sales.length >= 7) {
          const recentAvg = item.recent_sales.slice(0, 7).reduce((a: number, b: number) => a + b, 0) / 7;
          const earlierAvg = item.recent_sales.slice(7, 14).reduce((a: number, b: number) => a + b, 0) / 7;
          const change = ((recentAvg - earlierAvg) / earlierAvg) * 100;
          
          if (change > 10) trend = 'up';
          else if (change < -10) trend = 'down';
        }
        
        return {
          product_id: item.product_id,
          location_id: item.location_id,
          total_qty: item.total_qty,
          avg_daily_qty: Math.round(avg_daily_qty * 100) / 100,
          days_with_sales: item.days_with_sales,
          last_sale_date: item.last_sale_date,
          trend,
        };
      })
      .sort((a, b) => b.total_qty - a.total_qty)
      .slice(0, 50)
    : [];

  const totalSales = summaryData.reduce((sum, item) => sum + item.total_qty, 0);
  const avgDailySales = summaryData.length > 0
    ? Math.round((totalSales / summaryData.reduce((sum, item) => sum + item.days_with_sales, 0)) * 100) / 100
    : 0;
  const productsWithUptrend = summaryData.filter(item => item.trend === 'up').length;
  const productsWithDowntrend = summaryData.filter(item => item.trend === 'down').length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTrendBadge = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') {
      return (
        <Badge variant="default" className="gap-1 bg-green-500/10 text-green-700 border-green-500/20">
          <TrendingUp className="h-3 w-3" />
          Up
        </Badge>
      );
    } else if (trend === 'down') {
      return (
        <Badge variant="default" className="gap-1 bg-red-500/10 text-red-700 border-red-500/20">
          <TrendingDown className="h-3 w-3" />
          Down
        </Badge>
      );
    }
    return <Badge variant="outline">Stable</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales (30d)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">units across all products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Sales</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDailySales}</div>
            <p className="text-xs text-muted-foreground">units per day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptrending</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{productsWithUptrend}</div>
            <p className="text-xs text-muted-foreground">products increasing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downtrending</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{productsWithDowntrend}</div>
            <p className="text-xs text-muted-foreground">products decreasing</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Sales Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Sales Analysis (Last 30 Days)</CardTitle>
          <CardDescription>
            Aggregated from daily_sales_base view - showing top 50 product-location pairs by volume
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Location ID</TableHead>
                <TableHead className="text-right">Total Qty</TableHead>
                <TableHead className="text-right">Avg Daily</TableHead>
                <TableHead className="text-center">Days Active</TableHead>
                <TableHead>Last Sale</TableHead>
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaryData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No sales data found for the last 30 days
                  </TableCell>
                </TableRow>
              ) : (
                summaryData.map((item, idx) => (
                  <TableRow key={`${item.product_id}-${item.location_id}-${idx}`}>
                    <TableCell className="font-mono text-sm">{item.product_id}</TableCell>
                    <TableCell className="font-mono text-sm">{item.location_id}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.total_qty.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.avg_daily_qty.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{item.days_with_sales} days</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.last_sale_date), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendBadge(item.trend)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
