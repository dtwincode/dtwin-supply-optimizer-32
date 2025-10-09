import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ADUData {
  product_id: string;
  location_id: string;
  adu_adj: number;
  window_days: number;
}

interface InventoryItem {
  product_id: string;
  location_id: string;
  product_name: string;
  sku: string;
  average_daily_usage: number;
}

export const ADUAnalysis = () => {
  // Fetch pre-computed ADU from adu_90d_view
  const { data: aduData, isLoading: isLoadingADU } = useQuery({
    queryKey: ["adu-90d-view"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("adu_90d_view")
        .select("*")
        .order("adu_adj", { ascending: false })
        .limit(100);

      if (error) throw error;
      return (data || []) as ADUData[];
    },
  });

  // Fetch current inventory planning data for comparison
  const { data: inventoryData, isLoading: isLoadingInventory } = useQuery({
    queryKey: ["inventory-for-adu-comparison"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_planning_view")
        .select("product_id, location_id, product_name, sku, average_daily_usage")
        .limit(100);

      if (error) throw error;
      return (data || []) as InventoryItem[];
    },
  });

  if (isLoadingADU || isLoadingInventory) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Merge data for comparison
  const comparisonData = aduData?.map(adu => {
    const inventory = inventoryData?.find(
      inv => inv.product_id === adu.product_id && inv.location_id === adu.location_id
    );

    const difference = inventory 
      ? ((adu.adu_adj - inventory.average_daily_usage) / inventory.average_daily_usage) * 100
      : 0;

    return {
      product_id: adu.product_id,
      location_id: adu.location_id,
      product_name: inventory?.product_name || adu.product_id,
      sku: inventory?.sku || adu.product_id,
      adu_90d: adu.adu_adj,
      current_adu: inventory?.average_daily_usage || 0,
      window_days: adu.window_days,
      difference_pct: difference,
      has_discrepancy: Math.abs(difference) > 5, // >5% difference
    };
  }) || [];

  const discrepancies = comparisonData.filter(item => item.has_discrepancy);
  const avgADU = comparisonData.length > 0
    ? comparisonData.reduce((sum, item) => sum + item.adu_90d, 0) / comparisonData.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average ADU (90d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgADU.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {comparisonData.length} items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comparisonData.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              With 90-day ADU calculated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <span className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                Discrepancies
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discrepancies.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              &gt;5% difference from current ADU
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>ADU Comparison (90-Day View vs Current)</CardTitle>
          <CardDescription>
            Pre-computed ADU from adu_90d_view compared with current inventory_planning_view calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">90d ADU</TableHead>
                  <TableHead className="text-right">Current ADU</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                  <TableHead className="text-center">Window</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.slice(0, 50).map((item, idx) => (
                  <TableRow key={`${item.product_id}-${item.location_id}-${idx}`}>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {item.location_id}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.adu_90d.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.current_adu.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.difference_pct > 5 ? (
                          <>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <Badge variant="outline" className="border-green-500">
                              +{item.difference_pct.toFixed(1)}%
                            </Badge>
                          </>
                        ) : item.difference_pct < -5 ? (
                          <>
                            <TrendingDown className="h-4 w-4 text-red-500" />
                            <Badge variant="outline" className="border-red-500">
                              {item.difference_pct.toFixed(1)}%
                            </Badge>
                          </>
                        ) : (
                          <Badge variant="outline" className="border-muted">
                            {item.difference_pct.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{item.window_days}d</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
