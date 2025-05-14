
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

interface CreatePOParams {
  sku: string;
  quantity: number;
  status: 'planned' | 'ordered' | 'received' | 'cancelled';
  supplier: string;
  expectedDeliveryDate: Date;
}

export const useCreatePurchaseOrder = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createPurchaseOrder = async (params: CreatePOParams): Promise<PurchaseOrder> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock PO creation
      const newPO: PurchaseOrder = {
        id: `PO-${Date.now()}`,
        sku: params.sku,
        quantity: params.quantity,
        status: params.status,
        supplier: params.supplier,
        orderDate: new Date().toISOString(),
        expectedDeliveryDate: params.expectedDeliveryDate,
        createdBy: "Current User" // In a real app, this would be the authenticated user
      };
      
      toast({
        title: "Purchase Order Created",
        description: `Successfully created PO for ${params.quantity} units of ${params.sku}`,
      });
      
      return newPO;
    } catch (error) {
      console.error("Error creating purchase order:", error);
      
      toast({
        title: "Error Creating Purchase Order",
        description: "Failed to create purchase order. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return createPurchaseOrder;
};
