
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
              latitude: 24.7136, // Riyadh (Starting point)
              longitude: 46.6753,
              status: 'completed',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
            },
            {
              latitude: 24.8916, // Riyadh Customs Clearance
              longitude: 46.7219,
              status: 'completed',
              timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString()
            },
            {
              latitude: 25.3569, // Al-Hofuf Transit Hub
              longitude: 49.0507,
              status: 'completed',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              latitude: 25.9394, // Abqaiq Distribution Center
              longitude: 49.6808,
              status: 'completed',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
            },
            {
              latitude: 26.2172, // Dammam Local Hub
              longitude: 50.0887,
              status: 'in_progress',
              timestamp: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString()
            },
            {
              latitude: 26.3892, // Final Destination (Dammam)
              longitude: 50.1872,
              status: 'pending',
              timestamp: new Date(Date.now() + 0.5 * 60 * 60 * 1000).toISOString()
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
