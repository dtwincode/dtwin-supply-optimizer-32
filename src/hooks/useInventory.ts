
import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, PaginationState } from '@/types/inventory';
import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';

export const useInventory = (
  initialPage: number = 1,
  initialLimit: number = 25,
  searchQuery: string = '',
  locationFilter: string = '',
  priorityOnly: boolean = false
) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    totalPages: 0,
    currentPage: initialPage,
    itemsPerPage: initialLimit,
    totalItems: 0
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (pagination.page - 1) * pagination.limit;
      
      const data = await fetchInventoryPlanningView({
        searchQuery,
        locationId: locationFilter,
        priorityOnly,
        limit: pagination.limit,
        offset
      });

      setItems(data);
      
      // Update pagination with the total count if available
      if ('totalCount' in data) {
        const totalCount = (data as any).totalCount || 0;
        setPagination(prev => ({
          ...prev,
          total: totalCount,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / prev.limit)
        }));
      }
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, locationFilter, priorityOnly]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to change page
  const paginate = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page,
      currentPage: page
    }));
  };

  // Function to refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
    } finally {
      setIsRefreshing(false);
    }
  };

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
