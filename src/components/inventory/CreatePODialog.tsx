
import { useState } from 'react';
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
import { InventoryItem } from "@/types/inventory";

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
  const [quantity, setQuantity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const suggestedQuantity = Math.max(
    0,
    Math.round(bufferZones.red + bufferZones.yellow + bufferZones.green - (item.onHand || 0))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      toast({
        title: "Invalid quantity",
        description: "Please enter a valid quantity greater than zero.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Purchase Order Created",
        description: `Created PO for ${quantity} units of ${item.sku || item.product_id}`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      setOpen(false);
      setQuantity("");
    } catch (error) {
      console.error("Error creating PO:", error);
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
        <Button variant="outline" size="sm">Create PO</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Create a new purchase order for {item.sku || item.product_id}.
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
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Suggested: ${suggestedQuantity}`}
                className="col-span-3"
                min="1"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-sm text-muted-foreground">
                Suggested
              </div>
              <div className="col-span-3 text-sm text-muted-foreground">
                {suggestedQuantity} units (to refill buffer)
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create PO"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
