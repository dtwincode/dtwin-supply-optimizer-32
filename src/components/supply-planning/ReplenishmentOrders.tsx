import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, Package, Edit2, Save, X } from "lucide-react";
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
  moq?: number;
  rounding_multiple?: number;
}

interface EditingOrder {
  proposal_id: number;
  qty_recommend: number;
  target_due_date: string;
  adjustment_notes: string;
}

const ReplenishmentOrders: React.FC = () => {
  const [orders, setOrders] = useState<ReplenishmentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<EditingOrder | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Fetch orders with buffer profile data to get MOQ and rounding
      const { data, error } = await supabase
        .from("replenishment_orders")
        .select(`
          *,
          product:product_master!inner(buffer_profile_id),
          buffer:buffer_profile_master(moq, rounding_multiple)
        `)
        .order("proposal_ts", { ascending: false });

      if (error) throw error;

      // Flatten the data structure and add MOQ info
      const enrichedOrders = (data || []).map((order: any) => ({
        ...order,
        moq: order.buffer?.[0]?.moq || 0,
        rounding_multiple: order.buffer?.[0]?.rounding_multiple || 1,
      }));

      setOrders(enrichedOrders);
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

  const openEditDialog = (order: ReplenishmentOrder) => {
    setEditingOrder({
      proposal_id: order.proposal_id,
      qty_recommend: order.qty_recommend,
      target_due_date: order.target_due_date || format(new Date(), "yyyy-MM-dd"),
      adjustment_notes: "",
    });
    setEditDialogOpen(true);
  };

  const saveOrderEdits = async () => {
    if (!editingOrder) return;

    const currentOrder = orders.find((o) => o.proposal_id === editingOrder.proposal_id);
    const moq = currentOrder?.moq || 0;
    const roundingMultiple = currentOrder?.rounding_multiple || 1;

    // Validate MOQ
    if (editingOrder.qty_recommend < moq) {
      toast({
        title: "Invalid Quantity",
        description: `Quantity must be at least ${moq} (MOQ)`,
        variant: "destructive",
      });
      return;
    }

    // Validate rounding multiple
    if (editingOrder.qty_recommend % roundingMultiple !== 0) {
      toast({
        title: "Invalid Quantity",
        description: `Quantity must be a multiple of ${roundingMultiple}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("replenishment_orders")
        .update({
          qty_recommend: editingOrder.qty_recommend,
          target_due_date: editingOrder.target_due_date,
          reason: editingOrder.adjustment_notes
            ? `${editingOrder.adjustment_notes} (Adjusted by planner)`
            : undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("proposal_id", editingOrder.proposal_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order updated successfully",
      });

      setEditDialogOpen(false);
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
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
                            variant="ghost"
                            onClick={() => openEditDialog(order)}
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Replenishment Order</DialogTitle>
            <DialogDescription>
              Adjust quantity, due date, and add notes before approving this order.
            </DialogDescription>
          </DialogHeader>

          {editingOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="qty">Recommended Quantity</Label>
                <Input
                  id="qty"
                  type="number"
                  value={editingOrder.qty_recommend}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      qty_recommend: parseFloat(e.target.value) || 0,
                    })
                  }
                  min={orders.find((o) => o.proposal_id === editingOrder.proposal_id)?.moq || 0}
                  step={orders.find((o) => o.proposal_id === editingOrder.proposal_id)?.rounding_multiple || 1}
                />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Original: {orders.find((o) => o.proposal_id === editingOrder.proposal_id)?.qty_recommend.toFixed(0)} units</p>
                  <p className="font-semibold">MOQ: {orders.find((o) => o.proposal_id === editingOrder.proposal_id)?.moq || 0} units</p>
                  <p>Rounding: {orders.find((o) => o.proposal_id === editingOrder.proposal_id)?.rounding_multiple || 1} units</p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dueDate">Target Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={editingOrder.target_due_date}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      target_due_date: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Adjustment Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Why are you adjusting this order? (e.g., promotional event, seasonal demand)"
                  value={editingOrder.adjustment_notes}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      adjustment_notes: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingOrder(null);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={saveOrderEdits}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReplenishmentOrders;
