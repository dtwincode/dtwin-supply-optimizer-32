import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoverageItem } from './CoverageTable';
import { ShoppingCart, Calendar, TrendingUp, Package, Truck, DollarSign, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CoverageActionDrawerProps {
  item: CoverageItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: CoverageItem, quantity: number) => void;
}

interface SupplierData {
  vendor_name: string;
  unit_cost: number;
  lead_time_days: number;
  on_time_delivery_rate: number;
  payment_terms: string;
}

export const CoverageActionDrawer: React.FC<CoverageActionDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [orderQty, setOrderQty] = useState(0);
  const [supplierData, setSupplierData] = useState<SupplierData | null>(null);
  const [loadingSupplier, setLoadingSupplier] = useState(false);

  const loadSupplierData = async (productId: string, fallbackDlt: number) => {
    setLoadingSupplier(true);
    try {
      // Fetch supplier contract data
      const { data: contractData, error: contractError } = await supabase
        .from('supplier_contracts')
        .select(`
          unit_cost,
          lead_time_days,
          payment_terms,
          supplier_id
        `)
        .eq('product_id', productId)
        .order('contract_start_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (contractError) {
        console.error('Error fetching contract:', contractError);
        throw contractError;
      }

      // If no contract found, use fallback data
      if (!contractData) {
        setSupplierData({
          vendor_name: 'No Supplier Assigned',
          unit_cost: 0,
          lead_time_days: fallbackDlt,
          on_time_delivery_rate: 0.95,
          payment_terms: 'N/A'
        });
        return;
      }

      // Fetch vendor name
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendor_master')
        .select('vendor_name')
        .eq('vendor_id', contractData.supplier_id)
        .maybeSingle();

      if (vendorError) {
        console.error('Error fetching vendor:', vendorError);
      }

      // Fetch supplier performance
      const { data: perfData, error: perfError } = await supabase
        .from('supplier_performance')
        .select('on_time_delivery_rate')
        .eq('supplier_id', contractData.supplier_id)
        .maybeSingle();

      if (perfError) {
        console.error('Error fetching performance:', perfError);
      }

      setSupplierData({
        vendor_name: vendorData?.vendor_name ?? 'Unknown Vendor',
        unit_cost: contractData.unit_cost ?? 0,
        lead_time_days: contractData.lead_time_days ?? fallbackDlt,
        on_time_delivery_rate: perfData?.on_time_delivery_rate ?? 0.95,
        payment_terms: contractData.payment_terms ?? 'N/A'
      });
    } catch (error) {
      console.error('Error loading supplier data:', error);
      setSupplierData(null);
    } finally {
      setLoadingSupplier(false);
    }
  };

  useEffect(() => {
    if (item) {
      setOrderQty(item.suggested_order_qty);
      loadSupplierData(item.product_id, item.dlt);
    }
  }, [item]);

  if (!item) return null;

  // Use TOG (Top of Green) as target, fallback to 15 days
  const targetNFP = item.tog || (15 * item.adu);
  const targetDoS = targetNFP / item.adu;
  const projectedNFP = item.nfp + orderQty;
  const projectedDoS = projectedNFP / item.adu;
  const willReachTarget = projectedNFP >= targetNFP;

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
                Suggested: {item.suggested_order_qty.toFixed(0)} units (to reach TOG: {targetDoS.toFixed(1)} days)
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
                  ✓ Will reach TOG (Top of Green Zone)
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-600 text-xs bg-yellow-50 p-2 rounded">
                  <div className="h-2 w-2 bg-yellow-600 rounded-full" />
                  Below TOG. Consider ordering {(targetNFP - item.nfp).toFixed(0)} units
                </div>
              )}
              
              {/* Buffer Zone Reference */}
              {(item.tor || item.toy || item.tog) && (
                <div className="text-xs text-muted-foreground border-t pt-2 mt-2">
                  <p className="font-medium mb-1">Buffer Zones:</p>
                  <div className="flex gap-3">
                    {item.tor && <span>🔴 TOR: {item.tor.toFixed(0)}</span>}
                    {item.toy && <span>🟡 TOY: {item.toy.toFixed(0)}</span>}
                    {item.tog && <span>🟢 TOG: {item.tog.toFixed(0)}</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Supplier Information */}
            {supplierData && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Supplier Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Vendor</p>
                      <p className="font-semibold">{supplierData.vendor_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Lead Time</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {supplierData.lead_time_days} days
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Unit Cost</p>
                      <p className="font-semibold flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {supplierData.unit_cost.toFixed(2)} SAR
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Cost</p>
                      <p className="font-bold text-primary">
                        {(supplierData.unit_cost * orderQty).toFixed(2)} SAR
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">On-Time Delivery Rate:</span>
                      <Badge variant={supplierData.on_time_delivery_rate >= 0.9 ? "outline" : "destructive"} className={supplierData.on_time_delivery_rate >= 0.9 ? "border-green-500 text-green-700" : ""}>
                        {(supplierData.on_time_delivery_rate * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Payment Terms:</span>
                      <span className="font-medium">{supplierData.payment_terms}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
