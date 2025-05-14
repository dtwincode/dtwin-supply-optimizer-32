import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useInventory } from "@/hooks/useInventory";
import { useToast } from "@/hooks/use-toast";
import { useInventoryTransaction } from "@/hooks/useInventoryTransaction";

interface PurchaseOrder {
  id: string;
  sku: string;
  quantity: number;
  status: 'planned' | 'ordered' | 'received' | 'cancelled';
  supplier: string;
  orderDate: string;
  expectedDeliveryDate: Date;
  createdBy: string;
}

// Mock purchase orders for demonstration
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    sku: "SKU001",
    quantity: 100,
    status: "ordered",
    supplier: "Supplier A",
    orderDate: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 7),
    createdBy: "admin"
  },
  {
    id: "PO-002",
    sku: "SKU002",
    quantity: 50,
    status: "ordered",
    supplier: "Supplier B",
    orderDate: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 3600000 * 24 * 14),
    createdBy: "admin"
  }
];

export const ReceivingTab = () => {
  const { items, loading, error, refresh: refreshInventory } = useInventory();
  const { toast } = useToast();
  const { processTransaction } = useInventoryTransaction();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [receiving, setReceiving] = useState<string | null>(null);

  const refreshPurchaseOrders = () => {
    // In a real app, this would fetch the latest POs from the server
    // For now, just reset to mock data
    setPurchaseOrders(mockPurchaseOrders);
  };

  const handleReceiveItems = async (purchaseOrder: PurchaseOrder) => {
    try {
      setReceiving(purchaseOrder.id);
      
      // Create a receipt transaction
      const transaction = {
        type: 'receipt' as const,
        sku: purchaseOrder.sku,
        quantity: purchaseOrder.quantity,
        location: 'Main Warehouse', // This should be selected by the user in a real app
        reference: purchaseOrder.id,
        userId: 'current-user' // In a real app, this would be the authenticated user's ID
      };
      
      await processTransaction(transaction);
      
      // Update PO status to received in a real app
      // For now, just refresh the data
      refreshPurchaseOrders();
      
      toast({
        title: "Items Received",
        description: `Successfully received ${purchaseOrder.quantity} units of ${purchaseOrder.sku}`,
      });
    } catch (error) {
      console.error("Error receiving items:", error);
      toast({
        title: "Error",
        description: "Failed to process receipt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setReceiving(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Receiving</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO ID</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No purchase orders found.
                </TableCell>
              </TableRow>
            ) : (
              purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.id}</TableCell>
                  <TableCell>{po.sku}</TableCell>
                  <TableCell>{po.quantity}</TableCell>
                  <TableCell>{po.supplier}</TableCell>
                  <TableCell>
                    {new Date(po.expectedDeliveryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      onClick={() => handleReceiveItems(po)}
                      disabled={receiving === po.id}
                    >
                      {receiving === po.id ? "Receiving..." : "Receive Items"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
