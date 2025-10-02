import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePurchaseOrderActions = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const updatePOStatus = async (poId: string, newStatus: 'OPEN' | 'IN_TRANSIT' | 'RECEIVED') => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("open_pos")
        .update({ status: newStatus })
        .eq("id", poId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Purchase order status updated to ${newStatus.replace('_', ' ')}`,
      });

      return true;
    } catch (error) {
      console.error("Error updating PO status:", error);
      toast({
        title: "Error",
        description: "Failed to update purchase order status",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const receivePO = async (
    poId: string,
    productId: string,
    locationId: string,
    orderedQty: number,
    receivedQty: number,
    currentReceivedQty: number = 0
  ) => {
    try {
      setLoading(true);

      const totalReceived = currentReceivedQty + receivedQty;
      const isFullyReceived = totalReceived >= orderedQty;

      // Update PO received quantity and status
      const { error: poError } = await supabase
        .from("open_pos")
        .update({
          received_qty: totalReceived,
          status: isFullyReceived ? 'RECEIVED' : 'IN_TRANSIT',
        })
        .eq("id", poId);

      if (poError) throw poError;

      // Update on_hand_inventory
      const { data: currentInventory } = await supabase
        .from("on_hand_inventory")
        .select("qty_on_hand")
        .eq("product_id", productId)
        .eq("location_id", locationId)
        .order("snapshot_ts", { ascending: false })
        .limit(1)
        .single();

      const newOnHand = (currentInventory?.qty_on_hand || 0) + receivedQty;

      const { error: inventoryError } = await supabase
        .from("on_hand_inventory")
        .insert({
          product_id: productId,
          location_id: locationId,
          qty_on_hand: newOnHand,
          snapshot_ts: new Date().toISOString(),
        });

      if (inventoryError) throw inventoryError;

      // Create receipt transaction in historical_sales_data
      const { error: transactionError } = await supabase
        .from("historical_sales_data")
        .insert({
          product_id: productId,
          location_id: locationId,
          sales_date: new Date().toISOString().split('T')[0],
          quantity_sold: receivedQty,
          transaction_type: 'RECEIPT',
          revenue: 0,
        });

      if (transactionError) throw transactionError;

      toast({
        title: "Receipt Processed",
        description: `Received ${receivedQty} units. ${isFullyReceived ? 'PO fully received.' : 'Partial receipt recorded.'}`,
      });

      return true;
    } catch (error) {
      console.error("Error processing receipt:", error);
      toast({
        title: "Error",
        description: "Failed to process receipt",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePOStatus,
    receivePO,
    loading,
  };
};
