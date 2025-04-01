
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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // Fetch items from the inventory_planning_view
        const filters = {
          searchQuery: searchQuery,
          locationId: locationId !== 'all' ? locationId : undefined,
          priorityOnly: priorityOnly
        };
        
        console.log("Fetching inventory data with filters:", filters);
        const planningViewData = await fetchInventoryPlanningView(filters);
        
        if (planningViewData.length > 0) {
          console.log("Successfully fetched inventory data:", planningViewData.length, "items");
          
          // Sort by priority if needed
          let sortedData = [...planningViewData];
          if (priorityOnly) {
            // Sort by buffer penetration level (highest penetration first)
            sortedData = sortedData.sort((a, b) => {
              const aPenetration = a.quantity_on_hand && a.max_stock_level 
                ? (a.quantity_on_hand / a.max_stock_level) 
                : 1;
              const bPenetration = b.quantity_on_hand && b.max_stock_level 
                ? (b.quantity_on_hand / b.max_stock_level) 
                : 1;
              return aPenetration - bPenetration;
            });
          }
          
          // Handle pagination
          const startIndex = (pagination.page - 1) * pagination.limit;
          const endIndex = startIndex + pagination.limit;
          const paginatedItems = sortedData.slice(startIndex, endIndex);
          
          setItems(paginatedItems);
          
          setPagination(prev => ({
            ...prev,
            total: Math.ceil(sortedData.length / pagination.limit),
            totalItems: sortedData.length
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
    setLoading(true);
    try {
      const planningViewData = await fetchInventoryPlanningView({
        searchQuery,
        locationId: locationId !== 'all' ? locationId : undefined,
        priorityOnly
      });
      
      // Sort by priority if needed
      let sortedData = [...planningViewData];
      if (priorityOnly) {
        // Sort by buffer penetration level (highest penetration first)
        sortedData = sortedData.sort((a, b) => {
          const aPenetration = a.quantity_on_hand && a.max_stock_level 
            ? (a.quantity_on_hand / a.max_stock_level) 
            : 1;
          const bPenetration = b.quantity_on_hand && b.max_stock_level 
            ? (b.quantity_on_hand / b.max_stock_level) 
            : 1;
          return aPenetration - bPenetration;
        });
      }
      
      if (sortedData.length > 0) {
        // Handle pagination
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        const paginatedItems = sortedData.slice(startIndex, endIndex);
        
        setItems(paginatedItems);
        
        setPagination(prev => ({
          ...prev,
          total: Math.ceil(sortedData.length / prev.limit),
          totalItems: sortedData.length
        }));
        
        toast({
          title: "Data refreshed",
          description: `Loaded ${sortedData.length} inventory items.`,
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
