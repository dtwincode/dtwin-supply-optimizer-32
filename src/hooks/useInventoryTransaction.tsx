
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: 'receipt' | 'shipment' | 'adjustment' | 'transfer';
  sku: string;
  quantity: number;
  location: string;
  reference?: string;
  userId: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export const useInventoryTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const processTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newTransaction: Transaction = {
        ...transaction,
        id: `tr-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      toast({
        title: "Transaction successful",
        description: `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} for ${transaction.quantity} units of ${transaction.sku} has been processed.`,
      });
      
      return newTransaction;
    } catch (error) {
      console.error("Error processing transaction:", error);
      
      toast({
        title: "Transaction failed",
        description: "Failed to process inventory transaction. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    processTransaction,
    loading
  };
};
