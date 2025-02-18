
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
      return data as TrackingData[];
    },
    enabled: !!orderId,
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
