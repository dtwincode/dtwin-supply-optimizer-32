
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DecouplingPoint, DecouplingNode, DecouplingLink, DecouplingNetwork } from '@/types/inventory/decouplingTypes';
import { useToast } from '@/hooks/use-toast';
import { getDecouplingPoints, createDecouplingPoint, updateDecouplingPoint, deleteDecouplingPoint } from '@/services/inventoryService';

export function useDecouplingPoints() {
  const [points, setPoints] = useState<DecouplingPoint[]>([]);
  const [network, setNetwork] = useState<DecouplingNetwork>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchDecouplingPoints = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPoints = await getDecouplingPoints();
      setPoints(fetchedPoints);
      
      // Build the network based on fetched points
      await buildNetwork(fetchedPoints);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching decoupling points:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch decoupling points'));
      toast({
        title: "Error",
        description: "Failed to load decoupling points",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const buildNetwork = useCallback(async (decouplingPoints: DecouplingPoint[]) => {
    try {
      // Fetch locations
      const { data: locations } = await supabase
        .from('locations')
        .select('*');

      // Create nodes and links
      const nodes: DecouplingNode[] = [];
      const links: DecouplingLink[] = [];

      // Add location nodes
      if (locations) {
        locations.forEach((location) => {
          nodes.push({
            id: location.id,
            type: 'location',
            label: location.name,
            level: location.level || 0,
            metadata: { 
              address: location.address,
              city: location.city,
              country: location.country
            }
          });
        });
      }

      // Add decoupling point nodes
      decouplingPoints.forEach(point => {
        const decouplingNode: DecouplingNode = {
          id: `dp-${point.id}`,
          type: 'decoupling',
          label: point.description || `${point.type} point`,
          parentId: point.locationId,
          level: 1, // Child of location
          metadata: { type: point.type },
          decouplingType: point.type
        };
        
        nodes.push(decouplingNode);
        
        // Add link from location to decoupling point
        links.push({
          source: point.locationId,
          target: `dp-${point.id}`
        });
      });

      // Look for supply chain connections to create links
      const { data: connections } = await supabase
        .from('supply_chain_connections')
        .select('*');

      if (connections) {
        connections.forEach(conn => {
          links.push({
            source: conn.source_id,
            target: conn.target_id,
            label: conn.connection_type
          });
        });
      }

      setNetwork({ nodes, links });
    } catch (err) {
      console.error('Error building network:', err);
      setError(err instanceof Error ? err : new Error('Failed to build network'));
    }
  }, []);

  useEffect(() => {
    fetchDecouplingPoints();
  }, [fetchDecouplingPoints]);

  const createPoint = useCallback(async (point: Omit<DecouplingPoint, 'id'>) => {
    try {
      const newPoint = await createDecouplingPoint(point);
      
      setPoints(prev => [...prev, newPoint]);
      
      // Update network
      await buildNetwork([...points, newPoint]);
      
      toast({
        title: "Success",
        description: "Decoupling point created successfully",
      });
      
      return { success: true, point: newPoint };
    } catch (err) {
      console.error('Error creating decoupling point:', err);
      toast({
        title: "Error",
        description: "Failed to create decoupling point",
        variant: "destructive",
      });
      return { success: false };
    }
  }, [points, buildNetwork, toast]);

  const updatePoint = useCallback(async (pointData: Partial<DecouplingPoint> & { id: string }) => {
    try {
      const updatedPoint = await updateDecouplingPoint(pointData);
      
      setPoints(prev => 
        prev.map(p => p.id === updatedPoint.id ? updatedPoint : p)
      );
      
      // Update network
      const updatedPoints = points.map(p => 
        p.id === updatedPoint.id ? updatedPoint : p
      );
      await buildNetwork(updatedPoints);
      
      toast({
        title: "Success",
        description: "Decoupling point updated successfully",
      });
      
      return { success: true, point: updatedPoint };
    } catch (err) {
      console.error('Error updating decoupling point:', err);
      toast({
        title: "Error",
        description: "Failed to update decoupling point",
        variant: "destructive",
      });
      return { success: false };
    }
  }, [points, buildNetwork, toast]);

  const deletePoint = useCallback(async (id: string) => {
    try {
      await deleteDecouplingPoint(id);
      
      const updatedPoints = points.filter(p => p.id !== id);
      setPoints(updatedPoints);
      
      // Update network
      await buildNetwork(updatedPoints);
      
      toast({
        title: "Success",
        description: "Decoupling point deleted successfully",
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting decoupling point:', err);
      toast({
        title: "Error",
        description: "Failed to delete decoupling point",
        variant: "destructive",
      });
      return { success: false };
    }
  }, [points, buildNetwork, toast]);

  return {
    points,
    network,
    loading,
    error,
    fetchDecouplingPoints,
    createPoint,
    updatePoint,
    deletePoint
  };
}
