import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Clock, AlertTriangle, TrendingUp } from "lucide-react";

interface OnOrderItem {
  product_id: string;
  location_id: string;
  qty_on_order: number;
  po_count?: number;
  oldest_po_days?: number;
  avg_po_age_days?: number;
}

interface PODetail {
  id: string;
  product_id: string;
  location_id: string;
  ordered_qty: number;
  received_qty: number;
  remaining_qty: number;
  order_date: string;
  expected_date: string | null;
  days_open: number;
  status: string;
}

export function OnOrderAnalysis() {
  const [onOrderData, setOnOrderData] = useState<OnOrderItem[]>([]);
  const [poDetails, setPODetails] = useState<PODetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOnOrder, setTotalOnOrder] = useState(0);
  const [totalPOs, setTotalPOs] = useState(0);
  const [avgAge, setAvgAge] = useState(0);

  useEffect(() => {
    loadOnOrderData();
  }, []);

  const loadOnOrderData = async () => {
    try {
      setLoading(true);

      // Fetch from onorder_view (optimized aggregated view)
      const { data: onOrderView, error: onOrderError } = await supabase
        .from('onorder_view' as any)
        .select('*')
        .order('qty_on_order', { ascending: false })
        .limit(50);

      if (onOrderError) throw onOrderError;

      // Fetch detailed PO data from open_pos table
      const { data: openPOs, error: poError } = await supabase
        .from('open_pos')
        .select('*')
        .in('status', ['OPEN', 'IN_TRANSIT'])
        .order('order_date', { ascending: true });

      if (poError) throw poError;

      // Process PO details with aging calculation
      const processedPOs: PODetail[] = (openPOs || []).map((po: any) => {
        const orderDate = new Date(po.order_date);
        const today = new Date();
        const daysOpen = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        const remainingQty = (po.ordered_qty || 0) - (po.received_qty || 0);

        return {
          id: po.id,
          product_id: po.product_id,
          location_id: po.location_id,
          ordered_qty: po.ordered_qty || 0,
          received_qty: po.received_qty || 0,
          remaining_qty: remainingQty,
          order_date: po.order_date,
          expected_date: po.expected_date,
          days_open: daysOpen,
          status: po.status
        };
      });

      setPODetails(processedPOs);

      // Enrich onorder_view data with PO counts and aging
      const enrichedData = (onOrderView || []).map((item: any) => {
        const relatedPOs = processedPOs.filter(
          po => po.product_id === item.product_id && po.location_id === item.location_id
        );

        const poCount = relatedPOs.length;
        const oldestPO = relatedPOs.length > 0 
          ? Math.max(...relatedPOs.map(po => po.days_open))
          : 0;
        const avgAge = relatedPOs.length > 0
          ? Math.round(relatedPOs.reduce((sum, po) => sum + po.days_open, 0) / relatedPOs.length)
          : 0;

        return {
          product_id: item.product_id,
          location_id: item.location_id,
          qty_on_order: item.qty_on_order || 0,
          po_count: poCount,
          oldest_po_days: oldestPO,
          avg_po_age_days: avgAge
        };
      });

      setOnOrderData(enrichedData);

      // Calculate summary metrics
      const totalQty = enrichedData.reduce((sum: number, item: OnOrderItem) => sum + item.qty_on_order, 0);
      const totalPOCount = processedPOs.length;
      const overallAvgAge = processedPOs.length > 0
        ? Math.round(processedPOs.reduce((sum, po) => sum + po.days_open, 0) / processedPOs.length)
        : 0;

      setTotalOnOrder(totalQty);
      setTotalPOs(totalPOCount);
      setAvgAge(overallAvgAge);

    } catch (error) {
      console.error('Error loading on-order data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgeStatus = (days: number) => {
    if (days >= 30) return { label: 'Overdue', variant: 'destructive' as const, icon: AlertTriangle };
    if (days >= 14) return { label: 'Aging', variant: 'warning' as const, icon: Clock };
    return { label: 'Normal', variant: 'default' as const, icon: TrendingUp };
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total On Order</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOnOrder.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">units across all products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open POs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPOs}</div>
            <p className="text-xs text-muted-foreground">purchase orders in transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg PO Age</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAge} days</div>
            <p className="text-xs text-muted-foreground">average days since order</p>
          </CardContent>
        </Card>
      </div>

      {/* On-Order Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>On-Order Inventory Analysis</CardTitle>
          <CardDescription>
            Product-location pairs with open purchase orders from onorder_view (showing top 50)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Location ID</TableHead>
                <TableHead className="text-right">Qty On Order</TableHead>
                <TableHead className="text-center">Open POs</TableHead>
                <TableHead className="text-center">Oldest PO</TableHead>
                <TableHead className="text-center">Avg Age</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {onOrderData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No on-order inventory found
                  </TableCell>
                </TableRow>
              ) : (
                onOrderData.map((item, idx) => {
                  const ageStatus = getAgeStatus(item.oldest_po_days || 0);
                  const StatusIcon = ageStatus.icon;

                  return (
                    <TableRow key={`${item.product_id}-${item.location_id}-${idx}`}>
                      <TableCell className="font-mono text-sm">{item.product_id}</TableCell>
                      <TableCell className="font-mono text-sm">{item.location_id}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.qty_on_order.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{item.po_count || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.oldest_po_days ? `${item.oldest_po_days} days` : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.avg_po_age_days ? `${item.avg_po_age_days} days` : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={ageStatus.variant} className="gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {ageStatus.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
