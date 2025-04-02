
import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, PaginationState } from '@/types/inventory';
import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';
import { useToast } from './use-toast';

export const useInventory = (
  defaultPage = 1,
  defaultLimit = 10,
  searchQuery?: string,
  locationFilter?: string,
  priorityOnly = false
) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: defaultPage,
    limit: defaultLimit,
    total: 0,
    totalPages: 1,
    currentPage: defaultPage,
    itemsPerPage: defaultLimit,
    totalItems: 0
  });
  const { toast } = useToast();

  const fetchData = useCallback(
    async (page = defaultPage, limit = defaultLimit) => {
      setLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * limit;
        const result = await fetchInventoryPlanningView({
          searchQuery,
          locationId: locationFilter,
          priorityOnly,
          limit,
          offset
        });

        // Extract totalCount (attached to the result by the service)
        const totalCount = (result as any).totalCount || result.length;
        
        setItems(result);
        setPagination({
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          currentPage: page,
          itemsPerPage: limit,
          totalItems: totalCount
        });
      } catch (err: any) {
        console.error('Error fetching inventory data:', err);
        setError(err.message || 'Failed to fetch inventory data');
        toast({
          title: 'Error',
          description: 'Failed to load inventory data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, locationFilter, priorityOnly]
  );

  useEffect(() => {
    fetchData(defaultPage, defaultLimit);
  }, [fetchData, defaultPage, defaultLimit, searchQuery, locationFilter, priorityOnly]);

  const paginate = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        fetchData(page, pagination.limit);
      }
    },
    [pagination.totalPages, pagination.limit, fetchData]
  );

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchData(pagination.currentPage, pagination.limit);
      toast({
        title: "Data refreshed",
        description: "Inventory data has been updated."
      });
    } catch (err) {
      console.error("Error refreshing data:", err);
      toast({
        title: "Error",
        description: "Failed to refresh inventory data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  }, [pagination.currentPage, pagination.limit, fetchData]);

  return {
    items,
    loading,
    error,
    pagination,
    paginate,
    refreshData,
    isRefreshing
  };
};
