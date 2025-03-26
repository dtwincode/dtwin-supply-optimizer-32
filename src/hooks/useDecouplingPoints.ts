
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DecouplingPoint, DecouplingNode, DecouplingLink, DecouplingNetwork } from '@/types/inventory/decouplingTypes';
import { useToast } from '@/hooks/use-toast';
import { getDecouplingPoints, createDecouplingPoint, updateDecouplingPoint, deleteDecouplingPoint } from '@/services/inventoryService';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

// Define mock location data structure for development
interface LocationData {
  id: string;
  name: string;
  level: number;
  address?: string;
  city?: string;
  country?: string;
}

// Define mock connection data structure for development
interface ConnectionData {
  source_id: string;
  target_id: string;
  connection_type?: string;
}

export function useDecouplingPoints() {
  const [points, setPoints] = useState<DecouplingPoint[]>([]);
  const [network, setNetwork] = useState<DecouplingNetwork>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const fetchDecouplingPoints = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPoints = await getDecouplingPoints();
      // Ensure all required fields are present in the fetched points
      const validPoints: DecouplingPoint[] = fetchedPoints.map(point => ({
        ...point,
        name: point.name || `${point.type} point at ${point.locationId}`
      }));
      
      setPoints(validPoints);
      
      // Build the network based on fetched points
      await buildNetwork(validPoints);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching decoupling points:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch decoupling points'));
      toast({
        title: getTranslation('common.error', language),
        description: language === 'ar' 
          ? "فشل في تحميل نقاط الفصل" 
          : "Failed to load decoupling points",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, language]);

  const buildNetwork = useCallback(async (decouplingPoints: DecouplingPoint[]) => {
    try {
      // In a real app, these would be fetched from Supabase
      // For now, use mock data instead of trying to fetch from 'locations' table
      const mockLocations: LocationData[] = [
        { id: "loc-main-warehouse", name: "Main Warehouse", level: 0, address: "123 Main St", city: "Los Angeles", country: "USA" },
        { id: "loc-distribution-center", name: "Distribution Center", level: 1, address: "456 Center Ave", city: "Chicago", country: "USA" },
        { id: "loc-retail-store", name: "Retail Store", level: 2, address: "789 Market St", city: "New York", country: "USA" }
      ];

      // Create nodes and links
      const nodes: DecouplingNode[] = [];
      const links: DecouplingLink[] = [];

      // Add location nodes
      mockLocations.forEach((location) => {
        nodes.push({
          id: location.id,
          type: 'location',
          label: location.name,
          level: location.level,
          metadata: { 
            address: location.address,
            city: location.city,
            country: location.country
          }
        });
      });

      // Add decoupling point nodes
      decouplingPoints.forEach(point => {
        const decouplingNode: DecouplingNode = {
          id: `dp-${point.id}`,
          type: 'decoupling',
          label: point.name || (point.description || `${point.type} point`),
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

      // Mock supply chain connections instead of fetching from non-existent table
      const mockConnections: ConnectionData[] = [
        { source_id: "loc-main-warehouse", target_id: "loc-distribution-center", connection_type: "supply" },
        { source_id: "loc-distribution-center", target_id: "loc-retail-store", connection_type: "distribution" }
      ];

      mockConnections.forEach(conn => {
        links.push({
          source: conn.source_id,
          target: conn.target_id,
          label: conn.connection_type
        });
      });

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
      
      const validPoint: DecouplingPoint = {
        ...newPoint,
        name: newPoint.name || `${newPoint.type} point at ${newPoint.locationId}`
      };
      
      setPoints(prev => [...prev, validPoint]);
      
      // Update network
      await buildNetwork([...points, validPoint]);
      
      toast({
        title: getTranslation('common.success', language),
        description: getTranslation('common.inventory.decouplingPointSaved', language),
      });
      
      return { success: true, point: validPoint };
    } catch (err) {
      console.error('Error creating decoupling point:', err);
      toast({
        title: getTranslation('common.error', language),
        description: language === 'ar' 
          ? "فشل في إنشاء نقطة الفصل" 
          : "Failed to create decoupling point",
        variant: "destructive",
      });
      return { success: false };
    }
  }, [points, buildNetwork, toast, language]);

  const updatePoint = useCallback(async (pointData: Partial<DecouplingPoint> & { id: string }) => {
    try {
      const updatedPoint = await updateDecouplingPoint(pointData);
      
      const validPoint: DecouplingPoint = {
        ...updatedPoint,
        name: updatedPoint.name || `${updatedPoint.type} point at ${updatedPoint.locationId}`
      };
      
      setPoints(prev => 
        prev.map(p => p.id === validPoint.id ? validPoint : p)
      );
      
      // Update network
      const updatedPoints = points.map(p => 
        p.id === validPoint.id ? validPoint : p
      );
      await buildNetwork([...updatedPoints]);
      
      toast({
        title: getTranslation('common.success', language),
        description: getTranslation('common.inventory.decouplingPointSaved', language),
      });
      
      return { success: true, point: validPoint };
    } catch (err) {
      console.error('Error updating decoupling point:', err);
      toast({
        title: getTranslation('common.error', language),
        description: language === 'ar' 
          ? "فشل في تحديث نقطة الفصل" 
          : "Failed to update decoupling point",
        variant: "destructive",
      });
      return { success: false };
    }
  }, [points, buildNetwork, toast, language]);

  const deletePoint = useCallback(async (id: string) => {
    try {
      await deleteDecouplingPoint(id);
      
      const updatedPoints = points.filter(p => p.id !== id);
      setPoints(updatedPoints);
      
      // Update network
      await buildNetwork(updatedPoints);
      
      toast({
        title: getTranslation('common.success', language),
        description: getTranslation('common.inventory.decouplingPointDeleted', language),
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting decoupling point:', err);
      toast({
        title: getTranslation('common.error', language),
        description: language === 'ar' 
          ? "فشل في حذف نقطة الفصل" 
          : "Failed to delete decoupling point",
        variant: "destructive",
      });
      return { success: false };
    }
  }, [points, buildNetwork, toast, language]);

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
