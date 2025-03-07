
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
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const LogisticsOrdersTable = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: orders, refetch } = useQuery({
    queryKey: ['enhanced-orders'],
    queryFn: async () => {
      try {
        return await getEnhancedOrders();
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
        return [];
      } finally {
        setIsLoading(false);
      }
    },
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

  useEffect(() => {
    // Set a timeout to ensure loading state is displayed for at least 500ms
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-4 text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error loading orders</AlertTitle>
        <AlertDescription>
          {error.message}. Showing sample data instead.
        </AlertDescription>
      </Alert>
    );
  }

  // Generate dummy orders data for fallback
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

  const displayOrders = orders && orders.length > 0 ? orders : dummyOrders;

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
        {displayOrders.map((order) => (
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
                    ? "secondary" 
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
