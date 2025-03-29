import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useInventoryTransaction } from '@/hooks/useInventoryTransaction';
import { Truck, PackageCheck, MoreHorizontal, AlertTriangle } from 'lucide-react';

type PurchaseOrder = {
  id: string;
  po_number: string;
  sku: string;
  quantity: number;
  status: string;
  supplier: string | null;
  order_date: string;
  expected_delivery_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const ReceivingTab = () => {
  const { language } = useLanguage();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [receiveQuantity, setReceiveQuantity] = useState<number>(0);
  const { processTransaction, loading: processingTransaction } = useInventoryTransaction();

  const { data: purchaseOrders, isLoading, error, refetch } = useQuery({
    queryKey: ['purchase-orders-for-receiving'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .in('status', ['ordered', 'confirmed', 'shipped'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PurchaseOrder[];
    },
  });

  const handleReceiveClick = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setReceiveQuantity(po.quantity);
    setReceiveDialogOpen(true);
  };

  const handleReceiveOrder = async (order: any) => {
    if (!order) return;
    
    const success = await processTransaction({
      product_id: order.product_id,
      quantity: parseInt(order.quantity),
      transactionType: 'inbound',
      referenceId: order.po_number,
      referenceType: 'purchase_order',
      notes: `Received PO: ${order.po_number}`
    });

    if (success) {
      await supabase
        .from('purchase_orders')
        .update({
          status: 'received',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedPO.id);

      refetch();
      setReceiveDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p>{getTranslation("common.inventory.loadingData", language)}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p>{getTranslation("common.inventory.errorLoading", language)}</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {getTranslation("supplyPlanning.tabs.receiving", language) || "Receiving"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {getTranslation("supplyPlanning.receivingDesc", language) || "Process inbound shipments and update inventory"}
          </p>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getTranslation("supplyPlanning.poNumber", language)}</TableHead>
              <TableHead>{getTranslation("common.inventory.sku", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.quantity", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.supplier", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.orderDate", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.deliveryDate", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.status", language)}</TableHead>
              <TableHead className="text-right">{getTranslation("supplyPlanning.actions", language)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!purchaseOrders || purchaseOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  {getTranslation("supplyPlanning.noPurchaseOrdersToReceive", language) || "No purchase orders available for receiving"}
                </TableCell>
              </TableRow>
            ) : (
              purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.po_number}</TableCell>
                  <TableCell>{po.sku}</TableCell>
                  <TableCell>{po.quantity}</TableCell>
                  <TableCell>{po.supplier || "-"}</TableCell>
                  <TableCell>
                    {po.order_date && format(new Date(po.order_date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {po.expected_delivery_date 
                      ? format(new Date(po.expected_delivery_date), 'MMM dd, yyyy')
                      : "-"
                    }
                  </TableCell>
                  <TableCell>
                    <Badge variant={po.status === 'shipped' ? 'default' : 'outline'}>
                      {po.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleReceiveClick(po)}>
                          <PackageCheck className="mr-2 h-4 w-4" />
                          {getTranslation("supplyPlanning.receiveItems", language) || "Receive Items"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="mr-2 h-4 w-4" />
                          {getTranslation("supplyPlanning.trackShipment", language)}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          {getTranslation("supplyPlanning.reportIssue", language)}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {getTranslation("supplyPlanning.receiveItems", language) || "Receive Items"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPO && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">
                    {getTranslation("supplyPlanning.poNumber", language)}
                  </Label>
                  <p>{selectedPO.po_number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    {getTranslation("common.inventory.sku", language)}
                  </Label>
                  <p>{selectedPO.sku}</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="quantity">
                  {getTranslation("supplyPlanning.quantityToReceive", language) || "Quantity to Receive"}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={receiveQuantity}
                  onChange={(e) => setReceiveQuantity(Number(e.target.value))}
                  max={selectedPO.quantity}
                  min={1}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {getTranslation("supplyPlanning.originalQuantity", language) || "Original quantity"}: {selectedPO.quantity}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>
              {getTranslation("common.cancel", language) || "Cancel"}
            </Button>
            <Button onClick={handleReceiveOrder} disabled={processingTransaction}>
              {processingTransaction 
                ? getTranslation("supplyPlanning.processing", language) || "Processing..." 
                : getTranslation("supplyPlanning.confirmReceive", language) || "Confirm Receipt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
