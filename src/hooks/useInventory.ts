
import { useState, useEffect } from 'react';
import { InventoryItem } from '@/types/inventory';
import { supabase } from '@/integrations/supabase/client';
import { PaginationState } from '@/types/inventory/index';

export const useInventory = (filters: {
  searchQuery: string;
  selectedLocation: string;
  selectedFamily: string;
  selectedRegion?: string;
  selectedCity?: string;
  selectedChannel?: string;
  selectedWarehouse?: string;
  selectedCategory?: string;
  selectedSubcategory?: string;
  selectedSKU?: string;
  timeRange?: { start: string; end: string; }
}) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  });

  // Fetch inventory data from Supabase or API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        
        let query = supabase.from('inventory_items').select('*');
        
        // Apply filters for database query if needed
        if (filters.selectedLocation) {
          query = query.eq('location', filters.selectedLocation);
        }
        
        if (filters.selectedCategory) {
          query = query.eq('category', filters.selectedCategory);
        }
        
        if (filters.selectedSKU) {
          query = query.eq('sku', filters.selectedSKU);
        }

        const { data, error: fetchError } = await query;
        
        if (fetchError) throw new Error(fetchError.message);
        
        // If no data, use mock data
        const inventoryData = data?.length 
          ? data 
          : generateMockInventoryData();
          
        setItems(inventoryData);
        setPagination(prev => ({ ...prev, totalItems: inventoryData.length }));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };
    
    fetchInventory();
  }, []);

  // Apply client-side filtering when filters change
  useEffect(() => {
    let result = [...items];
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(item => 
        item.sku.toLowerCase().includes(query) || 
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.productFamily.toLowerCase().includes(query)
      );
    }
    
    if (filters.selectedFamily) {
      result = result.filter(item => 
        item.productFamily === filters.selectedFamily
      );
    }
    
    if (filters.selectedRegion) {
      result = result.filter(item => 
        item.region === filters.selectedRegion
      );
    }
    
    if (filters.selectedCity) {
      result = result.filter(item => 
        item.city === filters.selectedCity
      );
    }
    
    if (filters.selectedChannel) {
      result = result.filter(item => 
        item.channel === filters.selectedChannel
      );
    }
    
    if (filters.selectedWarehouse) {
      result = result.filter(item => 
        item.warehouse === filters.selectedWarehouse
      );
    }
    
    if (filters.selectedSubcategory) {
      result = result.filter(item => 
        item.subcategory === filters.selectedSubcategory
      );
    }
    
    setFilteredItems(result);
    setPagination(prev => ({ ...prev, totalItems: result.length }));
  }, [items, filters]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const end = start + pagination.itemsPerPage;
    
    return filteredItems.slice(start, end);
  }, [filteredItems, pagination.currentPage, pagination.itemsPerPage]);

  // Handle page changes
  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Helper function to generate mock data
  const generateMockInventoryData = (): InventoryItem[] => {
    // Return mock data similar to what's in your inventoryData.ts
    return Array(20).fill(null).map((_, index) => ({
      id: `item-${index + 1}`,
      sku: `SKU00${index + 1}`,
      name: `Product ${index + 1}`,
      currentStock: Math.floor(Math.random() * 100),
      category: index % 3 === 0 ? 'Electronics' : index % 3 === 1 ? 'Clothing' : 'Food',
      subcategory: index % 2 === 0 ? 'Premium' : 'Standard',
      location: index % 4 === 0 ? 'Warehouse A' : index % 4 === 1 ? 'Warehouse B' : index % 4 === 2 ? 'Store C' : 'Store D',
      productFamily: index % 3 === 0 ? 'Family A' : index % 3 === 1 ? 'Family B' : 'Family C',
      region: index % 2 === 0 ? 'North' : 'South',
      city: index % 4 === 0 ? 'New York' : index % 4 === 1 ? 'Los Angeles' : index % 4 === 2 ? 'Chicago' : 'Houston',
      channel: index % 3 === 0 ? 'Retail' : index % 3 === 1 ? 'Online' : 'Wholesale',
      warehouse: index % 2 === 0 ? 'Main' : 'Secondary',
      onHand: Math.floor(Math.random() * 100),
      onOrder: Math.floor(Math.random() * 50),
      qualifiedDemand: Math.floor(Math.random() * 30),
      netFlowPosition: Math.floor(Math.random() * 100) - 20,
      bufferPenetration: Math.floor(Math.random() * 100),
      planningPriority: index % 5 === 0 ? 'Critical' : index % 5 === 1 ? 'High' : index % 5 === 2 ? 'Medium' : 'Low',
      redZoneSize: Math.floor(Math.random() * 20) + 10,
      yellowZoneSize: Math.floor(Math.random() * 30) + 20,
      greenZoneSize: Math.floor(Math.random() * 40) + 30,
    }));
  };

  return {
    items: paginatedData,
    allItems: items,
    filteredItems,
    loading,
    error,
    pagination,
    setPage,
    refresh: () => {}  // Placeholder for a refresh function
  };
};
