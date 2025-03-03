
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

interface WaypointInfo {
  latitude: number;
  longitude: number;
  status: string;
  timestamp: string;
  location: string;
  activity: string;
}

interface TrackingData {
  id: string;
  order_id: string;
  latitude: number;
  longitude: number;
  status: string;
  timestamp: string;
  eta?: string;
  origin?: string;
  destination?: string;
  carrier?: string;
  tracking_number?: string;
  package_weight?: string;
  package_dimensions?: string;
  special_instructions?: string;
  delivery_attempts?: number;
  last_mile_carrier?: string;
  signature_required?: boolean;
  customs_status?: string;
  waypoints?: WaypointInfo[];
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
          origin: 'Riyadh Distribution Center',
          destination: 'Dammam Regional Warehouse',
          carrier: 'Saudi Post Logistics',
          tracking_number: 'SP1234567890SA',
          package_weight: '34.5 kg',
          package_dimensions: '60cm x 45cm x 30cm',
          special_instructions: 'Handle with care. Call recipient 30 minutes before delivery.',
          delivery_attempts: 0,
          last_mile_carrier: 'SMSA Express',
          signature_required: true,
          customs_status: 'Cleared',
          waypoints: [
            {
              latitude: 24.7136,
              longitude: 46.6753,
              status: 'completed',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
              location: 'Riyadh Distribution Center',
              activity: 'Package picked up from origin'
            },
            {
              latitude: 25.3569,
              longitude: 49.0507,
              status: 'completed',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
              location: 'Al Hofuf Transfer Station',
              activity: 'Package in-transit to destination'
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
