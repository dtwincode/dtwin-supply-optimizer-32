
import { useState, useEffect, useCallback } from 'react';
import { DecouplingPoint, DecouplingNetwork } from '@/types/inventory';
import { getDecouplingPoints, saveDecouplingPoint } from '@/services/inventoryService';
import { useToast } from '@/hooks/use-toast';

export function useDecouplingPoints() {
  const [points, setPoints] = useState<DecouplingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDecouplingPoints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDecouplingPoints();
      setPoints(data);
    } catch (error) {
      console.error('Error fetching decoupling points:', error);
      toast({
        title: "Error",
        description: "Failed to load decoupling points",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDecouplingPoints();
  }, [fetchDecouplingPoints]);

  const createOrUpdateDecouplingPoint = useCallback(async (point: DecouplingPoint) => {
    try {
      const savedPoint = await saveDecouplingPoint(point);
      setPoints(prev => {
        const index = prev.findIndex(p => p.id === savedPoint.id);
        if (index >= 0) {
          return [...prev.slice(0, index), savedPoint, ...prev.slice(index + 1)];
        } else {
          return [...prev, savedPoint];
        }
      });
      toast({
        title: "Success",
        description: `Decoupling point ${point.id ? 'updated' : 'created'} successfully`,
      });
      return { success: true, point: savedPoint };
    } catch (error) {
      console.error('Error saving decoupling point:', error);
      toast({
        title: "Error",
        description: `Failed to save decoupling point: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return { success: false };
    }
  }, [toast]);

  // Generate network structure for visualization
  const getNetwork = useCallback((): DecouplingNetwork => {
    const nodes: DecouplingNetwork['nodes'] = [];
    const links: DecouplingNetwork['links'] = [];
    
    // Process locations and decoupling points to create a network
    // This is a simplified example - in a real implementation, 
    // you would fetch and process actual location hierarchy data
    
    if (points.length === 0) {
      return { nodes, links };
    }
    
    const mockLocations = [
      { id: 'loc-001', name: 'Main DC', level: 1, parentId: null },
      { id: 'loc-002', name: 'Regional Center', level: 2, parentId: 'loc-001' },
      { id: 'loc-003', name: 'Store A', level: 3, parentId: 'loc-002' },
      { id: 'loc-004', name: 'Store B', level: 3, parentId: 'loc-002' },
    ];
    
    // Add location nodes
    mockLocations.forEach(loc => {
      nodes.push({
        id: loc.id,
        type: 'location',
        label: loc.name,
        level: loc.level,
        parentId: loc.parentId,
        metadata: { locationLevel: loc.level }
      });
      
      if (loc.parentId) {
        links.push({
          source: loc.parentId,
          target: loc.id
        });
      }
    });
    
    // Add decoupling point information
    points.forEach(point => {
      const locationNode = nodes.find(node => node.id === point.locationId);
      if (locationNode) {
        locationNode.type = 'decoupling';
        locationNode.decouplingType = point.type;
        locationNode.metadata = {
          ...locationNode.metadata,
          decouplingPointId: point.id,
          bufferProfileId: point.bufferProfileId
        };
      }
    });
    
    return { nodes, links };
  }, [points]);

  return {
    points,
    loading,
    fetchDecouplingPoints,
    createOrUpdateDecouplingPoint,
    getNetwork
  };
}
