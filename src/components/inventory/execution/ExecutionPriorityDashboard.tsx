import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowDown, ArrowUp, AlertTriangle, TrendingDown, Info } from "lucide-react";
import PageLoading from "@/components/PageLoading";

interface ExecutionPriorityItem {
  product_id: string;
  location_id: string;
  sku: string;
  product_name: string;
  category: string;
  nfp: number;
  on_hand: number;
  on_order: number;
  qualified_demand: number;
  red_zone: number;
  yellow_zone: number;
  green_zone: number;
  tor: number;
  toy: number;
  tog: number;
  buffer_penetration_pct: number;
  execution_priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  priority_color: "DEEP_RED" | "RED" | "YELLOW" | "GREEN" | "UNKNOWN";
  projected_on_hand: number;
  critical_alert: boolean;
  current_oh_alert: boolean;
  projected_oh_alert: boolean;
}

const PriorityBadge = ({ priority, color }: { priority: string; color: string }) => {
  const colorMap = {
    DEEP_RED: "bg-red-600 text-white hover:bg-red-700",
    RED: "bg-red-500 text-white hover:bg-red-600",
    YELLOW: "bg-yellow-500 text-black hover:bg-yellow-600",
    GREEN: "bg-green-500 text-white hover:bg-green-600",
    UNKNOWN: "bg-gray-500 text-white",
  };

  return (
    <Badge className={colorMap[color as keyof typeof colorMap]}>
      {priority}
    </Badge>
  );
};

