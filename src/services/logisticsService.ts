
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
  
  // If no data, return sample data for development
  if (!data || data.length === 0) {
    return [
      {
        id: 'order-001',
        order_ref: 'ORD-20240315-001',
        carrier: 'Saudi Post Logistics',
        tracking_number: 'SP1234567890SA',
        shipping_method: 'Express Delivery',
        priority: 'high',
        estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        actual_delivery: '',
        status: 'in-transit',
        metadata: {}
      },
      {
        id: 'order-002',
        order_ref: 'ORD-20240314-085',
        carrier: 'SMSA Express',
        tracking_number: 'SMSA78901234',
        shipping_method: 'Standard Delivery',
        priority: 'medium',
        estimated_delivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        actual_delivery: '',
        status: 'processing',
        metadata: {}
      },
      {
        id: 'order-003',
        order_ref: 'ORD-20240310-042',
        carrier: 'Aramex',
        tracking_number: 'ARX12345678',
        shipping_method: 'Standard Delivery',
        priority: 'low',
        estimated_delivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        actual_delivery: '',
        status: 'out-for-delivery',
        metadata: {}
      },
      {
        id: 'order-004',
        order_ref: 'ORD-20240302-157',
        carrier: 'DHL Express',
        tracking_number: 'DHL987654321',
        shipping_method: 'Express Delivery',
        priority: 'high',
        estimated_delivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        actual_delivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        metadata: {}
      },
      {
        id: 'order-005',
        order_ref: 'ORD-20240228-093',
        carrier: 'FedEx',
        tracking_number: 'FDX567890123',
        shipping_method: 'Express Delivery',
        priority: 'medium',
        estimated_delivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        actual_delivery: '',
        status: 'delayed',
        metadata: {}
      }
    ];
  }
  
  return data as EnhancedOrder[];
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { error } = await supabase
    .from('logistics_enhanced_orders')
    .update({ status })
    .eq('id', orderId);

  if (error) throw error;
};

// Add sample tracking data for testing
export const addSampleTrackingData = async (orderId: string) => {
  const { error } = await supabase
    .from('logistics_tracking')
    .insert({
      order_id: orderId,
      latitude: 40.7128,
      longitude: -74.0060,
      status: 'in-transit'
    });

  if (error) throw error;
};
