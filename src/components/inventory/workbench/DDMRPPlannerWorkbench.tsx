import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, TrendingUp, Shield, Package, PlayCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageLoading from "@/components/PageLoading";
import { useNavigate } from "react-router-dom";

interface BufferStatusSummary {
  red_count: number;
  yellow_count: number;
  green_count: number;
  blue_count: number;
  total_count: number;
}

interface TopUrgentItem {
  product_id: string;
  location_id: string;
  sku: string;
  product_name: string;
  nfp: number;
  tor: number;
  buffer_penetration_pct: number;
  execution_priority: string;
}

export function DDMRPPlannerWorkbench() {
  const navigate = useNavigate();

  const { data: statusSummary, isLoading: statusLoading } = useQuery({
    queryKey: ["buffer-status-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buffer_status_summary" as any)
        .select("*")
        .single();

      if (error) throw error;
      return data as unknown as BufferStatusSummary;
    },
    refetchInterval: 30000,
  });

  const { data: topUrgent, isLoading: urgentLoading } = useQuery({
    queryKey: ["top-urgent-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("execution_priority_view" as any)
        .select("product_id, location_id, sku, product_name, nfp, tor, buffer_penetration_pct, execution_priority")
        .in("execution_priority", ["CRITICAL", "HIGH"])
        .order("buffer_penetration_pct", { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as unknown as TopUrgentItem[];
    },
    refetchInterval: 30000,
  });

  if (statusLoading || urgentLoading) return <PageLoading />;

  const handleRecalculateBuffers = async () => {
    try {
      await supabase.functions.invoke('recalculate-buffers-batch', {
        body: { batch_size: 100 }
      });
    } catch (error) {
      console.error("Buffer recalculation error:", error);
    }
  };

  const handleGenerateOrders = () => {
    navigate("/inventory?view=execution");
  };

  return (
    <div className="space-y-6">
      {/* Buffer Status Signal Board */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            DDMRP Buffer Status Overview
          </CardTitle>
          <CardDescription>Real-time buffer penetration across all items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* RED Zone */}
            <Card className="border-red-500 bg-red-50 dark:bg-red-950">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">RED Zone</p>
                    <p className="text-3xl font-bold text-red-600">{statusSummary?.red_count || 0}</p>
                    <p className="text-xs text-red-600 dark:text-red-400">Action Required!</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            {/* YELLOW Zone */}
            <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">YELLOW Zone</p>
                    <p className="text-3xl font-bold text-yellow-600">{statusSummary?.yellow_count || 0}</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">Monitor Closely</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            {/* GREEN Zone */}
            <Card className="border-green-500 bg-green-50 dark:bg-green-950">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">GREEN Zone</p>
                    <p className="text-3xl font-bold text-green-600">{statusSummary?.green_count || 0}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Healthy Stock</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            {/* BLUE Zone (Excess) */}
            <Card className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">BLUE Zone</p>
                    <p className="text-3xl font-bold text-blue-600">{statusSummary?.blue_count || 0}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Excess Stock</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Total Items */}
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Total Buffered Items: <span className="font-semibold">{statusSummary?.total_count || 0}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Urgent Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Top 5 Urgent Items
          </CardTitle>
          <CardDescription>Highest priority items requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          {topUrgent && topUrgent.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">NFP</TableHead>
                  <TableHead className="text-right">TOR</TableHead>
                  <TableHead className="text-right">Penetration %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUrgent.map((item, idx) => (
                  <TableRow key={`${item.product_id}-${item.location_id}`}>
                    <TableCell>
                      <Badge variant={item.execution_priority === "CRITICAL" ? "destructive" : "default"}>
                        {item.execution_priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.product_name}</TableCell>
                    <TableCell>{item.location_id}</TableCell>
                    <TableCell className="text-right font-semibold">{item.nfp?.toFixed(0)}</TableCell>
                    <TableCell className="text-right">{item.tor?.toFixed(0)}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-red-600">{item.buffer_penetration_pct?.toFixed(1)}%</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">No urgent items detected</p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleRecalculateBuffers}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Recalculate Buffers
            </CardTitle>
            <CardDescription>
              Update buffer zones based on latest demand patterns and adjustment factors
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleGenerateOrders}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-primary" />
              View Execution Priority
            </CardTitle>
            <CardDescription>
              Access full execution priority queue and create replenishment orders
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