const BufferPenetrationBar = ({ penetration, color }: { penetration: number; color: string }) => {
  const colorMap = {
    DEEP_RED: "bg-red-600",
    RED: "bg-red-500",
    YELLOW: "bg-yellow-500",
    GREEN: "bg-green-500",
    UNKNOWN: "bg-gray-500",
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${colorMap[color as keyof typeof colorMap]}`}
        style={{ width: `${Math.min(penetration, 100)}%` }}
      />
    </div>
  );
};

export function ExecutionPriorityDashboard() {
  // Fetch from existing inventory_planning_view
  const { data: inventoryData, isLoading } = useQuery({
    queryKey: ["inventory-planning-execution"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_planning_view")
        .select("*");

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000,
  });

  // Calculate execution priority client-side
  const priorities: ExecutionPriorityItem[] | undefined = inventoryData?.map(item => {
    const nfp = (item.nfp as number) || 0;
    const tor = (item.tor as number) || 1;
    const toy = (item.toy as number) || (tor * 1.5);
    const tog = (item.tog as number) || (tor * 2);
    const penetration = (nfp / tor) * 100;
    
    let priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN" = "LOW";
    let color: "DEEP_RED" | "RED" | "YELLOW" | "GREEN" | "UNKNOWN" = "GREEN";
    
    if (penetration < 20) {
      priority = "CRITICAL";
      color = "DEEP_RED";
    } else if (penetration < 50) {
      priority = "HIGH";
      color = "RED";
    } else if (penetration < 80) {
      priority = "MEDIUM";
      color = "YELLOW";
    }
    
    const on_hand = (item.on_hand as number) || 0;
    const qualified_demand = (item.qualified_demand as number) || 0;
    const red_zone = (item.red_zone as number) || 0;
    const projected_on_hand = on_hand - qualified_demand;
    
    return {
      product_id: item.product_id as string,
      location_id: item.location_id as string,
      sku: item.sku as string,
      product_name: item.product_name as string,
      category: (item.category as string) || 'N/A',
      nfp,
      on_hand,
      on_order: (item.on_order as number) || 0,
      qualified_demand,
      red_zone,
      yellow_zone: (item.yellow_zone as number) || 0,
      green_zone: (item.green_zone as number) || 0,
      tor,
      toy,
      tog,
      buffer_penetration_pct: penetration,
      execution_priority: priority,
      priority_color: color,
      projected_on_hand,
      critical_alert: nfp < tor,
      current_oh_alert: on_hand < red_zone,
      projected_oh_alert: projected_on_hand < red_zone
    };
  }).sort((a, b) => a.buffer_penetration_pct - b.buffer_penetration_pct).slice(0, 100);

  if (isLoading) return <PageLoading />;

  const criticalItems = priorities?.filter((p) => p.execution_priority === "CRITICAL") || [];
  const highItems = priorities?.filter((p) => p.execution_priority === "HIGH") || [];

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Execution Priority Dashboard</strong> - Items sorted by buffer penetration % (NOT due date). 
          Execute replenishment based on color priority: Deep Red → Red → Yellow → Green. 
          This replaces traditional due-date scheduling with demand-driven execution.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalItems.length}</div>
            <p className="text-xs text-muted-foreground">Below TOR - Immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highItems.length}</div>
            <p className="text-xs text-muted-foreground">Below TOY - Expedite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Current OH Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {priorities?.filter((p) => p.current_oh_alert).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">On-hand below red zone</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Projected Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {priorities?.filter((p) => p.projected_oh_alert).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Future risk detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Execution Table */}
      <Card>
        <CardHeader>
          <CardTitle>Execution Priority Queue</CardTitle>
          <CardDescription>
            Items sorted by buffer penetration % - Execute top items first (ignore due dates)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {priorities && priorities.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">NFP</TableHead>
                  <TableHead className="text-right">Rec. Qty</TableHead>
                  <TableHead className="text-right">Lead Time</TableHead>
                  <TableHead className="text-right">On Hand</TableHead>
                  <TableHead className="text-right">On Order</TableHead>
                  <TableHead className="text-center">Penetration %</TableHead>
                  <TableHead className="text-center">Buffer Visual</TableHead>
                  <TableHead className="text-center">Alerts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {priorities.map((item) => (
                  <TableRow key={`${item.product_id}-${item.location_id}`}>
                    <TableCell>
                      <PriorityBadge priority={item.execution_priority} color={item.priority_color} />
                    </TableCell>
                    <TableCell className="font-medium">{item.sku}</TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{item.product_name}</div>
                      <div className="text-xs text-muted-foreground">{item.category}</div>
                    </TableCell>
                    <TableCell>{item.location_id}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.nfp?.toFixed(0) || "0"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-primary">
                        {Math.max(0, (item.tog || 0) - (item.nfp || 0)).toFixed(0)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {Math.round(((item.yellow_zone || 0) + (item.red_zone || 0)) / (item.nfp > 0 ? item.nfp / 10 : 1))} days
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.on_hand?.toFixed(0) || "0"}
                        {item.current_oh_alert && (
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{item.on_order?.toFixed(0) || "0"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold min-w-[50px]">
                          {item.buffer_penetration_pct?.toFixed(1)}%
                        </span>
                        {item.buffer_penetration_pct < 50 ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <BufferPenetrationBar
                        penetration={item.buffer_penetration_pct}
                        color={item.priority_color}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>R:{item.red_zone?.toFixed(0)}</span>
                        <span>Y:{item.yellow_zone?.toFixed(0)}</span>
                        <span>G:{item.green_zone?.toFixed(0)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col gap-1">
                        {item.critical_alert && (
                          <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                        )}
                        {item.projected_oh_alert && (
                          <Badge variant="outline" className="text-xs">Projected Risk</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No execution priority data available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Execution Guide */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-400">Execution Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Badge className="bg-red-600">CRITICAL</Badge>
            <span>Below TOR - Immediate action required. Expedite/Fast freight if needed.</span>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-red-500">HIGH</Badge>
            <span>Below TOY - Prioritize replenishment. Monitor daily.</span>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-yellow-500 text-black">MEDIUM</Badge>
            <span>Below TOG - Normal replenishment priority. No urgency.</span>
          </div>
          <div className="flex items-start gap-2">
            <Badge className="bg-green-500">LOW</Badge>
            <span>Above TOG - Well stocked. Lowest priority.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
