
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
import { InventoryItem } from "@/types/inventory";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreatePODialogProps {
  item: InventoryItem;
  bufferZones: {
    red: number;
    yellow: number;
    green: number;
  };
  onSuccess?: () => void;
}

export function CreatePODialog({ item, bufferZones, onSuccess }: CreatePODialogProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getTotalBuffer = () => {
    return bufferZones.red + bufferZones.yellow + bufferZones.green;
  };

  const calculateSuggestedOrderQuantity = () => {
    const totalBuffer = getTotalBuffer();
    const netFlowPosition = item.onHand || 0;
    let suggestedQuantity = Math.max(0, totalBuffer - netFlowPosition);
    
    // Round to nearest 5
    suggestedQuantity = Math.ceil(suggestedQuantity / 5) * 5;
    
    return suggestedQuantity;
  };

  // Set initial quantity based on buffer calculation
  useState(() => {
    setQuantity(calculateSuggestedOrderQuantity());
  });

  const handleSubmit = async () => {
    if (!quantity || quantity <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid order quantity",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to create the purchase order
      // For now, we'll just simulate success
      
      toast({
        title: "Purchase order created",
        description: `Order for ${quantity} units of ${item.sku || item.product_id} has been created.`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error creating purchase order",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Create PO
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Create a new purchase order for {item.sku || item.product_id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">
              SKU
            </Label>
            <Input id="sku" value={item.sku || item.product_id} className="col-span-3" readOnly />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Suggestion</Label>
            <div className="col-span-3 text-sm text-muted-foreground">
              Suggested order: {calculateSuggestedOrderQuantity()} units
              (based on buffer levels)
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
