import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Truck, Package, Calendar, MapPin, Eye, CheckSquare, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";
import { Shipment, ShipmentItem } from "@/types/inventory/shipmentTypes";
import { useInventoryTransaction } from "@/hooks/useInventoryTransaction";

const mockShipments: Shipment[] = [
  {
    id: "1",
    shipmentNumber: "SHP-001",
    status: "pending",
    origin: "Main Warehouse",
    destination: "Chicago Warehouse",
    scheduledDate: "2023-04-15T00:00:00Z",
    estimatedArrivalDate: "2023-04-18T00:00:00Z",
    notes: "Priority delivery",
    items: [
      {
        id: "1",
        shipmentId: "1",
        sku: "PROD-001",
        quantity: 120
      }
    ]
  },
  {
    id: "2",
    shipmentNumber: "SHP-002",
    status: "in_transit",
    origin: "Main Warehouse",
    destination: "NYC Distribution Center",
    scheduledDate: "2023-04-12T00:00:00Z",
    estimatedArrivalDate: "2023-04-15T00:00:00Z",
    actualArrivalDate: "2023-04-12T10:30:00Z",
    notes: "Contains fragile items",
    items: [
      {
        id: "2",
        shipmentId: "2",
        sku: "PROD-005",
        quantity: 50
      }
    ]
  },
  {
    id: "3",
    shipmentNumber: "SHP-003",
    status: "delivered",
    origin: "Secondary Warehouse",
    destination: "Atlanta Store #42",
    scheduledDate: "2023-04-07T00:00:00Z",
    estimatedArrivalDate: "2023-04-10T00:00:00Z",
    actualArrivalDate: "2023-04-08T14:00:00Z",
    items: [
      {
        id: "3",
        shipmentId: "3",
        sku: "PROD-002",
        quantity: 75
      }
    ]
  }
];

