import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CoverageItem } from './CoverageTable';
import { Calendar, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import { SupplyChainImpact } from './SupplyChainImpact';
import { ProjectionToggle } from './ProjectionToggle';
import { DailyProjectionTable } from './DailyProjectionTable';
import { WeeklyProjectionTable } from './WeeklyProjectionTable';
import { useProjectionData } from '@/hooks/useProjectionData';
import { isWeekend, getDayOfWeek } from '@/utils/timeUtils';

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
  const [view, setView] = useState<'chart' | 'table'>('table');
  const [period, setPeriod] = useState<'daily' | 'weekly'>('daily');
  
  // Fetch projection data
  const { dailyProjections, weeklyProjections, isLoading } = useProjectionData({
    productId: item?.product_id || '',
    locationId: item?.location_id || '',
    enabled: isOpen && !!item,
  });

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
  const maxNfp = Math.max(...timeline.map(d => d.nfp));

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Coverage Timeline Analysis
              </SheetTitle>
              <SheetDescription>
                14-day projection for {item.sku} at {item.location_id}
              </SheetDescription>
            </div>
            <ProjectionToggle
              view={view}
              onViewChange={setView}
              period={period}
              onPeriodChange={setPeriod}
            />
          </div>
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

          {/* Projection View */}
          {view === 'chart' ? (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">14-Day Projection</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-primary rounded"></div>
                        <span>NFP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Supply</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <span>Demand</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline bars */}
                  <div className="space-y-1">
                    {timeline.map((day) => {
                      const isWeekendDay = isWeekend(day.day);
                      const dayOfWeek = getDayOfWeek(day.day);
                      const isWeekStart = day.day % 7 === 0;
                      
                      return (
                        <div key={day.day} className="space-y-1">
                          {isWeekStart && day.day > 0 && (
                            <div className="flex items-center gap-2 mt-2 mb-1">
                              <Separator className="flex-1" />
                              <span className="text-xs font-medium text-muted-foreground">
                                Week {Math.floor(day.day / 7) + 1}
                              </span>
                              <Separator className="flex-1" />
                            </div>
                          )}
                          <div className={`flex items-center gap-2 ${isWeekendDay ? 'bg-muted/30 rounded px-2 py-1' : ''}`}>
                            <span className="text-xs w-16 text-muted-foreground">
                              {day.day === 0 ? 'Today' : `Day ${day.day}`}
                              <br />
                              <span className="text-[10px]">{dayOfWeek}</span>
                            </span>
                            <div className="flex-1 h-8 bg-muted rounded-sm relative overflow-hidden">
                              {/* NFP Bar */}
                              <div
                                className={`absolute left-0 top-0 h-full transition-all ${
                                  day.nfp < item.dlt * item.adu ? 'bg-destructive' : 'bg-primary'
                                }`}
                                style={{ width: `${Math.max(0, Math.min(100, (day.nfp / maxNfp) * 100))}%` }}
                              />
                              {/* Supply indicator */}
                              {day.supply > 0 && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                                  +{day.supply.toFixed(0)}
                                </div>
                              )}
                              {/* Demand indicator */}
                              {day.demand > 0 && (
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                                  -{day.demand.toFixed(0)}
                                </div>
                              )}
                            </div>
                            <span className="text-xs w-12 text-right font-medium">
                              {day.nfp.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              {isLoading ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">Loading projection data...</div>
                  </CardContent>
                </Card>
              ) : period === 'daily' ? (
                <DailyProjectionTable projections={dailyProjections} />
              ) : (
                <WeeklyProjectionTable projections={weeklyProjections} />
              )}
            </div>
          )}

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
