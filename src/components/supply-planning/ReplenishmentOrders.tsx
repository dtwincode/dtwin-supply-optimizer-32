import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Clock, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ReplenishmentOrder {
  proposal_id: number;
  product_id: string;
  location_id: string;
  qty_recommend: number;
  target_due_date: string | null;
  status: string;
  reason: string;
  proposal_ts: string;
}

const ReplenishmentOrders: React.FC = () => {
  const [orders, setOrders] = useState<ReplenishmentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("replenishment_orders")
        .select("*")
        .order("proposal_ts", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching replenishment orders:", error);
      toast({
        title: "Error",
        description: "Failed to load replenishment orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (proposalId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("replenishment_orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("proposal_id", proposalId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Order ${newStatus === "APPROVED" ? "approved" : "rejected"}`,
      });

      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      DRAFT: { variant: "secondary" as const, icon: Clock },
      APPROVED: { variant: "default" as const, icon: CheckCircle },
      REJECTED: { variant: "destructive" as const, icon: XCircle },
    };

    const { variant, icon: Icon } = config[status as keyof typeof config] || config.DRAFT;

    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const draftOrders = orders.filter((o) => o.status === "DRAFT");
  const approvedOrders = orders.filter((o) => o.status === "APPROVED");
  const rejectedOrders = orders.filter((o) => o.status === "REJECTED");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftOrders.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Ready for PO creation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedOrders.length}</div>
            <p className="text-xs text-muted-foreground">Not proceeding</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Replenishment Orders</CardTitle>
          <CardDescription>Review and approve system-generated replenishment recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Package className="h-8 w-8 animate-pulse text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No replenishment orders found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.proposal_id}>
                    <TableCell className="font-mono text-sm">{order.proposal_id}</TableCell>
                    <TableCell className="font-medium">{order.product_id}</TableCell>
                    <TableCell>{order.location_id}</TableCell>
                    <TableCell className="text-right font-mono">{order.qty_recommend.toFixed(0)}</TableCell>
                    <TableCell>
                      {order.target_due_date ? format(new Date(order.target_due_date), "MMM dd, yyyy") : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{order.reason}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(order.proposal_ts), "MMM dd, HH:mm")}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.status === "DRAFT" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => updateOrderStatus(order.proposal_id, "APPROVED")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatus(order.proposal_id, "REJECTED")}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReplenishmentOrders;
