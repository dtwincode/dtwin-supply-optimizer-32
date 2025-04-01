
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem } from '@/types/inventory';
import { supabase } from '@/lib/supabaseClient';

interface BufferZones {
  red: number;
  yellow: number;
  green: number;
}

interface CreatePODialogProps {
  item: InventoryItem;
  bufferZones: BufferZones;
  onSuccess: () => void;
}

export const CreatePODialog = ({ item, bufferZones, onSuccess }: CreatePODialogProps) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(bufferZones.red + bufferZones.yellow);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const calculateDefaultQuantity = () => {
    return bufferZones.red + bufferZones.yellow;
  };

  const handleOpen = () => {
    setQuantity(calculateDefaultQuantity());
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a PO number with format PO-{product}-{timestamp}
      const timestamp = new Date().getTime();
      const productId = item.product_id || item.sku || 'unknown';
      const poNumber = `PO-${productId.substring(0, 8)}-${timestamp}`;

      // Create a new PO record
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert({
          po_number: poNumber,
          sku: item.product_id || item.sku,
          quantity: parseInt(quantity.toString()),
          status: 'draft',
          order_date: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      // Close dialog and show success message
      setOpen(false);
      toast({
        title: "Purchase Order Created",
        description: `Created PO: ${poNumber} for ${quantity} units`,
      });

      // Call success callback
      onSuccess();
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: "Error",
        description: "Failed to create purchase order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleOpen}>Create PO</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Generate a purchase order for {item.product_id || item.sku}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sku" className="text-right">
                SKU
              </Label>
              <Input
                id="sku"
                value={item.product_id || item.sku || ''}
                className="col-span-3"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="col-span-3"
                min={1}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-sm text-muted-foreground">
                Suggested
              </div>
              <div className="col-span-3 text-sm">
                {calculateDefaultQuantity()} units (Red + Yellow zones)
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Purchase Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
