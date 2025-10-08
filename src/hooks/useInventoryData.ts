import { useState, useEffect, useCallback } from 'react';
import { getInventoryData, getBreachAlerts, invalidateInventoryCache } from '@/services/inventoryDataService';
import { applyInventoryFilters, InventoryFilters } from '@/utils/inventoryFilters';
import { calculateAllMetrics, DDMRPMetrics, getBufferStatusCounts, BufferStatusCounts } from '@/utils/inventoryCalculations';
import { toast } from 'sonner';

export interface UseInventoryDataReturn {
  data: any[];
  filteredData: any[];
  metrics: DDMRPMetrics;
  statusCounts: BufferStatusCounts;
  breaches: any[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

/**
 * Unified hook for inventory data with calculations
 * Replaces scattered data fetching and calculation logic
 */
export const useInventoryData = (filters: InventoryFilters = {}) => {
  const [data, setData] = useState<any[]>([]);
  const [breaches, setBreaches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [inventoryData, breachData] = await Promise.all([
        getInventoryData(forceRefresh),
        getBreachAlerts(forceRefresh),
      ]);
      
      setData(inventoryData);
      setBreaches(breachData);
      
      if (forceRefresh) {
        toast.success('Inventory data refreshed');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load inventory data');
      setError(error);
      toast.error(error.message);
      console.error('Error loading inventory data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(async () => {
    invalidateInventoryCache();
    await loadData(true);
  }, [loadData]);

  // Apply filters
  const filteredData = applyInventoryFilters(data, filters);

  // Calculate metrics
  const metrics = calculateAllMetrics(filteredData, breaches);
  const statusCounts = getBufferStatusCounts(filteredData);

  return {
    data,
    filteredData,
    metrics,
    statusCounts,
    breaches,
    isLoading,
    error,
    refresh,
  };
};
