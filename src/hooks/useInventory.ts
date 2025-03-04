
import { useState, useEffect, useCallback, useMemo } from 'react';
import { getInventoryItems, updateInventoryItem } from '@/services/inventoryService';
import { InventoryItem, InventoryFilters } from '@/types/inventory';
import { useToast } from '@/hooks/use-toast';
import { PaginationState } from '@/types/inventory/databaseTypes';

export function useInventory(initialFilters: Partial<InventoryFilters> = {}) {
  const [allItems, setAllItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<Partial<InventoryFilters>>({
    searchQuery: '',
    selectedLocation: '',
    selectedFamily: '',
    selectedRegion: '',
    selectedCity: '',
    selectedChannel: '',
    selectedWarehouse: '',
    selectedCategory: '',
    selectedSubcategory: '',
    selectedSKU: '',
    ...initialFilters
  });
  
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0
  });
  
  const { toast } = useToast();

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInventoryItems();
      setAllItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch inventory data'));
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Apply filters to inventory items
  useEffect(() => {
    let result = [...allItems];
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(item => 
        item.sku.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.productFamily.toLowerCase().includes(query)
      );
    }
    
    if (filters.selectedLocation) {
      result = result.filter(item => item.location === filters.selectedLocation);
    }
    
    if (filters.selectedFamily) {
      result = result.filter(item => item.productFamily === filters.selectedFamily);
    }
    
    if (filters.selectedRegion) {
      result = result.filter(item => item.region === filters.selectedRegion);
    }
    
    if (filters.selectedCity) {
      result = result.filter(item => item.city === filters.selectedCity);
    }
    
    if (filters.selectedChannel) {
      result = result.filter(item => item.channel === filters.selectedChannel);
    }
    
    if (filters.selectedWarehouse) {
      result = result.filter(item => item.warehouse === filters.selectedWarehouse);
    }
    
    if (filters.selectedCategory) {
      result = result.filter(item => item.category === filters.selectedCategory);
    }
    
    if (filters.selectedSubcategory) {
      result = result.filter(item => item.subcategory === filters.selectedSubcategory);
    }
    
    if (filters.selectedSKU) {
      result = result.filter(item => item.sku === filters.selectedSKU);
    }
    
    setFilteredItems(result);
    setPagination(prev => ({
      ...prev,
      total: result.length
    }));
  }, [allItems, filters]);

  // Initial data fetch
  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Get paginated items
  const items = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredItems.slice(start, end);
  }, [filteredItems, pagination.page, pagination.limit]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<InventoryFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  }, []);

  // Change page
  const changePage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  }, []);

  // Set page
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      page
    }));
  }, []);

  return {
    items,
    allItems,
    filteredItems,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    refreshData: fetchInventory,
    setPage,
    refresh: fetchInventory
  };
}
