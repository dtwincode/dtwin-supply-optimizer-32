
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DecouplingPoint, DecouplingNetwork } from '@/types/inventory/decouplingTypes';
import { useToast } from '@/components/ui/use-toast';
import { getTranslation } from '@/translations';

export const useDecouplingPoints = () => {
  const [decouplingPoints, setDecouplingPoints] = useState<DecouplingPoint[]>([]);
  const [decouplingNetwork, setDecouplingNetwork] = useState<DecouplingNetwork>({ nodes: [], links: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isNetworkLoading, setIsNetworkLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  // Mock function to fetch decoupling points
  const fetchDecouplingPoints = async () => {
    // In a real app, this would be an API call
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data
      const mockPoints: DecouplingPoint[] = [
        {
          id: 'dp1',
          locationId: 'loc-main-warehouse',
          name: 'Main Warehouse Strategic Buffer',
          type: 'strategic',
          description: 'Strategic buffer for seasonal demand fluctuations',
          bufferProfileId: 'bp-standard',
          leadTimeAdjustment: 1.2,
          variabilityFactor: 1.5,
          enableDynamicAdjustment: true,
          minimumOrderQuantity: 100,
          replenishmentStrategy: 'top-of-green',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'dp2',
          locationId: 'loc-distribution-center',
          name: 'Distribution Center CODP',
          type: 'customer_order',
          description: 'Customer order decoupling point for regional distribution',
          bufferProfileId: 'bp-regional',
          leadTimeAdjustment: 1.0,
          variabilityFactor: 1.2,
          enableDynamicAdjustment: false,
          minimumOrderQuantity: 50,
          replenishmentStrategy: 'min-max',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'dp3',
          locationId: 'loc-retail',
          name: 'Retail Stock Point',
          type: 'stock_point',
          description: 'Final stock point before consumer sales',
          bufferProfileId: 'bp-retail',
          leadTimeAdjustment: 0.8,
          variabilityFactor: 1.1,
          enableDynamicAdjustment: true,
          minimumOrderQuantity: 25,
          replenishmentStrategy: 'top-of-yellow',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      setDecouplingPoints(mockPoints);
      return mockPoints;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to fetch decoupling network
  const fetchDecouplingNetwork = async () => {
    try {
      setIsNetworkLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get the points to create the network
      const points = await fetchDecouplingPoints();
      
      // Mock network data based on points
      const mockNetwork: DecouplingNetwork = {
        nodes: [
          {
            id: 'supplier1',
            type: 'supplier',
            label: 'Raw Material Supplier',
            level: 0,
            metadata: { country: 'China', reliability: 0.85 }
          },
          ...points.map(point => ({
            id: point.id,
            type: 'decoupling',
            label: point.name,
            level: 1,
            metadata: { locationId: point.locationId },
            decouplingType: point.type
          })),
          {
            id: 'customer1',
            type: 'customer',
            label: 'Retail Customers',
            level: 2,
            metadata: { segment: 'B2C', priority: 'high' }
          }
        ],
        links: [
          {
            source: 'supplier1',
            target: 'dp1',
            type: 'material_flow',
            metadata: { leadTime: 14 }
          },
          {
            source: 'dp1',
            target: 'dp2',
            type: 'material_flow',
            metadata: { leadTime: 7 }
          },
          {
            source: 'dp2',
            target: 'dp3',
            type: 'material_flow',
            metadata: { leadTime: 3 }
          },
          {
            source: 'dp3',
            target: 'customer1',
            type: 'material_flow',
            metadata: { leadTime: 1 }
          }
        ]
      };

      setDecouplingNetwork(mockNetwork);
      return mockNetwork;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsNetworkLoading(false);
    }
  };

  // Function to create a new decoupling point
  const createDecouplingPoint = async (data: Omit<DecouplingPoint, 'id'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create new decoupling point with generated ID
      const newPoint: DecouplingPoint = {
        ...data,
        id: `dp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Update state with new point
      setDecouplingPoints(prev => [...prev, newPoint]);

      toast({
        title: getTranslation("common.inventory.success", language),
        description: getTranslation("common.inventory.decouplingPointSaved", language),
      });

      return newPoint;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      toast({
        title: getTranslation("common.error", language),
        description: error.message,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  // Function to delete a decoupling point
  const deleteDecouplingPoint = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update state by filtering out the deleted point
      setDecouplingPoints(prev => prev.filter(p => p.id !== id));

      toast({
        title: getTranslation("common.inventory.success", language),
        description: getTranslation("common.inventory.decouplingPointDeleted", language),
      });

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      toast({
        title: getTranslation("common.error", language),
        description: error.message,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  // Initial data load
  useEffect(() => {
    fetchDecouplingNetwork().catch(err => {
      console.error("Error fetching decoupling network:", err);
    });
  }, []);

  return {
    decouplingPoints,
    decouplingNetwork,
    isLoading,
    isNetworkLoading,
    error,
    createDecouplingPoint,
    deleteDecouplingPoint,
    refreshDecouplingPoints: fetchDecouplingPoints,
    refreshDecouplingNetwork: fetchDecouplingNetwork
  };
};
