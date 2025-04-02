import { useState, useEffect, useCallback } from 'react';
import { DecouplingNetwork, DecouplingPoint } from '@/types/inventory/decouplingTypes';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

export const useDecouplingPoints = () => {
  const [decouplingPoints, setDecouplingPoints] = useState<DecouplingPoint[]>([]);
  const [decouplingNetwork, setDecouplingNetwork] = useState<DecouplingNetwork>({ 
    nodes: [], 
    links: [] 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchDecouplingPoints = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch automatically generated decoupling points from inventory_planning_view
      const { data: planningViewData, error: viewError } = await supabase
        .from('inventory_planning_view')
        .select('*');

      if (viewError) throw viewError;

      // Fetch overrides from buffer_profile_override table
      const { data: overrideData, error: overrideError } = await supabase
        .from('buffer_profile_override')
        .select('*');

      if (overrideError) throw overrideError;

      // Create a map of overrides for quick lookup
      const overrideMap: Record<string, any> = {};
      overrideData?.forEach(override => {
        const key = `${override.product_id}-${override.location_id}`;
        overrideMap[key] = override;
        if (!('decoupling_point' in override)) {
          override.decoupling_point = false;
        }
      });

      if (planningViewData) {
        // Format the decoupling points data
        const formatted: DecouplingPoint[] = planningViewData
          .filter(item => {
            // Check if this is automatically generated as a decoupling point OR has a manual override
            const key = `${item.product_id}-${item.location_id}`;
            const hasOverride = !!overrideMap[key] && overrideMap[key].decoupling_point !== undefined;
            
            // Include if it's auto-generated as a decoupling point and not explicitly overridden to false
            // OR if it's manually overridden to true
            return (item.decoupling_point === true && (!hasOverride || overrideMap[key].decoupling_point !== false)) || 
                   (hasOverride && overrideMap[key].decoupling_point === true);
          })
          .map(item => {
            const key = `${item.product_id}-${item.location_id}`;
            const isOverride = !!overrideMap[key] && overrideMap[key].decoupling_point !== undefined;
            
            return {
              id: key,
              locationId: item.location_id,
              type: determineDecouplingType(item.lead_time_days, item.demand_variability),
              bufferProfileId: item.buffer_profile_id || 'default-profile',
              description: isOverride 
                ? `Manually overridden decoupling point` 
                : `Auto-generated decoupling point based on thresholds`,
              leadTimeAdjustment: 0,
              variabilityFactor: parseFloat(item.demand_variability.toString()) || 0,
              enableDynamicAdjustment: false,
              minimumOrderQuantity: 0,
              isOverride: isOverride
            };
          });

        // Add any explicit manual overrides that aren't in the planning view
        overrideData?.forEach(override => {
          if (override.decoupling_point === true) {
            const key = `${override.product_id}-${override.location_id}`;
            const exists = formatted.some(point => point.id === key);
            
            if (!exists) {
              formatted.push({
                id: key,
                locationId: override.location_id,
                type: 'strategic', // Default type for manual overrides
                bufferProfileId: override.buffer_profile_id || 'default-profile',
                description: 'Manually created decoupling point',
                leadTimeAdjustment: 0,
                variabilityFactor: 0.5, // Default value
                enableDynamicAdjustment: false,
                minimumOrderQuantity: 0,
                isOverride: true
              });
            }
          }
        });

        setDecouplingPoints(formatted);
        
        // Create a simple network representation
        const networkNodes = formatted.map(point => ({
          id: point.id,
          label: `${point.locationId} - ${point.id.split('-')[0]}`,
          type: 'decoupling',
          decouplingType: point.type
        }));

        // Link nodes (simplified)
        const networkLinks = networkNodes.map((node, index, array) => {
          // If not the last node, connect to the next one
          if (index < array.length - 1) {
            return {
              source: node.id,
              target: array[index + 1].id,
              label: 'connects to'
            };
          }
          return null;
        }).filter(Boolean);

        setDecouplingNetwork({
          nodes: networkNodes,
          links: networkLinks as any[]
        });
      }
    } catch (err) {
      console.error('Error fetching decoupling points:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        title: "Error",
        description: "Failed to load decoupling points",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteDecouplingPoint = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      // Extract product_id and location_id from the combined id
      const [productId, locationId] = id.split('-');
      
      // Update the buffer_profile_override table to set decoupling_point to false
      const { error } = await supabase
        .from('buffer_profile_override')
        .upsert({
          product_id: productId,
          location_id: locationId,
          decoupling_point: false,
          buffer_profile_id: 'default-profile' // Default profile ID
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Decoupling point removed successfully",
      });
      
      // Refresh the data
      fetchDecouplingPoints();
    } catch (err) {
      console.error('Error deleting decoupling point:', err);
      toast({
        title: "Error",
        description: "Failed to remove decoupling point",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [fetchDecouplingPoints, toast]);

  const createDecouplingPoint = useCallback(async (data: {
    productId: string;
    locationId: string;
    bufferProfileId: string;
  }) => {
    try {
      setLoading(true);
      
      // Create an override in the buffer_profile_override table
      const { error } = await supabase
        .from('buffer_profile_override')
        .upsert({
          product_id: data.productId,
          location_id: data.locationId,
          buffer_profile_id: data.bufferProfileId,
          decoupling_point: true
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Decoupling point created successfully",
      });
      
      // Refresh the data
      fetchDecouplingPoints();
      return { success: true };
    } catch (err) {
      console.error('Error creating decoupling point:', err);
      toast({
        title: "Error",
        description: "Failed to create decoupling point",
        variant: "destructive",
      });
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, [fetchDecouplingPoints, toast]);

  // Function to determine decoupling point type based on characteristics
  const determineDecouplingType = (leadTimeDays?: number, demandVariability?: number): DecouplingPoint['type'] => {
    if (!leadTimeDays || !demandVariability) return 'intermediate';
    
    // Strategic points have high lead time and high variability
    if (leadTimeDays > 30 && demandVariability > 0.8) {
      return 'strategic';
    }
    
    // Customer order points have moderate lead time and high service requirements
    if (leadTimeDays > 15 && leadTimeDays <= 30) {
      return 'customer_order';
    }
    
    // Stock points have lower lead time but need buffer
    if (leadTimeDays <= 15 && demandVariability > 0.4) {
      return 'stock_point';
    }
    
    // Default to intermediate for anything else
    return 'intermediate';
  };

  // Fetch data on mount
  useEffect(() => {
    fetchDecouplingPoints();
  }, [fetchDecouplingPoints]);

  return {
    decouplingPoints,
    decouplingNetwork,
    loading,
    error,
    fetchDecouplingPoints,
    refreshDecouplingPoints: fetchDecouplingPoints,
    deleteDecouplingPoint,
    createDecouplingPoint
  };
};
