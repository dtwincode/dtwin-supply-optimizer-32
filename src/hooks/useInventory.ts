
import { useState, useEffect, useCallback } from 'react';
import { InventoryItem, InventoryFilters, PaginationState } from '@/types/inventory';
import { getInventoryItems } from '@/services/inventoryService';
import { useToast } from '@/hooks/use-toast';

export function useInventory(initialFilters?: Partial<InventoryFilters>) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Partial<Record<string, string>>>({
    searchQuery: '',
    selectedLocation: '',
    selectedFamily: '',
    ...initialFilters
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  });
  const { toast } = useToast();

  const fetchInventoryItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data, count } = await getInventoryItems(
        filters, 
        pagination.currentPage, 
        pagination.itemsPerPage
      );
      
      setItems(data);
      setPagination(prev => ({ ...prev, totalItems: count }));
    } catch (error) {
      console.error('Error fetching inventory:', error);
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.itemsPerPage, toast]);

  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  const updateFilters = useCallback((newFilters: Partial<Record<string, string>>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page on filter change
  }, []);

  const changePage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  return {
    items,
    loading,
    filters,
    pagination,
    updateFilters,
    changePage,
    refreshData: fetchInventoryItems
  };
}
