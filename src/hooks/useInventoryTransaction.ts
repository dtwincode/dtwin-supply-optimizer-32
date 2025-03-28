
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { calculateNetFlowPosition, calculateBufferPenetration } from '@/utils/inventoryUtils';
import { InventoryTransaction } from '@/types/inventory/shipmentTypes';

interface InventoryItem {
  id: string;
  sku: string;
  on_hand: number;
  on_order: number;
  net_flow_position?: number;
  buffer_penetration?: number;
  qualified_demand?: number;
  product_family?: string;
  name?: string;
  red_zone_size?: number;
  yellow_zone_size?: number;
  green_zone_size?: number;
  updated_at: string;
}

export const useInventoryTransaction = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const processTransaction = async (data: InventoryTransaction) => {
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

      // 3. Recalculate net flow position
      const calculatedNetFlow = calculateNetFlowPosition({
        currentStock: newOnHand,
        qualifiedDemand: inventoryItem.qualified_demand || 0,
        plannedOrder: newOnOrder,
        sku: inventoryItem.sku,
        name: inventoryItem.name || '',
        productFamily: inventoryItem.product_family || ''
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
          calculatedNetFlow.netFlowPosition,
          bufferZones
        );
      }

      // 5. Update inventory item
      const { error: updateError } = await supabase
        .from('inventory_data')
        .update({
          on_hand: newOnHand,
          on_order: newOnOrder,
          net_flow_position: calculatedNetFlow.netFlowPosition,
          buffer_penetration: bufferPenetration,
          updated_at: new Date().toISOString()
        })
        .eq('id', inventoryItem.id);

      if (updateError) {
        throw new Error(`Failed to update inventory: ${updateError.message}`);
      }

      // 6. Log the transaction
      const { error: logError } = await supabase
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
