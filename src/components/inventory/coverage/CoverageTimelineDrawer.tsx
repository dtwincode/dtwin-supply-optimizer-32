import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoverageItem } from './CoverageTable';
import { Calendar, TrendingDown, Package } from 'lucide-react';
import { SupplyChainImpact } from './SupplyChainImpact';

interface CoverageTimelineDrawerProps {
  item: CoverageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmOrder: (item: CoverageItem, quantity: number) => void;
}

export const CoverageTimelineDrawer: React.FC<CoverageTimelineDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmOrder
}) => {
  const [adjustedQty, setAdjustedQty] = useState(0);

  React.useEffect(() => {
    if (item) {
      setAdjustedQty(item.suggested_order_qty);
    }
  }, [item]);

  if (!item) return null;

  // Calculate projected coverage with adjusted quantity
  const projectedNFP = item.nfp + adjustedQty;
  const projectedDoS = projectedNFP / item.adu;

  // Generate 14-day projection
  const generateTimeline = () => {
    const days: Array<{ day: number; nfp: number; demand: number; supply: number }> = [];
    let runningNFP = item.nfp;
    
    for (let i = 0; i <= 14; i++) {
      // Simulate daily consumption
      runningNFP -= item.adu;
      
      // Simulate incoming order on DLT
      if (i === item.dlt && adjustedQty > 0) {
        runningNFP += adjustedQty;
      }
      
      days.push({
        day: i,
        nfp: runningNFP,
        demand: item.adu,
        supply: (i === item.dlt && adjustedQty > 0) ? adjustedQty : 0,
      });
    }
    
    return days;
  };

  const timeline = generateTimeline();
  const maxValue = Math.max(...timeline.map(d => Math.max(d.nfp, d.supply, d.demand)));

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[60vh]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline Analysis - {item.sku}
          </SheetTitle>
          <SheetDescription>
            {item.product_name} at {item.location_id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Current vs Projected Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Current NFP</p>
              <p className="text-2xl font-bold">{item.nfp.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">{item.dos.toFixed(1)} days</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Projected NFP</p>
              <p className="text-2xl font-bold text-primary">{projectedNFP.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">{projectedDoS.toFixed(1)} days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Improvement</p>
              <p className="text-2xl font-bold text-green-600">
                +{(projectedDoS - item.dos).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">days coverage</p>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm font-medium mb-3">14-Day Projection</p>
            <div className="relative h-32">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-t border-muted-foreground/10" />
                ))}
              </div>
              
              {/* Timeline bars */}
              <div className="absolute inset-0 flex items-end justify-between gap-1">
                {timeline.map((day, idx) => {
                  const nfpHeight = (Math.max(0, day.nfp) / maxValue) * 100;
                  const supplyHeight = (day.supply / maxValue) * 100;
                  const demandHeight = (day.demand / maxValue) * 100;
                  
                  const isBreached = day.nfp < (item.dlt * item.adu);
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-0.5">
                      {/* Supply indicator */}
                      {day.supply > 0 && (
                        <div 
                          className="w-full bg-green-500 rounded-t transition-all"
                          style={{ height: `${supplyHeight}%` }}
                        />
                      )}
                      {/* NFP bar */}
                      <div 
                        className={`w-full rounded-t transition-all ${
                          isBreached ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ height: `${nfpHeight}%` }}
                      />
                      {/* Day label */}
                      <p className="text-[8px] text-muted-foreground mt-1">D{day.day}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span>NFP</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Incoming Supply</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span>Below DLT</span>
              </div>
            </div>
          </div>

          {/* Order Quantity Adjustment */}
          <div className="space-y-3">
            <Label htmlFor="adjusted-qty">Adjust Order Quantity</Label>
            <div className="flex gap-2">
              <Input
                id="adjusted-qty"
                type="number"
                value={adjustedQty}
                onChange={(e) => setAdjustedQty(Number(e.target.value))}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  onConfirmOrder(item, adjustedQty);
                  onClose();
                }}
                className="w-32"
                disabled={adjustedQty <= 0}
              >
                <Package className="h-4 w-4 mr-2" />
                Confirm Order
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              ETA: {new Date(Date.now() + item.dlt * 24 * 60 * 60 * 1000).toLocaleDateString()}
              {' '}({item.dlt} days from now)
            </p>
          </div>

          {/* Supply Chain Impact - Multi-Echelon View */}
          <SupplyChainImpact item={item} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
