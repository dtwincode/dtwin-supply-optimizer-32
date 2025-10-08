import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CheckCircle, Bell, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface BufferBreachAlert {
  id: string;
  product_id: string;
  location_id: string;
  sku: string;
  product_name: string;
  breach_type: "BELOW_TOR" | "BELOW_TOY";
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  nfp: number;
  tor: number;
  toy: number;
  buffer_penetration_pct: number;
  recommended_qty: number;
  detected_at: string;
  acknowledged: boolean;
  acknowledged_at: string | null;
  notes: string | null;
}

export function BufferBreachAlerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Fetch alerts
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["buffer-breach-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buffer_breach_alerts")
        .select("*")
        .order("detected_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as BufferBreachAlert[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Real-time subscription for new alerts
  useEffect(() => {
    const channel = supabase
      .channel("buffer-breach-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "buffer_breach_alerts",
        },
        (payload) => {
          const newAlert = payload.new as BufferBreachAlert;
          console.log("🚨 New buffer breach detected:", newAlert);

          // Show toast notification
          toast({
            title: `🚨 ${newAlert.severity} Buffer Breach!`,
            description: `${newAlert.product_name} (${newAlert.sku}) at ${newAlert.location_id} is ${newAlert.breach_type === "BELOW_TOR" ? "below TOR" : "below TOY"}`,
            variant: newAlert.severity === "CRITICAL" ? "destructive" : "default",
          });

          // Refresh alerts
          queryClient.invalidateQueries({ queryKey: ["buffer-breach-alerts"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  // Acknowledge alert mutation
  const acknowledgeMutation = useMutation({
    mutationFn: async ({ alertId, notes }: { alertId: string; notes: string }) => {
      const { error } = await supabase
        .from("buffer_breach_alerts")
        .update({
          acknowledged: true,
          acknowledged_at: new Date().toISOString(),
          notes: notes || null,
        })
        .eq("id", alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alert Acknowledged",
        description: "Buffer breach alert has been acknowledged.",
      });
      setSelectedAlert(null);
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["buffer-breach-alerts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to acknowledge alert: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Trigger breach detection
  const detectBreachesMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("detect-breaches");
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Breach Detection Complete",
        description: `Detected ${data.breaches_detected} buffer breaches (${data.critical_count} critical, ${data.high_count} high)`,
      });
      queryClient.invalidateQueries({ queryKey: ["buffer-breach-alerts"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to detect breaches: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const unacknowledgedAlerts = alerts?.filter((a) => !a.acknowledged) || [];
  const criticalCount = unacknowledgedAlerts.filter((a) => a.severity === "CRITICAL").length;
  const highCount = unacknowledgedAlerts.filter((a) => a.severity === "HIGH").length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-red-600">{criticalCount}</div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">Below TOR - Immediate action!</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">{highCount}</div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Below TOY - Expedite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Unacknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{unacknowledgedAlerts.length}</div>
              <Button
                size="sm"
                onClick={() => detectBreachesMutation.mutate()}
                disabled={detectBreachesMutation.isPending}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${detectBreachesMutation.isPending ? 'animate-spin' : ''}`} />
                Scan Now
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Buffer Breach Alerts
          </CardTitle>
          <CardDescription>
            Real-time alerts for items breaching buffer thresholds (TOR/TOY)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading alerts...</div>
          ) : alerts && alerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">NFP</TableHead>
                  <TableHead className="text-right">TOR</TableHead>
                  <TableHead className="text-right">Penetration %</TableHead>
                  <TableHead className="text-right">Recommended Qty</TableHead>
                  <TableHead>Detected</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id} className={alert.acknowledged ? "opacity-50" : ""}>
                    <TableCell>
                      <Badge
                        variant={alert.severity === "CRITICAL" ? "destructive" : "default"}
                        className={alert.severity === "HIGH" ? "bg-orange-500" : ""}
                      >
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{alert.sku}</TableCell>
                    <TableCell className="max-w-xs truncate">{alert.product_name}</TableCell>
                    <TableCell>{alert.location_id}</TableCell>
                    <TableCell className="text-right font-semibold text-red-600">
                      {alert.nfp?.toFixed(0)}
                    </TableCell>
                    <TableCell className="text-right">{alert.tor?.toFixed(0)}</TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-red-600">
                        {alert.buffer_penetration_pct?.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-primary font-medium">
                      {alert.recommended_qty?.toFixed(0)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.detected_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      {alert.acknowledged ? (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Acknowledged
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!alert.acknowledged && (
                        <>
                          {selectedAlert === alert.id ? (
                            <div className="flex flex-col gap-2">
                              <Textarea
                                placeholder="Add notes (optional)..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="h-20"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    acknowledgeMutation.mutate({
                                      alertId: alert.id,
                                      notes,
                                    })
                                  }
                                  disabled={acknowledgeMutation.isPending}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedAlert(null);
                                    setNotes("");
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedAlert(alert.id)}
                            >
                              Acknowledge
                            </Button>
                          )}
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No buffer breach alerts detected. System is healthy! 🎉
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}