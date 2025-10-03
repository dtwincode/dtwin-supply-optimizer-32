import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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

export const POExecutionTable = () => {
  const [pos, setPOs] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPOs();
  }, []);

  const loadPOs = async () => {
    try {
      const { data, error } = await supabase
        .from("open_pos")
        .select("*")
        .in("status", ["OPEN", "IN_TRANSIT"])
        .order("expected_date", { ascending: true })
        .limit(20);

      if (error) throw error;
      setPOs(data || []);
    } catch (error) {
      console.error("Error loading POs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      OPEN: "default",
      IN_TRANSIT: "secondary",
      RECEIVED: "default",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const isLate = (expectedDate: string | null, status: string) => {
    return expectedDate && status !== "RECEIVED" && new Date(expectedDate) < new Date();
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading purchase orders...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Ordered Qty</TableHead>
            <TableHead className="text-right">Received Qty</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Expected Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No purchase orders found
              </TableCell>
            </TableRow>
          ) : (
            pos.map((po) => (
              <TableRow key={po.id} className={isLate(po.expected_date, po.status) ? "bg-destructive/10" : ""}>
                <TableCell className="font-medium">{po.product_id}</TableCell>
                <TableCell>{po.location_id}</TableCell>
                <TableCell className="text-right">{po.ordered_qty}</TableCell>
                <TableCell className="text-right">{po.received_qty || 0}</TableCell>
                <TableCell>{format(new Date(po.order_date), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  {po.expected_date ? format(new Date(po.expected_date), "MMM dd, yyyy") : "N/A"}
                  {po.expected_date && isLate(po.expected_date, po.status) && (
                    <Badge variant="destructive" className="ml-2">Late</Badge>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(po.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
