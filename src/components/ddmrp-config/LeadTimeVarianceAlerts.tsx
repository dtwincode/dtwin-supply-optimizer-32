import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import PageLoading from "@/components/PageLoading";

interface LeadTimeVariance {
  id: string;
  product_id: string;
  location_id: string;
  previous_lead_time: number;
  new_lead_time: number;
  variance_pct: number;
  detected_at: string;
  ltaf_triggered: boolean;
  ltaf_value: number;
  acknowledged: boolean;
}

export function LeadTimeVarianceAlerts() {
  const queryClient = useQueryClient();

  // Fetch variance alerts
  const { data: variances, isLoading } = useQuery({
    queryKey: ["lead-time-variances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_time_variance_log" as any)
        .select("*")
        .order("detected_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as unknown as LeadTimeVariance[];
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Detect variances
  const detectVariances = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("detect_lead_time_variance");
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["lead-time-variances"] });
      if (data && data.length > 0) {
        toast.success(`Detected ${data.length} lead time variances`);
      } else {
        toast.info("No significant lead time variances detected");
      }
    },
    onError: (error: Error) => {
      toast.error(`Detection failed: ${error.message}`);
    },
  });

  // Auto-trigger LTAF
  const autoTriggerLTAF = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("auto_trigger_ltaf_on_variance");
      if (error) throw error;
      return data;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["lead-time-variances"] });
      if (count > 0) {
        toast.success(`Auto-triggered ${count} LTAF adjustments`);
      } else {
        toast.info("No LTAF triggers needed");
      }
    },
  });

  // Acknowledge variance
  const acknowledgeVariance = useMutation({
    mutationFn: async (varianceId: string) => {
      const { error } = await supabase
        .from("lead_time_variance_log" as any)
        .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
        .eq("id", varianceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-time-variances"] });
      toast.success("Variance acknowledged");
    },
  });

  if (isLoading) return <PageLoading />;

  const unacknowledgedCount = variances?.filter((v) => !v.acknowledged).length || 0;
  const ltafTriggeredCount = variances?.filter((v) => v.ltaf_triggered).length || 0;

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Lead Time Change Detection (Chapter 10, Page 190-192)</strong> - Automatically
          monitors supplier lead time changes and triggers LTAF when variance exceeds 20%. This
          ensures buffers dynamically adjust to supply chain reality.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Variances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{variances?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-600">Unacknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{unacknowledgedCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/50 bg-blue-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-600">LTAF Triggered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{ltafTriggeredCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Auto-adjusted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => detectVariances.mutate()}
              disabled={detectVariances.isPending}
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${detectVariances.isPending ? "animate-spin" : ""}`} />
              Detect Variances
            </Button>
            <Button
              size="sm"
              variant="default"
              className="w-full"
              onClick={() => autoTriggerLTAF.mutate()}
              disabled={autoTriggerLTAF.isPending}
            >
              Auto-Trigger LTAF
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Variance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lead Time Variance Log</CardTitle>
          <CardDescription>
            Detected changes in supplier lead times with auto-LTAF triggering
          </CardDescription>
        </CardHeader>
        <CardContent>
          {variances && variances.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Previous LT</TableHead>
                  <TableHead className="text-center">New LT</TableHead>
                  <TableHead className="text-center">Variance</TableHead>
                  <TableHead className="text-center">LTAF Value</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Detected</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variances.map((variance) => (
                  <TableRow key={variance.id}>
                    <TableCell className="font-mono text-sm">{variance.product_id}</TableCell>
                    <TableCell>{variance.location_id}</TableCell>
                    <TableCell className="text-center">{variance.previous_lead_time} days</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {variance.new_lead_time} days
                        {variance.new_lead_time > variance.previous_lead_time ? (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={variance.variance_pct >= 50 ? "destructive" : "secondary"}
                        className={variance.variance_pct >= 50 ? "" : "bg-yellow-500 text-black"}
                      >
                        {variance.variance_pct.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {variance.ltaf_value.toFixed(2)}×
                    </TableCell>
                    <TableCell className="text-center">
                      {variance.ltaf_triggered ? (
                        <Badge className="bg-blue-600">LTAF Applied</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {new Date(variance.detected_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {!variance.acknowledged && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => acknowledgeVariance.mutate(variance.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No lead time variances detected. Run detection to check for changes.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
