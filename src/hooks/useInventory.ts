
import { useState, useEffect } from 'react';
import { InventoryItem } from '@/types/inventory';
import { PaginationState } from '@/types/inventory/index';
import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';
import { useToast } from '@/hooks/use-toast';

export const useInventory = (initialPage = 1, initialLimit = 10, searchQuery = '', locationId = '') => {
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // Fetch items from the inventory_planning_view
        const filters = {
          searchQuery: searchQuery,
          locationId: locationId !== 'all' ? locationId : undefined
        };
        
        console.log("Fetching inventory data with filters:", filters);
        const planningViewData = await fetchInventoryPlanningView(filters);
        
        if (planningViewData.length > 0) {
          console.log("Successfully fetched inventory data:", planningViewData.length, "items");
          
          // Handle pagination
          const startIndex = (pagination.page - 1) * pagination.limit;
          const endIndex = startIndex + pagination.limit;
          const paginatedItems = planningViewData.slice(startIndex, endIndex);
          
          setItems(paginatedItems);
          
          setPagination(prev => ({
            ...prev,
            total: Math.ceil(planningViewData.length / pagination.limit),
            totalItems: planningViewData.length
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
      }
    };

    fetchItems();
  }, [pagination.page, pagination.limit, searchQuery, locationId, toast]);

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
    setLoading(true);
    try {
      const planningViewData = await fetchInventoryPlanningView({
        searchQuery,
        locationId: locationId !== 'all' ? locationId : undefined
      });
      
      if (planningViewData.length > 0) {
        // Handle pagination
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedItems = planningViewData.slice(startIndex, endIndex);
        
        setItems(paginatedItems);
        
        setPagination(prev => ({
          ...prev,
          total: Math.ceil(planningViewData.length / prev.limit),
          totalItems: planningViewData.length
        }));
        
        toast({
          title: "Data refreshed",
          description: `Loaded ${planningViewData.length} inventory items.`,
        });
      } else {
        setItems([]);
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalItems: 0
        }));
        toast({
          title: "No data found",
          description: "No inventory items match your search criteria.",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        title: "Error",
        description: "Failed to refresh inventory data.",
        variant: "destructive",
      });
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error, pagination, paginate, refreshData };
};
