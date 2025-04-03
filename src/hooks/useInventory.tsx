
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Define the InventoryItem type here since it's imported from this hook
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  currentStock: number;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  preferredSupplier?: string;
  bufferProfile?: string;
  onOrder?: number;
  allocated?: number;
  available?: number;
  reorderPoint?: number;
  createdAt: string;
  updatedAt: string;
}

// Sample mock data for development
const mockInventoryItems: InventoryItem[] = [
  {
    id: "inv1",
    sku: "SKU001",
    name: "Product A",
    description: "Description for Product A",
    category: "Electronics",
    subcategory: "Computers",
    currentStock: 150,
    minimumOrderQuantity: 25,
    leadTimeDays: 14,
    preferredSupplier: "Supplier X",
    bufferProfile: "bp1",
    onOrder: 50,
    allocated: 20,
    available: 130,
    reorderPoint: 75,
    createdAt: new Date(Date.now() - 3600000 * 24 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: "inv2",
    sku: "SKU002",
    name: "Product B",
    description: "Description for Product B",
    category: "Electronics",
    subcategory: "Peripherals",
    currentStock: 80,
    minimumOrderQuantity: 15,
    leadTimeDays: 7,
    preferredSupplier: "Supplier Y",
    bufferProfile: "bp2",
    onOrder: 30,
    allocated: 15,
    available: 65,
    reorderPoint: 40,
    createdAt: new Date(Date.now() - 3600000 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
  },
  {
    id: "inv3",
    sku: "SKU003",
    name: "Product C",
    description: "Description for Product C",
    category: "Appliances",
    subcategory: "Kitchen",
    currentStock: 45,
    minimumOrderQuantity: 10,
    leadTimeDays: 21,
    preferredSupplier: "Supplier Z",
    bufferProfile: "bp3",
    onOrder: 20,
    allocated: 5,
    available: 40,
    reorderPoint: 25,
    createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString()
  }
];

export const useInventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchInventoryItems = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setItems(mockInventoryItems);
    } catch (err) {
      console.error("Error fetching inventory items:", err);
      setError("Failed to fetch inventory items");
      
      toast({
        title: "Error",
        description: "Failed to fetch inventory items. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  return {
    items,
    loading,
    error,
    refresh: fetchInventoryItems
  };
};
