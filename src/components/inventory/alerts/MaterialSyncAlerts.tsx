import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Clock, Info, Package } from "lucide-react";
import PageLoading from "@/components/PageLoading";
import { useToast } from "@/hooks/use-toast";

interface MaterialSyncAlert {
  id: string;
  parent_product_id: string;
  parent_location_id: string;
  component_product_id: string;
  component_location_id: string;
  alert_type: "early_arrival" | "missing_component" | "qty_mismatch" | "lead_time_mismatch";
  severity: "HIGH" | "MEDIUM" | "LOW";
  expected_date?: string;
  actual_date?: string;
  expected_qty?: number;
  actual_qty?: number;
  message: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  created_at: string;
  resolved_at?: string;
}

const SeverityBadge = ({ severity }: { severity: string }) => {
  const colorMap = {
    HIGH: "bg-red-500 text-white",
    MEDIUM: "bg-yellow-500 text-black",
    LOW: "bg-blue-500 text-white",
  };

  return (
    <Badge className={colorMap[severity as keyof typeof colorMap]}>
      {severity}
    </Badge>
  );
};

const AlertTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "early_arrival":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "missing_component":
      return <AlertTriangle className="h-4 w-4 text-red-600" />;
    case "qty_mismatch":
      return <Package className="h-4 w-4 text-yellow-600" />;
    case "lead_time_mismatch":
      return <Clock className="h-4 w-4 text-orange-600" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

export function MaterialSyncAlerts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["material-sync-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("material_sync_alerts" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as unknown as MaterialSyncAlert[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const acknowledgeAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from("material_sync_alerts" as any)
        .update({
          acknowledged: true,
          acknowledged_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material-sync-alerts"] });
      toast({
        title: "Alert Acknowledged",
        description: "The synchronization alert has been acknowledged.",
      });
    },
  });

  const resolveAlert = useMutation({
    mutationFn: async (alertId: string) => {
      const { error } = await supabase
        .from("material_sync_alerts" as any)
        .update({
          resolved_at: new Date().toISOString(),
        })
        .eq("id", alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material-sync-alerts"] });
      toast({
        title: "Alert Resolved",
        description: "The synchronization alert has been marked as resolved.",
      });
    },
  });

  if (isLoading) return <PageLoading />;

  const unresolvedAlerts = alerts?.filter((a) => !a.resolved_at) || [];
  const highSeverityAlerts = unresolvedAlerts.filter((a) => a.severity === "HIGH");

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Material Synchronization Alerts</strong> - Detect when components are out of sync with parent assemblies. 
          Prevent WIP accumulation by ensuring all components arrive together. Critical for multi-level BOMs and assembly operations.
        </AlertDescription>
      </Alert>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{highSeverityAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Immediate attention required</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unresolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unresolvedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Active sync issues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{alerts?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All time (last 100)</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Material Synchronization Alerts</CardTitle>
          <CardDescription>
            BOM component synchronization issues requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts && alerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Parent Product</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date Info</TableHead>
                  <TableHead>Qty Info</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow
                    key={alert.id}
                    className={alert.resolved_at ? "opacity-50" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <AlertTypeIcon type={alert.alert_type} />
                        <span className="text-xs capitalize">
                          {alert.alert_type.replace("_", " ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={alert.severity} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{alert.parent_product_id}</div>
                      <div className="text-xs text-muted-foreground">{alert.parent_location_id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{alert.component_product_id}</div>
                      <div className="text-xs text-muted-foreground">{alert.component_location_id}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm">{alert.message}</p>
                    </TableCell>
                    <TableCell>
                      {alert.expected_date && alert.actual_date && (
                        <div className="text-xs space-y-1">
                          <div>Expected: {new Date(alert.expected_date).toLocaleDateString()}</div>
                          <div>Actual: {new Date(alert.actual_date).toLocaleDateString()}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {alert.expected_qty != null && alert.actual_qty != null && (
                        <div className="text-xs space-y-1">
                          <div>Expected: {alert.expected_qty}</div>
                          <div>Actual: {alert.actual_qty}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {alert.resolved_at ? (
                        <Badge variant="outline" className="bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      ) : alert.acknowledged ? (
                        <Badge variant="secondary">Acknowledged</Badge>
                      ) : (
                        <Badge variant="destructive">New</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        {!alert.acknowledged && !alert.resolved_at && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => acknowledgeAlert.mutate(alert.id)}
                            disabled={acknowledgeAlert.isPending}
                          >
                            Acknowledge
                          </Button>
                        )}
                        {!alert.resolved_at && (
                          <Button
                            size="sm"
                            onClick={() => resolveAlert.mutate(alert.id)}
                            disabled={resolveAlert.isPending}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium">All Materials Synchronized</p>
              <p className="text-sm text-muted-foreground">
                No synchronization alerts detected
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Types Guide */}
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-400">Alert Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
            <div>
              <strong>Early Arrival:</strong> Component arrived before parent assembly is ready. May cause WIP accumulation.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
            <div>
              <strong>Missing Component:</strong> Parent assembly scheduled but component not ordered/arrived. Blocks production.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div>
              <strong>Qty Mismatch:</strong> Component quantity doesn't match BOM requirements for parent assembly.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
            <div>
              <strong>Lead Time Mismatch:</strong> Supplier lead time changed, buffer zones may be inadequate.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
