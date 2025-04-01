
import { useState, useEffect } from 'react';
import { InventoryItem } from '@/types/inventory';
import { PaginationState } from '@/types/inventory/index';
import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';
import { useToast } from '@/hooks/use-toast';

export const useInventory = (
  initialPage = 1, 
  initialLimit = 10, 
  searchQuery = '', 
  locationId = '',
  priorityOnly = false
) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const [pagination, setPagination] = useState<PaginationState>({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    currentPage: initialPage,
    itemsPerPage: initialLimit,
    totalItems: 0
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchItems = async () => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      
      // Improved filtering directly at database level to minimize data transfer
      const filters = {
        searchQuery: searchQuery,
        locationId: locationId !== 'all' ? locationId : undefined,
        priorityOnly: priorityOnly,
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit
      };
      
      console.log("Fetching inventory data with filters:", filters);
      const planningViewData = await fetchInventoryPlanningView(filters);
      
      if (planningViewData.length > 0) {
        console.log(`Successfully fetched ${planningViewData.length} inventory items`);
        
        setItems(planningViewData);
        
        // We also need to get the total count of items for pagination
        // This is now handled in the service layer with a count query
        const totalItems = planningViewData.totalCount || planningViewData.length;
        
        setPagination(prev => ({
          ...prev,
          total: Math.ceil(totalItems / pagination.limit),
          totalItems: totalItems
        }));
      } else {
        console.log("No inventory data found");
        setItems([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalItems: 0
        }));
      }
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        title: "Error",
        description: "Failed to load inventory data. Please try again.",
        variant: "destructive",
      });
      setItems([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [pagination.page, pagination.limit, searchQuery, locationId, priorityOnly, toast]);

  const paginate = (page: number, limit: number = pagination.limit) => {
    setPagination({
      ...pagination,
      page,
      limit,
      currentPage: page,
      itemsPerPage: limit
    });
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchItems();
    toast({
      title: "Data refreshed",
      description: "Inventory data has been updated."
    });
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
