
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getEnhancedOrders } from '@/services/logisticsService';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const LogisticsOrdersTable = () => {
  const { data: orders, refetch } = useQuery({
    queryKey: ['enhanced-orders'],
    queryFn: getEnhancedOrders,
  });

  useEffect(() => {
    const channel = supabase
      .channel('enhanced-orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'logistics_enhanced_orders',
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  if (!orders || orders.length === 0) {
    // Return dummy data when no orders are available
    const dummyOrders = [
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
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Ref</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead>Tracking Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Estimated Delivery</TableHead>
            <TableHead>Shipping Method</TableHead>
            <TableHead>Priority</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.order_ref}</TableCell>
              <TableCell>{order.carrier}</TableCell>
              <TableCell>{order.tracking_number}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "in-transit" || order.status === "processing"
                      ? "default"
                      : order.status === "delayed"
                      ? "destructive"
                      : order.status === "delivered"
                      ? "success"
                      : order.status === "out-for-delivery"
                      ? "secondary"
                      : "default"
                  }
                  className="capitalize"
                >
                  {order.status.replace("-", " ")}
                </Badge>
              </TableCell>
              <TableCell>{new Date(order.estimated_delivery).toLocaleDateString()}</TableCell>
              <TableCell>{order.shipping_method}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.priority === "high"
                      ? "destructive"
                      : order.priority === "medium"
                      ? "secondary"
                      : "default"
                  }
                  className="capitalize"
                >
                  {order.priority}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Ref</TableHead>
          <TableHead>Carrier</TableHead>
          <TableHead>Tracking Number</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Estimated Delivery</TableHead>
          <TableHead>Shipping Method</TableHead>
          <TableHead>Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.order_ref}</TableCell>
            <TableCell>{order.carrier}</TableCell>
            <TableCell>{order.tracking_number}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.status === "in-transit" || order.status === "processing"
                    ? "default"
                    : order.status === "delayed"
                    ? "destructive"
                    : order.status === "delivered"
                    ? "success"
                    : order.status === "out-for-delivery"
                    ? "secondary"
                    : "default"
                }
                className="capitalize"
              >
                {order.status.replace("-", " ")}
              </Badge>
            </TableCell>
            <TableCell>{new Date(order.estimated_delivery).toLocaleDateString()}</TableCell>
            <TableCell>{order.shipping_method}</TableCell>
            <TableCell>
              <Badge
                variant={
                  order.priority === "high"
                    ? "destructive"
                    : order.priority === "medium"
                    ? "secondary"
                    : "default"
                }
                className="capitalize"
              >
                {order.priority}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
