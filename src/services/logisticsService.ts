
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedOrder {
  id: string;
  order_ref: string;
  carrier: string;
  tracking_number: string;
  shipping_method: string;
  priority: string;
  estimated_delivery: string;
  actual_delivery: string;
  status: string;
  metadata: Record<string, any>;
}

export const getEnhancedOrders = async () => {
  const { data, error } = await supabase
    .from('logistics_enhanced_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as EnhancedOrder[];
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { error } = await supabase
    .from('logistics_enhanced_orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
};
