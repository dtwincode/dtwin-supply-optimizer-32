import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useInventoryTransaction } from '@/hooks/useInventoryTransaction';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryTransaction, Transaction } from "@/types/inventory/shipmentTypes";

export const TransactionsTab = () => {
  const { processTransaction, loading } = useInventoryTransaction();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitTransaction = async (transaction: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => {
    try {
      const newTransaction = await processTransaction(transaction);
      setTransactions([newTransaction, ...transactions]);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Inventory Transactions</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Inventory Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm onSubmit={handleSubmitTransaction} isSubmitting={loading} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No transactions recorded. Create your first transaction.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>{transaction.sku}</TableCell>
                  <TableCell>{transaction.quantity}</TableCell>
                  <TableCell>{transaction.location}</TableCell>
                  <TableCell>{transaction.reference || '-'}</TableCell>
                  <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                  <TableCell className="capitalize">{transaction.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const TransactionForm = ({ 
  onSubmit, 
  isSubmitting 
}: { 
  onSubmit: (data: Omit<Transaction, 'id' | 'timestamp' | 'status'>) => void;
  isSubmitting: boolean;
}) => {
  const [formData, setFormData] = useState({
    type: 'receipt',
    sku: '',
    quantity: 0,
    location: '',
    reference: '',
    userId: 'current-user', // In a real app, this would be the authenticated user's ID
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Transaction Type</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="receipt">Receipt</option>
            <option value="shipment">Shipment</option>
            <option value="adjustment">Adjustment</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">SKU</label>
          <input 
            type="text" 
            name="sku" 
            value={formData.sku} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <input 
            type="number" 
            name="quantity" 
            value={formData.quantity} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="1"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <input 
            type="text" 
            name="location" 
            value={formData.location} 
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Reference (Optional)</label>
        <input 
          type="text" 
          name="reference" 
          value={formData.reference} 
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Processing...' : 'Create Transaction'}
      </Button>
    </form>
  );
};
