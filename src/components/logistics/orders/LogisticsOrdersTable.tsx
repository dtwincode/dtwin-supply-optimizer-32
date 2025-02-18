
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

  if (!orders) return null;

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
                  order.status === "in-transit"
                    ? "default"
                    : order.status === "delayed"
                    ? "destructive"
                    : "secondary"
                }
                className="capitalize"
              >
                {order.status}
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
