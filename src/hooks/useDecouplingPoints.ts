
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { DecouplingPoint, DecouplingNetwork } from '@/types/inventory/decouplingTypes';
import { useToast } from './use-toast';

export const useDecouplingPoints = () => {
  const [decouplingPoints, setDecouplingPoints] = useState<DecouplingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDecouplingPoints = async () => {
    setLoading(true);
    setError(null);
    try {
      // First fetch from decoupling_points table
      const { data: decouplingData, error: decouplingError } = await supabase
        .from('decoupling_points')
        .select('*');

      if (decouplingError) {
        throw decouplingError;
      }

      // Then fetch buffer overrides that might indicate decoupling points
      const { data: overrideData, error: overrideError } = await supabase
        .from('buffer_profile_override')
        .select('*');

      if (overrideError) {
        throw overrideError;
      }

      // Transform decoupling_points data
      const points = decouplingData.map(item => ({
        id: item.id,
        type: item.type as 'strategic' | 'customer_order' | 'stock_point' | 'intermediate',
        locationId: item.location_id,
        bufferProfileId: item.buffer_profile_id,
        description: item.description || ''
      }));

      // Add any buffer profile overrides that indicate decoupling points
      const overridePoints = overrideData
        .filter(item => item.decoupling_point === true)
        .map((item, index) => ({
          id: `override-${index}`,
          type: 'strategic' as const,
          locationId: item.location_id,
          bufferProfileId: item.buffer_profile_id,
          isOverride: true
        }));

      // Combine both sources
      setDecouplingPoints([...points, ...overridePoints]);
    } catch (err: any) {
      console.error('Error fetching decoupling points:', err);
      setError(err.message || 'Failed to fetch decoupling points');
      toast({
        title: 'Error',
        description: 'Failed to load decoupling points',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecouplingPoints();
  }, []);

  const createDecouplingPoint = async (decouplingPoint: Omit<DecouplingPoint, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('decoupling_points')
        .insert({
          type: decouplingPoint.type,
          location_id: decouplingPoint.locationId,
          buffer_profile_id: decouplingPoint.bufferProfileId,
          description: decouplingPoint.description || '',
          leadTimeAdjustment: 0  // Default, if needed by your schema
        })
        .select()
        .single();

      if (error) throw error;

      const newPoint: DecouplingPoint = {
        id: data.id,
        type: data.type,
        locationId: data.location_id,
        bufferProfileId: data.buffer_profile_id,
        description: data.description || ''
      };

      setDecouplingPoints([...decouplingPoints, newPoint]);
      toast({
        title: 'Success',
        description: 'Decoupling point created successfully'
      });
      return newPoint;
    } catch (err: any) {
      console.error('Error creating decoupling point:', err);
      toast({
        title: 'Error',
        description: `Failed to create decoupling point: ${err.message}`,
        variant: 'destructive'
      });
      return null;
    }
  };

  return {
    decouplingPoints,
    loading,
    error,
    fetchDecouplingPoints,
    createDecouplingPoint
  };
};
