
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { useInventoryTransaction } from '@/hooks/useInventoryTransaction';
import { 
  Package, 
  Truck, 
  MoreHorizontal, 
  PackageCheck, 
  AlertTriangle, 
  Plus 
} from 'lucide-react';
import { Shipment } from '@/types/inventory/shipmentTypes';

export const ShipmentsTab = () => {
  const { language } = useLanguage();
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [createShipmentOpen, setCreateShipmentOpen] = useState(false);
  const [newShipment, setNewShipment] = useState({
    sku: '',
    quantity: 1,
    customer: '',
    shipping_method: 'standard',
    notes: ''
  });
  const { processTransaction, loading: processingTransaction } = useInventoryTransaction();

  const { data: shipments, isLoading, error, refetch } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      // Use any to override the type checking temporarily
      // since the table might not exist yet in the supabase types
      const { data, error } = await (supabase as any)
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Shipment[];
    },
  });

  const handleShipmentCreate = async () => {
    if (!newShipment.sku || !newShipment.quantity || !newShipment.customer) return;

    try {
      // Generate a shipment number
      const shipmentNumber = `SHP-${Date.now().toString().slice(-6)}`;
      
      // Create the shipment
      const { data, error } = await (supabase as any)
        .from('shipments')
        .insert({
          shipment_number: shipmentNumber,
          sku: newShipment.sku,
          quantity: newShipment.quantity,
          customer: newShipment.customer,
          ship_date: new Date().toISOString(),
          status: 'pending',
          shipping_method: newShipment.shipping_method,
          notes: newShipment.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;

      // Process inventory reduction
      await processTransaction({
        sku: newShipment.sku,
        quantity: newShipment.quantity,
        transactionType: 'outbound',
        referenceId: data[0].id,
        referenceType: 'shipment',
        notes: `Outbound shipment: ${shipmentNumber}`
      });

      refetch();
      setCreateShipmentOpen(false);
      setNewShipment({
        sku: '',
        quantity: 1,
        customer: '',
        shipping_method: 'standard',
        notes: ''
      });
    } catch (err) {
      console.error("Error creating shipment:", err);
    }
  };

  const handleStatusUpdate = async (shipment: Shipment, newStatus: 'shipped' | 'delivered') => {
    try {
      await (supabase as any)
        .from('shipments')
        .update({
          status: newStatus,
          ...(newStatus === 'shipped' && { ship_date: new Date().toISOString() }),
          ...(newStatus === 'delivered' && { delivery_date: new Date().toISOString() }),
          updated_at: new Date().toISOString()
        })
        .eq('id', shipment.id);

      refetch();
    } catch (err) {
      console.error("Error updating shipment status:", err);
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
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">
              {getTranslation("supplyPlanning.tabs.shipments", language) || "Shipments"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getTranslation("supplyPlanning.shipmentsDesc", language) || "Manage outbound shipments and track inventory reduction"}
            </p>
          </div>
          <Button onClick={() => setCreateShipmentOpen(true)} className="bg-dtwin-medium hover:bg-dtwin-dark">
            <Plus className="mr-2 h-4 w-4" />
            {getTranslation("supplyPlanning.createShipment", language) || "Create Shipment"}
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getTranslation("supplyPlanning.shipmentNumber", language) || "Shipment #"}</TableHead>
              <TableHead>{getTranslation("common.inventory.sku", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.quantity", language)}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.customer", language) || "Customer"}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.shipDate", language) || "Ship Date"}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.method", language) || "Method"}</TableHead>
              <TableHead>{getTranslation("supplyPlanning.status", language)}</TableHead>
              <TableHead className="text-right">{getTranslation("supplyPlanning.actions", language)}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!shipments || shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  {getTranslation("supplyPlanning.noShipments", language) || "No shipments found"}
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.shipment_number}</TableCell>
                  <TableCell>{shipment.sku}</TableCell>
                  <TableCell>{shipment.quantity}</TableCell>
                  <TableCell>{shipment.customer}</TableCell>
                  <TableCell>
                    {shipment.ship_date 
                      ? format(new Date(shipment.ship_date), 'MMM dd, yyyy')
                      : "-"
                    }
                  </TableCell>
                  <TableCell>{shipment.shipping_method || "Standard"}</TableCell>
                  <TableCell>
                    <Badge variant={
                      shipment.status === 'delivered' 
                        ? 'outline' 
                        : shipment.status === 'shipped' 
                          ? 'default'
                          : 'secondary'
                    }>
                      {shipment.status}
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
                        {shipment.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(shipment, 'shipped')}>
                            <Truck className="mr-2 h-4 w-4" />
                            {getTranslation("supplyPlanning.markAsShipped", language) || "Mark as Shipped"}
                          </DropdownMenuItem>
                        )}
                        {shipment.status === 'shipped' && (
                          <DropdownMenuItem onClick={() => handleStatusUpdate(shipment, 'delivered')}>
                            <PackageCheck className="mr-2 h-4 w-4" />
                            {getTranslation("supplyPlanning.markAsDelivered", language) || "Mark as Delivered"}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          {getTranslation("supplyPlanning.issueAlert", language) || "Issue Alert"}
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

      <Dialog open={createShipmentOpen} onOpenChange={setCreateShipmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {getTranslation("supplyPlanning.createShipment", language) || "Create Shipment"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {getTranslation("supplyPlanning.createShipmentDesc", language) || "Create a new outbound shipment"}
            </p>
            
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={newShipment.sku}
                onChange={(e) => setNewShipment({...newShipment, sku: e.target.value})}
                placeholder="Enter SKU"
              />
            </div>
            
            <div>
              <Label htmlFor="quantity">{getTranslation("supplyPlanning.quantity", language)}</Label>
              <Input
                id="quantity"
                type="number"
                value={newShipment.quantity}
                onChange={(e) => setNewShipment({...newShipment, quantity: parseInt(e.target.value)})}
                min={1}
              />
            </div>
            
            <div>
              <Label htmlFor="customer">{getTranslation("supplyPlanning.customer", language) || "Customer"}</Label>
              <Input
                id="customer"
                value={newShipment.customer}
                onChange={(e) => setNewShipment({...newShipment, customer: e.target.value})}
                placeholder="Customer name"
              />
            </div>
            
            <div>
              <Label htmlFor="shipping-method">{getTranslation("supplyPlanning.method", language) || "Shipping Method"}</Label>
              <Select 
                value={newShipment.shipping_method}
                onValueChange={(value) => setNewShipment({...newShipment, shipping_method: value})}
              >
                <SelectTrigger id="shipping-method">
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">{getTranslation("supplyPlanning.notes", language)}</Label>
              <Textarea
                id="notes"
                value={newShipment.notes}
                onChange={(e) => setNewShipment({...newShipment, notes: e.target.value})}
                placeholder="Optional notes"
              />
            </div>
            
            <p className="text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3 inline-block mr-1" />
              {getTranslation("supplyPlanning.reduceInventoryWarning", language) || 
                "This action will reduce inventory levels for the selected SKU."}
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateShipmentOpen(false)}>
              {getTranslation("common.cancel", language) || "Cancel"}
            </Button>
            <Button 
              onClick={handleShipmentCreate} 
              disabled={!newShipment.sku || !newShipment.quantity || !newShipment.customer || processingTransaction}
            >
              {processingTransaction
                ? getTranslation("supplyPlanning.processing", language) || "Processing..." 
                : getTranslation("supplyPlanning.confirmShipment", language) || "Confirm Shipment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
