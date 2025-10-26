import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoverageItem } from './CoverageTable';
import { ShoppingCart, Calendar, TrendingUp, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CoverageActionDrawerProps {
  item: CoverageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: CoverageItem, quantity: number) => void;
}

export const CoverageActionDrawer: React.FC<CoverageActionDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [orderQty, setOrderQty] = useState(0);

  React.useEffect(() => {
    if (item) {
      setOrderQty(item.suggested_order_qty);
    }
  }, [item]);

  if (!item) return null;

  const targetDoS = 15; // Default target: 15 days
  const projectedNFP = item.nfp + orderQty;
  const projectedDoS = projectedNFP / item.adu;
  const willReachTarget = projectedDoS >= targetDoS;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Create Purchase Order
          </SheetTitle>
          <SheetDescription>
            Review and confirm replenishment order
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Item Details */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-lg">{item.sku}</p>
                <p className="text-sm text-muted-foreground">{item.product_name}</p>
              </div>
              <Badge variant="outline">{item.location_id}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Current NFP</p>
                <p className="text-sm font-bold">{item.nfp.toFixed(0)} units</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Current DoS</p>
                <p className="text-sm font-bold">{item.dos.toFixed(1)} days</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ADU</p>
                <p className="text-sm font-bold">{item.adu.toFixed(1)} units/day</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Lead Time</p>
                <p className="text-sm font-bold">{item.dlt} days</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order-qty">Order Quantity</Label>
              <Input
                id="order-qty"
                type="number"
                value={orderQty}
                onChange={(e) => setOrderQty(Number(e.target.value))}
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground">
                Suggested: {item.suggested_order_qty.toFixed(0)} units (to reach {targetDoS} days)
              </p>
            </div>

            {/* Impact Preview */}
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Impact Preview
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Projected NFP</p>
                  <p className="text-xl font-bold text-primary">{projectedNFP.toFixed(0)}</p>
                  <p className="text-xs text-green-600">+{orderQty.toFixed(0)} units</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Projected DoS</p>
                  <p className="text-xl font-bold text-primary">{projectedDoS.toFixed(1)}</p>
                  <p className="text-xs text-green-600">+{(projectedDoS - item.dos).toFixed(1)} days</p>
                </div>
              </div>

              {willReachTarget ? (
                <div className="flex items-center gap-2 text-green-600 text-xs bg-green-50 p-2 rounded">
                  <div className="h-2 w-2 bg-green-600 rounded-full" />
                  Will reach target coverage of {targetDoS} days
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-600 text-xs bg-yellow-50 p-2 rounded">
                  <div className="h-2 w-2 bg-yellow-600 rounded-full" />
                  Below target. Consider ordering {((targetDoS * item.adu) - item.nfp).toFixed(0)} units
                </div>
              )}
            </div>

            {/* Delivery Information */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Expected arrival: {new Date(Date.now() + item.dlt * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onConfirm(item, orderQty);
                onClose();
              }}
              disabled={orderQty <= 0}
            >
              <Package className="h-4 w-4 mr-2" />
              Confirm Order
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
