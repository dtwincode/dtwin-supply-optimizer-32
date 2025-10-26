import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ProjectionInput, DayProjection, WeekProjection } from '@/utils/projectionCalculations';
import { calculateDailyProjections, calculateWeeklyProjections } from '@/utils/projectionCalculations';

interface UseProjectionDataProps {
  productId: string;
  locationId: string;
  enabled?: boolean;
}

interface ProjectionData {
  dailyProjections: DayProjection[];
  weeklyProjections: WeekProjection[];
  isLoading: boolean;
  error: Error | null;
}

export function useProjectionData({ 
  productId, 
  locationId, 
  enabled = true 
}: UseProjectionDataProps): ProjectionData {
  const [dailyProjections, setDailyProjections] = useState<DayProjection[]>([]);
  const [weeklyProjections, setWeeklyProjections] = useState<WeekProjection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enabled || !productId || !locationId) {
      setIsLoading(false);
      return;
    }

    const loadProjectionData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch inventory planning data
        const { data: planningData, error: planningError } = await supabase
          .from('inventory_planning_view')
          .select('*')
          .eq('product_id', productId)
          .eq('location_id', locationId)
          .single();

        if (planningError) throw planningError;
        if (!planningData) throw new Error('No planning data found');

        // Fetch buffer data
        const { data: bufferData, error: bufferError } = await supabase
          .from('inventory_ddmrp_buffers_view')
          .select('tor, toy, tog, moq, rounding_multiple')
          .eq('product_id', productId)
          .eq('location_id', locationId)
          .single();

        if (bufferError) throw bufferError;

        // Fetch open POs
        const { data: openPOs, error: poError } = await supabase
          .from('open_pos')
          .select('ordered_qty, expected_date')
          .eq('product_id', productId)
          .eq('location_id', locationId)
          .eq('status', 'OPEN')
          .order('expected_date', { ascending: true });

        if (poError) throw poError;
        
        // Filter out POs with null expected_date
        const validPOs = (openPOs || []).filter(po => po.expected_date !== null) as Array<{ ordered_qty: number; expected_date: string }>;

        // Prepare projection input
        const projectionInput: ProjectionInput = {
          currentOnHand: planningData.on_hand || 0,
          currentOnOrder: planningData.on_order || 0,
          qualifiedDemand: planningData.qualified_demand || 0,
          adu: planningData.average_daily_usage || 1,
          dlt: planningData.lead_time_days || 14,
          tor: bufferData?.tor || 0,
          toy: bufferData?.toy || 0,
          tog: bufferData?.tog || 0,
          openPOs: validPOs,
          moq: bufferData?.moq || 0,
          roundingMultiple: bufferData?.rounding_multiple || 1,
        };

        // Calculate projections
        const daily = calculateDailyProjections(projectionInput);
        const weekly = calculateWeeklyProjections(projectionInput);

        setDailyProjections(daily);
        setWeeklyProjections(weekly);
      } catch (err) {
        console.error('Error loading projection data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load projection data'));
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectionData();
  }, [productId, locationId, enabled]);

  return { dailyProjections, weeklyProjections, isLoading, error };
}
