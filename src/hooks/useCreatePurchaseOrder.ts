
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PurchaseOrderData {
  sku: string;
  quantity: number;
  status: 'planned' | 'ordered' | 'confirmed' | 'shipped' | 'received';
  supplier?: string;
  po_number?: string;
  notes?: string;
  expectedDeliveryDate?: Date;
}

export const useCreatePurchaseOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPurchaseOrder = async (data: PurchaseOrderData) => {
    try {
      setLoading(true);
      setError(null);

      const poData = {
        sku: data.sku,
        quantity: data.quantity,
        status: data.status,
        supplier: data.supplier,
        po_number: data.po_number || `PO-${Date.now()}`,
        notes: data.notes,
        order_date: new Date().toISOString(),
        expected_delivery_date: data.expectedDeliveryDate?.toISOString() || null
      };

      const { error: supabaseError } = await supabase
        .from('purchase_orders')
        .insert(poData);

      if (supabaseError) throw new Error(supabaseError.message);

      return true;
    } catch (err) {
      console.error('Error creating purchase order:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return createPurchaseOrder;
};