export const ShipmentsTab = () => {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>(mockShipments);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { processTransaction } = useInventoryTransaction();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const t = (key: string) => getTranslation(`supplyPlanning.${key}`, language);

  useEffect(() => {
    let filtered = shipments;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.shipmentNumber.toLowerCase().includes(query) || 
        s.destination.toLowerCase().includes(query) ||
        s.items?.some(item => item.sku.toLowerCase().includes(query))
      );
    }
    
    setFilteredShipments(filtered);
  }, [statusFilter, searchQuery, shipments]);

  const handleCreateShipment = () => {
    setSelectedShipment(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleMarkAsShipped = async (shipment: Shipment) => {
    try {
      const updatedShipments = shipments.map(s => 
        s.id === shipment.id 
          ? { ...s, status: "in_transit" as const, actualArrivalDate: new Date().toISOString() } 
          : s
      );
      setShipments(updatedShipments);
      
      toast({
        title: "Shipment updated",
        description: `Shipment ${shipment.shipmentNumber} has been marked as shipped.`,
      });
      
      if (shipment.items && shipment.items.length > 0) {
        for (const item of shipment.items) {
          await processTransaction({
            sku: item.sku,
            quantity: item.quantity,
            transactionType: 'outbound',
            referenceId: shipment.id,
            referenceType: 'shipment',
            notes: `Marked as shipped: ${shipment.shipmentNumber}`
          });
        }
      }
    } catch (error) {
      console.error("Error marking shipment as shipped:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error updating the shipment.",
      });
    }
  };

  const handleMarkAsDelivered = async (shipment: Shipment) => {
    try {
      const updatedShipments = shipments.map(s => 
        s.id === shipment.id ? { ...s, status: "delivered" as const } : s
      );
      setShipments(updatedShipments);
      
      toast({
        title: "Shipment delivered",
        description: `Shipment ${shipment.shipmentNumber} has been marked as delivered.`,
      });
    } catch (error) {
      console.error("Error marking shipment as delivered:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error updating the shipment.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{t('statusTypes.planned')}</Badge>;
      case "in_transit":
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{t('statusTypes.processing')}</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{t('statusTypes.delivered')}</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">{t('statusTypes.canceled')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">{t('shipments')}</CardTitle>
            <Button onClick={handleCreateShipment}>
              <Truck className="mr-2 h-4 w-4" />
              {t('createShipment')}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{t('shipmentsDesc')}</p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4 gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('search') || "Search shipments..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('selectStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses') || "All Statuses"}</SelectItem>
                <SelectItem value="pending">{t('statusTypes.planned')}</SelectItem>
                <SelectItem value="in_transit">{t('statusTypes.processing')}</SelectItem>
                <SelectItem value="delivered">{t('statusTypes.delivered')}</SelectItem>
                <SelectItem value="cancelled">{t('statusTypes.canceled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredShipments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <p className="mt-2">{t('noShipmentsFound')}</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('shipmentNumber')}</TableHead>
                    <TableHead>{t('destination')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('shipmentDate')}</TableHead>
                    <TableHead className="text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShipments.map((shipment) => (
                    <TableRow key={shipment.id}>
                      <TableCell className="font-medium">{shipment.shipmentNumber}</TableCell>
                      <TableCell>{shipment.destination}</TableCell>
                      <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                      <TableCell>
                        {new Date(shipment.scheduledDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewDetails(shipment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditShipment(shipment)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {shipment.status === "pending" && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleMarkAsShipped(shipment)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                          {shipment.status === "in_transit" && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleMarkAsDelivered(shipment)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckSquare className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditMode 
                  ? t('editShipment')
                  : selectedShipment 
                    ? `${t('shipmentDetails')}: ${selectedShipment.shipmentNumber}`
                    : t('createShipment')}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {selectedShipment && !isEditMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('shipmentNumber')}</Label>
                      <p className="font-medium">{selectedShipment.shipmentNumber}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('status')}</Label>
                      <p>{getStatusBadge(selectedShipment.status)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('destination')}</Label>
                    <p className="font-medium flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      {selectedShipment.destination}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('scheduledDate')}</Label>
                      <p className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        {new Date(selectedShipment.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedShipment.actualArrivalDate && (
                      <div>
                        <Label className="text-xs text-muted-foreground">{t('actualArrivalDate')}</Label>
                        <p className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                          {new Date(selectedShipment.actualArrivalDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {selectedShipment.notes && (
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('notes')}</Label>
                      <p className="text-sm">{selectedShipment.notes}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('items')}</Label>
                    <div className="rounded-md border mt-1">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t('sku')}</TableHead>
                            <TableHead className="text-right">{t('quantity')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedShipment.items?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.sku}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">{t('destination')}</Label>
                    <Input 
                      id="destination" 
                      defaultValue={selectedShipment?.destination || ""} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipDate">{t('shipmentDate')}</Label>
                    <Input 
                      id="shipDate" 
                      type="date" 
                      defaultValue={selectedShipment?.scheduledDate 
                        ? new Date(selectedShipment.scheduledDate).toISOString().split('T')[0] 
                        : new Date().toISOString().split('T')[0]} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">{t('notes')}</Label>
                    <Input 
                      id="notes" 
                      defaultValue={selectedShipment?.notes || ""} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>{t('items')}</Label>
                    <div className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground">
                        {t('itemsWouldBeEditableHere') || "Items would be editable here in a full implementation"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter>
              {!isEditMode && selectedShipment?.status === "pending" && (
                <Button
                  variant="default" 
                  className="mr-auto"
                  onClick={() => {
                    handleMarkAsShipped(selectedShipment);
                    setIsDialogOpen(false);
                  }}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  {t('markAsShipped')}
                </Button>
              )}
              
              {!isEditMode && selectedShipment?.status === "in_transit" && (
                <Button
                  variant="default" 
                  className="mr-auto"
                  onClick={() => {
                    handleMarkAsDelivered(selectedShipment);
                    setIsDialogOpen(false);
                  }}
                >
                  <CheckSquare className="mr-2 h-4 w-4" />
                  {t('markAsDelivered')}
                </Button>
              )}
              
              {isEditMode && (
                <Button 
                  type="submit"
                  onClick={() => {
                    toast({
                      title: selectedShipment ? t('shipmentUpdated') : t('shipmentCreated'),
                      description: selectedShipment 
                        ? `Shipment ${selectedShipment.shipmentNumber} has been updated.`
                        : "New shipment has been created."
                    });
                    setIsDialogOpen(false);
                  }}
                >
                  {selectedShipment ? t('save') || "Save" : t('create') || "Create"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
