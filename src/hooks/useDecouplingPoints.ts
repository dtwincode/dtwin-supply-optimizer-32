
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DecouplingPoint, DecouplingNetwork } from '@/types/inventory/decouplingTypes';

export const useDecouplingPoints = () => {
  const [network, setNetwork] = useState<DecouplingNetwork>({ nodes: [], links: [] });
  const [points, setPoints] = useState<DecouplingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDecouplingPoints();
  }, []);

  const fetchDecouplingPoints = async () => {
    try {
      setLoading(true);
      
      // Fetch decoupling points
      const { data: pointsData, error: pointsError } = await supabase
        .from('decoupling_points')
        .select('*');
      
      if (pointsError) throw new Error(pointsError.message);
      
      // If no data is returned, provide mock data for demonstration
      const finalPoints: DecouplingPoint[] = pointsData?.length 
        ? pointsData 
        : [
            {
              id: 'dp-001',
              locationId: 'loc-001',
              type: 'strategic',
              description: 'Main distribution center',
              bufferProfileId: 'bp-001'
            },
            {
              id: 'dp-002',
              locationId: 'loc-002',
              type: 'customer_order',
              description: 'Regional fulfillment center',
              bufferProfileId: 'bp-002'
            }
          ];
      
      setPoints(finalPoints);
      
      // Generate network visualization data
      const nodes = finalPoints.map(point => ({
        id: point.id,
        type: 'decoupling',
        label: point.locationId,
        level: 1,
        metadata: { type: point.type },
        decouplingType: point.type
      }));
      
      // Add some location nodes
      nodes.push(
        {
          id: 'supplier-1',
          type: 'location',
          label: 'Supplier A',
          level: 0,
          metadata: {}
        },
        {
          id: 'supplier-2',
          type: 'location',
          label: 'Supplier B',
          level: 0,
          metadata: {}
        },
        {
          id: 'customer-1',
          type: 'location',
          label: 'Customer X',
          level: 2,
          metadata: {}
        }
      );
      
      // Create links
      const links = [
        { source: 'supplier-1', target: 'dp-001' },
        { source: 'supplier-2', target: 'dp-001' },
        { source: 'supplier-2', target: 'dp-002' },
        { source: 'dp-001', target: 'dp-002' },
        { source: 'dp-002', target: 'customer-1' }
      ];
      
      setNetwork({ nodes, links });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching decoupling points:", err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setLoading(false);
    }
  };

  const addDecouplingPoint = async (point: Omit<DecouplingPoint, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('decoupling_points')
        .insert(point)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      setPoints(prev => [...prev, data as DecouplingPoint]);
      return data;
    } catch (err) {
      console.error("Error adding decoupling point:", err);
      throw err;
    }
  };

  const updateDecouplingPoint = async (point: DecouplingPoint) => {
    try {
      const { data, error } = await supabase
        .from('decoupling_points')
        .update({
          locationId: point.locationId,
          type: point.type,
          description: point.description,
          bufferProfileId: point.bufferProfileId
        })
        .eq('id', point.id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      
      setPoints(prev => prev.map(p => p.id === point.id ? (data as DecouplingPoint) : p));
      return data;
    } catch (err) {
      console.error("Error updating decoupling point:", err);
      throw err;
    }
  };

  const deleteDecouplingPoint = async (id: string) => {
    try {
      const { error } = await supabase
        .from('decoupling_points')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      
      setPoints(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting decoupling point:", err);
      throw err;
    }
  };

  return {
    network,
    points,
    loading,
    error,
    addDecouplingPoint,
    updateDecouplingPoint,
    deleteDecouplingPoint,
    refresh: fetchDecouplingPoints
  };
};
