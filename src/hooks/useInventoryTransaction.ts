
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { InventoryTransactionData } from '@/types/inventory';

export const useInventoryTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const processTransaction = async (data: InventoryTransactionData) => {
    try {
      setLoading(true);
      
      // 1. Get current inventory data for the product
      const { data: inventoryItem, error: inventoryError } = await supabase
        .from('inventory_data')
        .select('*')
        .eq('product_id', data.product_id)
        .single();

      if (inventoryError) {
        throw new Error(`Inventory data not found: ${inventoryError.message}`);
      }

      // 2. Calculate updated values
      const newQuantityOnHand = data.transactionType === 'inbound' 
        ? inventoryItem.quantity_on_hand + data.quantity
        : inventoryItem.quantity_on_hand - data.quantity;
      
      const newAvailableQty = data.transactionType === 'inbound' 
        ? inventoryItem.available_qty + data.quantity
        : inventoryItem.available_qty - data.quantity;
      
      // 3. Update inventory item
      const { error: updateError } = await supabase
        .from('inventory_data')
        .update({
          quantity_on_hand: newQuantityOnHand,
          available_qty: newAvailableQty,
          last_updated: new Date().toISOString()
        })
        .eq('inventory_id', inventoryItem.inventory_id);

      if (updateError) {
        throw new Error(`Failed to update inventory: ${updateError.message}`);
      }

      // 4. Log the transaction - commented out as the table doesn't exist yet
      console.log('Transaction processed:', {
        product_id: data.product_id,
        quantity: data.quantity,
        transaction_type: data.transactionType,
        reference_id: data.referenceId,
        reference_type: data.referenceType,
        previous_quantity: inventoryItem.quantity_on_hand,
        new_quantity: newQuantityOnHand,
        previous_available: inventoryItem.available_qty,
        new_available: newAvailableQty,
        notes: data.notes,
        transaction_date: new Date().toISOString()
      });

      toast({
        title: 'Inventory Updated',
        description: `${data.transactionType === 'inbound' ? 'Received' : 'Shipped'} ${data.quantity} units of product ${data.product_id}`,
      });

      return true;
    } catch (error) {
      console.error('Error processing inventory transaction:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process inventory transaction',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    processTransaction,
    loading
  };
};
