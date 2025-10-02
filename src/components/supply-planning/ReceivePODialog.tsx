import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ReceivePODialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderedQty: number;
  currentReceivedQty: number;
  onReceive: (receivedQty: number) => Promise<void>;
}

const ReceivePODialog: React.FC<ReceivePODialogProps> = ({
  open,
  onOpenChange,
  orderedQty,
  currentReceivedQty,
  onReceive,
}) => {
  const [receivedQty, setReceivedQty] = useState<number>(orderedQty - currentReceivedQty);
  const [loading, setLoading] = useState(false);

  const handleReceive = async () => {
    if (receivedQty <= 0 || receivedQty > (orderedQty - currentReceivedQty)) return;

    setLoading(true);
    await onReceive(receivedQty);
    setLoading(false);
    onOpenChange(false);
  };

  const pendingQty = orderedQty - currentReceivedQty;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receive Purchase Order</DialogTitle>
          <DialogDescription>
            Enter the quantity received for this purchase order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Ordered</div>
              <div className="font-mono font-semibold">{orderedQty.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Received</div>
              <div className="font-mono font-semibold">{currentReceivedQty.toFixed(0)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Pending</div>
              <div className="font-mono font-semibold text-primary">{pendingQty.toFixed(0)}</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="received-qty">Quantity Receiving Now</Label>
            <Input
              id="received-qty"
              type="number"
              value={receivedQty}
              onChange={(e) => setReceivedQty(Number(e.target.value))}
              min={1}
              max={pendingQty}
              step={1}
            />
            <p className="text-xs text-muted-foreground">
              Maximum: {pendingQty.toFixed(0)} units
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleReceive} 
            disabled={loading || receivedQty <= 0 || receivedQty > pendingQty}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Receive {receivedQty.toFixed(0)} Units
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceivePODialog;
