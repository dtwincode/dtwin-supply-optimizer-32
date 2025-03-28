
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { calculateNetFlowPosition, calculateBufferPenetration } from '@/utils/inventoryUtils';

interface InventoryTransactionData {
  sku: string;
  quantity: number;
  transactionType: 'inbound' | 'outbound';
  referenceId?: string;
  referenceType?: 'purchase_order' | 'sales_order' | 'shipment';
  notes?: string;
}

export const useInventoryTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const processTransaction = async (data: InventoryTransactionData) => {
    try {
      setLoading(true);
      
      // 1. Get current inventory data for the SKU
      const { data: inventoryItem, error: inventoryError } = await supabase
        .from('inventory_data')
        .select('*')
        .eq('sku', data.sku)
        .single();

      if (inventoryError) {
        throw new Error(`Inventory data not found: ${inventoryError.message}`);
      }

      // 2. Calculate updated values
      const newOnHand = data.transactionType === 'inbound' 
        ? inventoryItem.on_hand + data.quantity
        : inventoryItem.on_hand - data.quantity;
      
      // For inbound, also reduce on_order
      const newOnOrder = data.transactionType === 'inbound' && data.referenceType === 'purchase_order'
        ? inventoryItem.on_order - data.quantity
        : inventoryItem.on_order;

      // 3. Recalculate net flow position - convert to compatible type for calculation
      const netFlowPosition = calculateNetFlowPosition({
        currentStock: newOnHand,
        qualifiedDemand: inventoryItem.qualified_demand || 0,
        plannedSupply: newOnOrder,
        netFlowPosition: inventoryItem.net_flow_position || 0,
        productFamily: inventoryItem.product_family || '',
        sku: inventoryItem.sku,
        name: inventoryItem.name || ''
      });

      // 4. Calculate buffer penetration if buffer zones exist
      let bufferPenetration = inventoryItem.buffer_penetration;
      if (inventoryItem.red_zone_size && inventoryItem.yellow_zone_size && inventoryItem.green_zone_size) {
        const bufferZones = {
          red: inventoryItem.red_zone_size,
          yellow: inventoryItem.yellow_zone_size,
          green: inventoryItem.green_zone_size
        };
        bufferPenetration = calculateBufferPenetration(
          netFlowPosition.netFlowPosition,
          bufferZones
        );
      }

      // 5. Update inventory item
      const { error: updateError } = await supabase
        .from('inventory_data')
        .update({
          on_hand: newOnHand,
          on_order: newOnOrder,
          net_flow_position: netFlowPosition.netFlowPosition,
          buffer_penetration: bufferPenetration,
          updated_at: new Date().toISOString()
        })
        .eq('id', inventoryItem.id);

      if (updateError) {
        throw new Error(`Failed to update inventory: ${updateError.message}`);
      }

      // 6. Log the transaction
      const { error: logError } = await (supabase as any)
        .from('inventory_transactions')
        .insert({
          sku: data.sku,
          quantity: data.quantity,
          transaction_type: data.transactionType,
          reference_id: data.referenceId,
          reference_type: data.referenceType,
          previous_on_hand: inventoryItem.on_hand,
          new_on_hand: newOnHand,
          notes: data.notes,
          transaction_date: new Date().toISOString()
        });

      if (logError) {
        console.error('Failed to log transaction:', logError);
        // Continue even if logging fails
      }

      toast({
        title: 'Inventory Updated',
        description: `${data.transactionType === 'inbound' ? 'Received' : 'Shipped'} ${data.quantity} units of ${data.sku}`,
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
