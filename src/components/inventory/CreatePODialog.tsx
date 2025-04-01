
import { useState } from "react";
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
import { InventoryItem, BufferZones } from "@/types/inventory";
import { calculateOrderQuantity } from "@/utils/inventoryUtils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreatePODialogProps {
  item: InventoryItem;
  bufferZones: BufferZones;
  onSuccess?: () => void;
}

export function CreatePODialog({ item, bufferZones, onSuccess }: CreatePODialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [poNumber, setPoNumber] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOpen = () => {
    // Calculate recommended order quantity
    const netFlowPosition = 
      (item.onHand || item.currentStock || 0) + 
      (item.onOrder || 0) - 
      (item.qualifiedDemand || 0);
    
    const recommendedQty = calculateOrderQuantity(
      netFlowPosition,
      bufferZones,
      item.minimumOrderQuantity
    );
    
    setQuantity(recommendedQty);
    setPoNumber(`PO-${item.sku}-${new Date().getTime().toString().substr(-6)}`);
    setIsOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (!poNumber || quantity <= 0) {
        toast({
          title: "Invalid Input",
          description: "Please provide a valid PO number and quantity",
          variant: "destructive",
        });
        return;
      }
      
      // Create purchase order in database
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert({
          po_number: poNumber,
          sku: item.sku,
          quantity: quantity,
          status: 'draft',
          order_date: new Date().toISOString(),
          created_by: 'system'
        });
      
      if (error) throw error;
      
      toast({
        title: "Purchase Order Created",
        description: `Successfully created PO ${poNumber} for ${quantity} units of ${item.sku}`,
      });
      
      setIsOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleOpen}>
          Create PO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Create a new purchase order for {item.sku} at {item.location}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="poNumber" className="text-right">
              PO Number
            </Label>
            <Input
              id="poNumber"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className="col-span-3"
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
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
