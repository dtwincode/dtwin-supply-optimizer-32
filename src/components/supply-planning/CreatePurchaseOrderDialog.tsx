import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";

interface ReplenishmentOrder {
  proposal_id: number;
  product_id: string;
  location_id: string;
  qty_recommend: number;
  target_due_date: string | null;
}

interface GroupedOrders {
  supplier_id: string;
  supplier_name: string;
  orders: ReplenishmentOrder[];
  totalItems: number;
}

interface CreatePurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreatePurchaseOrderDialog: React.FC<CreatePurchaseOrderDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrders[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchApprovedOrders();
    }
  }, [open]);

  const fetchApprovedOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch all approved replenishment orders
      const { data: orders, error: ordersError } = await supabase
        .from("replenishment_orders")
        .select("*")
        .eq("status", "APPROVED");

      if (ordersError) throw ordersError;

      // Get unique product IDs to fetch suppliers
      const productIds = [...new Set(orders?.map(o => o.product_id) || [])];
      
      const { data: products, error: productsError } = await supabase
        .from("product_master")
        .select("product_id, supplier_id")
        .in("product_id", productIds);

      if (productsError) throw productsError;

      // Get supplier names
      const supplierIds = [...new Set(products?.map(p => p.supplier_id).filter((id): id is string => id !== null && id !== undefined) || [])];
      const { data: suppliers, error: suppliersError } = await supabase
        .from("vendor_master")
        .select("vendor_id, vendor_name")
        .in("vendor_id", supplierIds);

      if (suppliersError) throw suppliersError;

      // Build supplier map
      const supplierMap = new Map(suppliers?.map(s => [s.vendor_id, s.vendor_name]) || []);
      const productSupplierMap = new Map(products?.map(p => [p.product_id, p.supplier_id]) || []);

      // Group orders by supplier
      const grouped = orders?.reduce((acc, order) => {
        const supplierId = productSupplierMap.get(order.product_id) || 'UNKNOWN';
        const supplierName = supplierMap.get(supplierId) || 'Unknown Supplier';
        
        const existing = acc.find(g => g.supplier_id === supplierId);
        if (existing) {
          existing.orders.push(order);
          existing.totalItems += order.qty_recommend;
        } else {
          acc.push({
            supplier_id: supplierId,
            supplier_name: supplierName,
            orders: [order],
            totalItems: order.qty_recommend,
          });
        }
        return acc;
      }, [] as GroupedOrders[]) || [];

      setGroupedOrders(grouped);
    } catch (error) {
      console.error("Error fetching approved orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch approved orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePONumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    return `PO-${year}-${random}`;
  };

  const createPurchaseOrders = async () => {
    try {
      setLoading(true);

      for (const group of groupedOrders) {
        for (const order of group.orders) {
          // Get lead time for expected delivery date
          const { data: leadTimeData } = await supabase
            .from("actual_lead_time")
            .select("actual_lead_time_days")
            .eq("product_id", order.product_id)
            .eq("location_id", order.location_id)
            .single();

          const leadTimeDays = leadTimeData?.actual_lead_time_days || 7; // Default 7 days
          const expectedDate = addDays(new Date(), leadTimeDays);

          // Create PO in open_pos table
          const { error: poError } = await supabase
            .from("open_pos")
            .insert({
              product_id: order.product_id,
              location_id: order.location_id,
              ordered_qty: order.qty_recommend,
              received_qty: 0,
              order_date: new Date().toISOString().split('T')[0],
              expected_date: format(expectedDate, 'yyyy-MM-dd'),
              status: 'OPEN',
            });

          if (poError) throw poError;

          // Update replenishment order status
          const { error: updateError } = await supabase
            .from("replenishment_orders")
            .update({ status: 'PO_CREATED' })
            .eq("proposal_id", order.proposal_id);

          if (updateError) throw updateError;
        }
      }

      toast({
        title: "Purchase Orders Created",
        description: `Successfully created ${groupedOrders.reduce((sum, g) => sum + g.orders.length, 0)} purchase orders`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating purchase orders:", error);
      toast({
        title: "Error",
        description: "Failed to create purchase orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Orders</DialogTitle>
          <DialogDescription>
            Review approved replenishment orders grouped by supplier
          </DialogDescription>
        </DialogHeader>

        {loading && groupedOrders.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : groupedOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No approved orders available to create POs
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {groupedOrders.reduce((sum, g) => sum + g.orders.length, 0)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{groupedOrders.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {groupedOrders.reduce((sum, g) => sum + g.totalItems, 0).toFixed(0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {groupedOrders.map((group) => (
              <Card key={group.supplier_id}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {group.supplier_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Target Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {group.orders.map((order) => (
                        <TableRow key={order.proposal_id}>
                          <TableCell className="font-medium">{order.product_id}</TableCell>
                          <TableCell>{order.location_id}</TableCell>
                          <TableCell className="text-right font-mono">{order.qty_recommend.toFixed(0)}</TableCell>
                          <TableCell>
                            {order.target_due_date ? format(new Date(order.target_due_date), "MMM dd, yyyy") : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={createPurchaseOrders} disabled={loading || groupedOrders.length === 0}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create {groupedOrders.reduce((sum, g) => sum + g.orders.length, 0)} Purchase Orders
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePurchaseOrderDialog;
