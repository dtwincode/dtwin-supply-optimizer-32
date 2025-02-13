
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem, BufferZones } from '@/types/inventory';
import { calculateOrderQuantity } from '@/utils/inventoryUtils';
import { supabase } from "@/integrations/supabase/client";

interface CreatePODialogProps {
  item: InventoryItem;
  bufferZones: BufferZones;
  onSuccess?: () => void;
}

export const CreatePODialog = ({ item, bufferZones, onSuccess }: CreatePODialogProps) => {
  const { toast } = useToast();
  const [quantity, setQuantity] = React.useState(() => 
    calculateOrderQuantity(item.netFlowPosition, bufferZones)
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create PO using new schema-typed insert
      const poData = {
        sku: item.sku,
        quantity: quantity,
        status: 'draft',
        po_number: `PO-${Date.now()}`,
        order_date: new Date().toISOString()
      };

      const { error } = await supabase
        .from('purchase_orders')
        .insert(poData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Purchase order created successfully",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating PO:', error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create PO</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" value={item.sku} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              required
            />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Purchase Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
