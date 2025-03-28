
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
  DialogDescription,
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
import { useToast } from '@/components/ui/use-toast';
import { 
  TruckFront, 
  Plus, 
  PackageCheck, 
  MoreHorizontal, 
  Edit, 
  AlertCircle, 
  FileCheck 
} from 'lucide-react';

type Shipment = {
  id: string;
  shipment_number: string;
  sku: string;
  quantity: number;
  status: string;
  customer?: string;
  ship_date?: string;
  expected_delivery_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  shipping_method?: string;
  tracking_number?: string;
};

export const ShipmentsTab = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [shipDialogOpen, setShipDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [newShipment, setNewShipment] = useState({
    sku: '',
    quantity: 1,
    customer: '',
    notes: '',
    shipping_method: '',
  });
  const { processTransaction, loading: processingTransaction } = useInventoryTransaction();

  const { data: shipments, isLoading, error, refetch } = useQuery({
    queryKey: ['shipments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Shipment[] || [];
    },
  });

  const handleCreateShipment = async () => {
    try {
      // Check if SKU exists and has sufficient inventory
      const { data: inventoryItem, error: inventoryError } = await supabase
        .from('inventory_data')
        .select('on_hand')
        .eq('sku', newShipment.sku)
        .single();

      if (inventoryError) {
        toast({
          variant: 'destructive',
          title: 'SKU not found',
          description: 'Please verify the SKU entered',
        });
        return;
      }

      if (inventoryItem.on_hand < newShipment.quantity) {
        toast({
          variant: 'destructive',
          title: 'Insufficient inventory',
          description: `Only ${inventoryItem.on_hand} units available`,
        });
        return;
      }

      // Create shipment record
      const shipmentNumber = `SHIP-${Date.now()}`;
      const { data, error } = await supabase
        .from('shipments')
        .insert({
          shipment_number: shipmentNumber,
          sku: newShipment.sku,
          quantity: newShipment.quantity,
          customer: newShipment.customer,
          notes: newShipment.notes,
          shipping_method: newShipment.shipping_method,
          status: 'planned',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to create shipment',
        });
        return;
      }

      toast({
        title: 'Shipment Created',
        description: `Shipment ${shipmentNumber} created successfully`,
      });

      refetch();
      setCreateDialogOpen(false);
      // Reset form
      setNewShipment({
        sku: '',
        quantity: 1,
        customer: '',
        notes: '',
        shipping_method: '',
      });
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    }
  };

  const handleShipClick = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShipDialogOpen(true);
  };

  const handleShip = async () => {
    if (!selectedShipment) return;

    const success = await processTransaction({
      sku: selectedShipment.sku,
      quantity: selectedShipment.quantity,
      transactionType: 'outbound',
      referenceId: selectedShipment.id,
      referenceType: 'sales_order',
      notes: `Shipped: ${selectedShipment.shipment_number}`
    });

    if (success) {
      // Update shipment status
      await supabase
        .from('shipments')
        .update({
          status: 'shipped',
          ship_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedShipment.id);

      refetch();
      setShipDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: string, label: string }> = {
      'planned': { variant: 'outline', label: getTranslation("supplyPlanning.statusTypes.planned", language) || 'Planned' },
      'ready': { variant: 'secondary', label: getTranslation("supplyPlanning.statusTypes.ready", language) || 'Ready' },
      'shipped': { variant: 'default', label: getTranslation("supplyPlanning.statusTypes.shipped", language) || 'Shipped' },
      'delivered': { variant: 'outline', label: getTranslation("supplyPlanning.statusTypes.delivered", language) || 'Delivered' }
    };

    const config = statusMap[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
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
              {getTranslation("supplyPlanning.tabs.shipments", language) || "Outbound Shipments"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {getTranslation("supplyPlanning.shipmentsDesc", language) || "Manage outbound shipments and track inventory reduction"}
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)} className="bg-dtwin-medium hover:bg-dtwin-dark">
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
                  <TableCell>{shipment.customer || "-"}</TableCell>
                  <TableCell>
                    {shipment.ship_date 
                      ? format(new Date(shipment.ship_date), 'MMM dd, yyyy')
                      : "-"
                    }
                  </TableCell>
                  <TableCell>{shipment.shipping_method || "-"}</TableCell>
                  <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {shipment.status === 'planned' && (
                          <DropdownMenuItem onClick={() => handleShipClick(shipment)}>
                            <TruckFront className="mr-2 h-4 w-4" />
                            {getTranslation("supplyPlanning.markAsShipped", language) || "Mark as Shipped"}
                          </DropdownMenuItem>
                        )}
                        {shipment.status === 'shipped' && (
                          <DropdownMenuItem>
                            <FileCheck className="mr-2 h-4 w-4" />
                            {getTranslation("supplyPlanning.markAsDelivered", language) || "Mark as Delivered"}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          {getTranslation("common.edit", language)}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AlertCircle className="mr-2 h-4 w-4" />
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

      {/* Create Shipment Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {getTranslation("supplyPlanning.createShipment", language) || "Create Shipment"}
            </DialogTitle>
            <DialogDescription>
              {getTranslation("supplyPlanning.createShipmentDesc", language) || "Create a new outbound shipment"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sku">{getTranslation("common.inventory.sku", language)}</Label>
              <Input 
                id="sku" 
                value={newShipment.sku}
                onChange={(e) => setNewShipment({...newShipment, sku: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">{getTranslation("supplyPlanning.quantity", language)}</Label>
              <Input 
                id="quantity" 
                type="number"
                value={newShipment.quantity}
                onChange={(e) => setNewShipment({...newShipment, quantity: Number(e.target.value)})}
                min={1}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer">{getTranslation("supplyPlanning.customer", language) || "Customer"}</Label>
              <Input 
                id="customer" 
                value={newShipment.customer}
                onChange={(e) => setNewShipment({...newShipment, customer: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shipping_method">{getTranslation("supplyPlanning.method", language) || "Shipping Method"}</Label>
              <Input 
                id="shipping_method" 
                value={newShipment.shipping_method}
                onChange={(e) => setNewShipment({...newShipment, shipping_method: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">{getTranslation("supplyPlanning.notes", language) || "Notes"}</Label>
              <Input 
                id="notes" 
                value={newShipment.notes}
                onChange={(e) => setNewShipment({...newShipment, notes: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              {getTranslation("common.cancel", language) || "Cancel"}
            </Button>
            <Button onClick={handleCreateShipment}>
              {getTranslation("common.create", language) || "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ship Items Dialog */}
      <Dialog open={shipDialogOpen} onOpenChange={setShipDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {getTranslation("supplyPlanning.markAsShipped", language) || "Mark as Shipped"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedShipment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">
                    {getTranslation("supplyPlanning.shipmentNumber", language) || "Shipment #"}
                  </Label>
                  <p>{selectedShipment.shipment_number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    {getTranslation("common.inventory.sku", language)}
                  </Label>
                  <p>{selectedShipment.sku}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-muted-foreground">
                  {getTranslation("supplyPlanning.quantity", language)}
                </Label>
                <p>{selectedShipment.quantity}</p>
              </div>
              
              <div>
                <Label className="text-muted-foreground">
                  {getTranslation("supplyPlanning.customer", language) || "Customer"}
                </Label>
                <p>{selectedShipment.customer || "-"}</p>
              </div>
              
              <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                {getTranslation("supplyPlanning.reduceInventoryWarning", language) || 
                 "This action will reduce inventory levels for the selected SKU."}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShipDialogOpen(false)}>
              {getTranslation("common.cancel", language) || "Cancel"}
            </Button>
            <Button onClick={handleShip} disabled={processingTransaction}>
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
