
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MoreHorizontal, FileText, Truck, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { PurchaseOrderDialog } from './PurchaseOrderDialog';

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

export const PurchaseOrdersTab = () => {
  const { language } = useLanguage();
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: purchaseOrders, isLoading, error, refetch } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PurchaseOrder[];
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline">{getTranslation("supplyPlanning.status.planned", language)}</Badge>;
      case 'ordered':
        return <Badge variant="secondary">{getTranslation("supplyPlanning.status.ordered", language)}</Badge>;
      case 'confirmed':
        return <Badge variant="primary">{getTranslation("supplyPlanning.status.confirmed", language)}</Badge>;
      case 'shipped':
        return <Badge variant="default">{getTranslation("supplyPlanning.status.shipped", language)}</Badge>;
      case 'received':
        return <Badge variant="success">{getTranslation("supplyPlanning.status.received", language)}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p>{getTranslation("inventory.loadingData", language)}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <p>{getTranslation("inventory.errorLoading", language)}</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {getTranslation("supplyPlanning.purchaseOrders", language)}
          </h3>
          <p className="text-sm text-muted-foreground">
            {getTranslation("supplyPlanning.purchaseOrdersDesc", language)}
          </p>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getTranslation("supplyPlanning.poNumber", language)}</TableHead>
              <TableHead>{getTranslation("inventory.sku", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.quantity", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.supplier", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.orderDate", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.deliveryDate", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.status", language)}</TableHead>
              <TableHead className="text-right">{getTranslation("inventory.actions", language)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!purchaseOrders || purchaseOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  {getTranslation("supplyPlanning.noPurchaseOrders", language)}
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
                  <TableCell>{getStatusBadge(po.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {getTranslation("supplyPlanning.actions", language)}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditPO(po)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {getTranslation("common.edit", language)}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          {getTranslation("supplyPlanning.viewDetails", language)}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Truck className="mr-2 h-4 w-4" />
                          {getTranslation("supplyPlanning.trackShipment", language)}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {po.status !== 'received' && (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {getTranslation("supplyPlanning.markAsReceived", language)}
                          </DropdownMenuItem>
                        )}
                        {po.status === 'planned' && (
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="mr-2 h-4 w-4" />
                            {getTranslation("supplyPlanning.cancel", language)}
                          </DropdownMenuItem>
                        )}
                        {(po.status === 'shipped' || po.status === 'confirmed') && (
                          <DropdownMenuItem className="text-amber-600">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            {getTranslation("supplyPlanning.reportIssue", language)}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <PurchaseOrderDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        purchaseOrder={selectedPO}
        onSuccess={() => {
          refetch();
          setDialogOpen(false);
        }}
      />
    </>
  );
};
