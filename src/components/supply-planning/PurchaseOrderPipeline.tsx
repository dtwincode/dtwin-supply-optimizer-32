import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, TruckIcon, AlertCircle, Send, PackageCheck } from "lucide-react";
import { format, isPast } from "date-fns";
import { usePurchaseOrderActions } from "@/hooks/usePurchaseOrderActions";
import ReceivePODialog from "./ReceivePODialog";

interface PurchaseOrder {
  id: string;
  product_id: string;
  location_id: string;
  ordered_qty: number;
  received_qty: number | null;
  order_date: string;
  expected_date: string | null;
  status: string;
}

const PurchaseOrderPipeline: React.FC = () => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [receivingPO, setReceivingPO] = useState<PurchaseOrder | null>(null);
  const { updatePOStatus, receivePO } = usePurchaseOrderActions();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("open_pos")
        .select("*")
        .order("expected_date", { ascending: true });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToSupplier = async (poId: string) => {
    const success = await updatePOStatus(poId, 'IN_TRANSIT');
    if (success) fetchOrders();
  };

  const handleReceiveClick = (order: PurchaseOrder) => {
    setReceivingPO(order);
  };

  const handleReceiveConfirm = async (receivedQty: number) => {
    if (!receivingPO) return;
    
    const success = await receivePO(
      receivingPO.id,
      receivingPO.product_id,
      receivingPO.location_id,
      receivingPO.ordered_qty,
      receivedQty,
      receivingPO.received_qty || 0
    );
    
    if (success) {
      fetchOrders();
      setReceivingPO(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      OPEN: { variant: "secondary" as const, label: "Open" },
      IN_TRANSIT: { variant: "default" as const, label: "In Transit" },
      RECEIVED: { variant: "outline" as const, label: "Received" },
    };

    const { variant, label } = config[status as keyof typeof config] || config.OPEN;

    return <Badge variant={variant}>{label}</Badge>;
  };

  const isLate = (expectedDate: string | null) => {
    if (!expectedDate) return false;
    return isPast(new Date(expectedDate)) && new Date(expectedDate).toDateString() !== new Date().toDateString();
  };

  const openOrders = orders.filter((o) => o.status === "OPEN");
  const inTransit = orders.filter((o) => o.status === "IN_TRANSIT");
  const totalQtyInPipeline = orders.reduce((sum, o) => sum + (o.ordered_qty - (o.received_qty || 0)), 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open POs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openOrders.length}</div>
            <p className="text-xs text-muted-foreground">Active purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <TruckIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransit.length}</div>
            <p className="text-xs text-muted-foreground">Orders being delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Qty</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQtyInPipeline.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Units on order</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Pipeline</CardTitle>
          <CardDescription>Track active purchase orders and incoming inventory</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Package className="h-8 w-8 animate-pulse text-muted-foreground" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No active purchase orders</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Ordered</TableHead>
                  <TableHead className="text-right">Received</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const pending = order.ordered_qty - (order.received_qty || 0);
                  const late = isLate(order.expected_date);
                  
                  return (
                    <TableRow key={order.id} className={late ? "bg-destructive/5" : ""}>
                      <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{order.product_id}</TableCell>
                      <TableCell>{order.location_id}</TableCell>
                      <TableCell className="text-right font-mono">{order.ordered_qty.toFixed(0)}</TableCell>
                      <TableCell className="text-right font-mono">{(order.received_qty || 0).toFixed(0)}</TableCell>
                      <TableCell className="text-right font-mono font-semibold">{pending.toFixed(0)}</TableCell>
                      <TableCell className="text-sm">{format(new Date(order.order_date), "MMM dd, yyyy")}</TableCell>
                      <TableCell className="text-sm">
                        <div className="flex items-center gap-2">
                          {order.expected_date ? format(new Date(order.expected_date), "MMM dd, yyyy") : "-"}
                          {late && <AlertCircle className="h-3 w-3 text-destructive" />}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'OPEN' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendToSupplier(order.id)}
                            >
                              <Send className="h-3 w-3 mr-1" />
                              Send
                            </Button>
                          )}
                          {order.status === 'IN_TRANSIT' && (
                            <Button
                              size="sm"
                              onClick={() => handleReceiveClick(order)}
                            >
                              <PackageCheck className="h-3 w-3 mr-1" />
                              Receive
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {receivingPO && (
        <ReceivePODialog
          open={!!receivingPO}
          onOpenChange={(open) => !open && setReceivingPO(null)}
          orderedQty={receivingPO.ordered_qty}
          currentReceivedQty={receivingPO.received_qty || 0}
          onReceive={handleReceiveConfirm}
        />
      )}
    </div>
  );
};

export default PurchaseOrderPipeline;
