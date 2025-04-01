
import React, { useState } from "react";
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
import { InventoryItem } from "@/types/inventory";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

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

export function CreatePODialog({ item, bufferZones, onSuccess }: CreatePODialogProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const suggestedQuantity = Math.max(
    bufferZones.red + bufferZones.yellow + bufferZones.green - (item.onHand || item.quantity_on_hand || 0),
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity) {
      toast({
        title: "Quantity required",
        description: "Please enter a quantity for the purchase order",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique PO number
      const poNumber = `PO-${item.product_id}-${Date.now()}`;
      
      // Create the purchase order in the database
      const { error } = await supabase
        .from("purchase_orders")
        .insert({
          po_number: poNumber,
          sku: item.sku || item.product_id,
          quantity: parseInt(quantity),
          status: "draft",
          order_date: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Purchase order created",
        description: `Purchase order ${poNumber} has been created successfully`,
      });
      
      setOpen(false);
      onSuccess();
      
    } catch (error) {
      console.error("Error creating purchase order:", error);
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
        <Button size="sm">Create PO</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Create a purchase order for {item.sku || item.product_id}
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
                value={item.sku || item.product_id || ""}
                readOnly
                className="col-span-3 bg-muted"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suggestedQty" className="text-right">
                Suggested Qty
              </Label>
              <Input
                id="suggestedQty"
                value={suggestedQuantity}
                className="col-span-3 bg-muted"
                readOnly
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity *
              </Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                className="col-span-3"
                placeholder="Enter quantity"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={item.location || item.location_id || ""}
                readOnly
                className="col-span-3 bg-muted"
              />
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
}
