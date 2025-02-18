
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface TrackingData {
  id: string;
  order_id: string;
  latitude: number;
  longitude: number;
  status: string;
  timestamp: string;
  eta?: string;
  waypoints?: Array<{
    latitude: number;
    longitude: number;
    status: string;
    timestamp: string;
  }>;
}

export const useLogisticsTracking = (orderId?: string) => {
  const { data, refetch } = useQuery({
    queryKey: ['logistics-tracking', orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('logistics_tracking')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      // If no data, return sample data for development
      if (!data || data.length === 0) {
        return [{
          id: 'sample-1',
          order_id: 'order-123',
          latitude: 26.3892, // Dammam coordinates
          longitude: 50.1872,
          status: 'in_transit',
          timestamp: new Date().toISOString(),
          eta: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // ETA 2 hours from now
          waypoints: [
            {
              latitude: 24.7136,
              longitude: 46.6753,
              status: 'completed',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
            },
            {
              latitude: 25.3569,
              longitude: 49.0507,
              status: 'completed',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
            }
          ]
        }] as TrackingData[];
      }
      
      return data as TrackingData[];
    },
    enabled: true, // Always enable to show sample data
  });

  useEffect(() => {
    const channel = supabase
      .channel('logistics-tracking-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'logistics_tracking',
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

  return { trackingData: data?.[0] };
};
