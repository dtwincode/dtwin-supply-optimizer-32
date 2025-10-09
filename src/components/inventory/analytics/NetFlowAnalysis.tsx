import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, TrendingUp, Activity, AlertTriangle } from "lucide-react";

interface NetFlowData {
  product_id: string;
  location_id: string;
  on_hand: number;
  on_order: number;
  qualified_demand: number;
  nfp: number;
}

interface NetFlowSummary extends NetFlowData {
  status: 'healthy' | 'warning' | 'critical';
  nfp_trend: 'positive' | 'negative' | 'neutral';
}

export function NetFlowAnalysis() {
  // Fetch from inventory_net_flow_view (optimized NFP calculations)
  const { data: netFlowData, isLoading } = useQuery({
    queryKey: ["inventory-net-flow-view"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_net_flow_view" as any)
        .select("*")
        .order("nfp", { ascending: true })
        .limit(100);

      if (error) throw error;
      return (data || []) as any as NetFlowData[];
    },
  });

  // Fetch buffer zones for comparison
  const { data: bufferData } = useQuery({
    queryKey: ["inventory-buffers-for-nfp"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_ddmrp_buffers_view" as any)
        .select("product_id, location_id, tor, toy, tog");

      if (error) throw error;
      return data || [];
    },
  });

  // Enrich NFP data with buffer status
  const enrichedData: NetFlowSummary[] = netFlowData
    ? netFlowData.map(item => {
        const buffer = (bufferData || []).find(
          (b: any) => b.product_id === item.product_id && b.location_id === item.location_id
        );

        const tor = (buffer as any)?.tor || 0;
        const toy = (buffer as any)?.toy || 0;

        let status: 'healthy' | 'warning' | 'critical' = 'healthy';
        if (tor > 0) {
          if (item.nfp < tor) status = 'critical';
          else if (item.nfp < toy) status = 'warning';
        }

        let nfp_trend: 'positive' | 'negative' | 'neutral' = 'neutral';
        if (item.on_order > item.qualified_demand) nfp_trend = 'positive';
        else if (item.qualified_demand > item.on_hand) nfp_trend = 'negative';

        return {
          ...item,
          status,
          nfp_trend,
        };
      })
    : [];

  const criticalCount = enrichedData.filter(item => item.status === 'critical').length;
  const warningCount = enrichedData.filter(item => item.status === 'warning').length;
  const healthyCount = enrichedData.filter(item => item.status === 'healthy').length;
  const avgNFP = enrichedData.length > 0
    ? Math.round(enrichedData.reduce((sum, item) => sum + item.nfp, 0) / enrichedData.length)
    : 0;

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

  const getStatusBadge = (status: 'healthy' | 'warning' | 'critical') => {
    if (status === 'critical') {
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Critical
        </Badge>
      );
    } else if (status === 'warning') {
      return (
        <Badge variant="default" className="gap-1 bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
          <TrendingDown className="h-3 w-3" />
          Warning
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="gap-1 bg-green-500/10 text-green-700 border-green-500/20">
        <TrendingUp className="h-3 w-3" />
        Healthy
      </Badge>
    );
  };

  const getTrendIcon = (trend: 'positive' | 'negative' | 'neutral') => {
    if (trend === 'positive') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'negative') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">NFP below TOR</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
            <p className="text-xs text-muted-foreground">NFP below TOY</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyCount}</div>
            <p className="text-xs text-muted-foreground">NFP above TOY</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg NFP</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgNFP}</div>
            <p className="text-xs text-muted-foreground">units average</p>
          </CardContent>
        </Card>
      </div>

      {/* Net Flow Position Details */}
      <Card>
        <CardHeader>
          <CardTitle>Net Flow Position Analysis</CardTitle>
          <CardDescription>
            Pre-computed NFP from inventory_net_flow_view (NFP = On-Hand + On-Order - Qualified Demand)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Location ID</TableHead>
                <TableHead className="text-right">On-Hand</TableHead>
                <TableHead className="text-right">On-Order</TableHead>
                <TableHead className="text-right">Qualified Demand</TableHead>
                <TableHead className="text-right">NFP</TableHead>
                <TableHead className="text-center">Trend</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    No net flow data found
                  </TableCell>
                </TableRow>
              ) : (
                enrichedData.map((item, idx) => (
                  <TableRow key={`${item.product_id}-${item.location_id}-${idx}`}>
                    <TableCell className="font-mono text-sm">{item.product_id}</TableCell>
                    <TableCell className="font-mono text-sm">{item.location_id}</TableCell>
                    <TableCell className="text-right">{item.on_hand?.toFixed(0) || '0'}</TableCell>
                    <TableCell className="text-right">{item.on_order?.toFixed(0) || '0'}</TableCell>
                    <TableCell className="text-right">{item.qualified_demand?.toFixed(0) || '0'}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {item.nfp?.toFixed(0) || '0'}
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendIcon(item.nfp_trend)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(item.status)}
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
