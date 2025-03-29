
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { InventoryItem } from '@/types/inventory';
import { PaginationState } from '@/types/inventory/databaseTypes';

export const useInventory = (initialPage = 1, initialLimit = 10, searchQuery = '', locationId = '') => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
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
        
        // Build query with filters
        let query = supabase
          .from("inventory_data")
          .select("*");
        
        // Apply search filter if provided
        if (searchQuery && searchQuery.trim() !== '') {
          query = query.ilike('product_id', `%${searchQuery}%`);
        }
        
        // Apply location filter if provided
        if (locationId && locationId.trim() !== '') {
          query = query.eq('location_id', locationId);
        }
        
        // Apply pagination
        const from = (pagination.page - 1) * pagination.limit;
        const to = pagination.page * pagination.limit - 1;
        
        const { data, error: fetchError, count } = await query
          .order('last_updated', { ascending: false })
          .range(from, to)
          .select('*', { count: 'exact' });

        if (fetchError) throw fetchError;
        
        // Get the total count for pagination
        const totalCount = count || 0;
        
        if (data) {
          setItems(data as InventoryItem[]);
          setPagination({
            page: pagination.page,
            limit: pagination.limit,
            total: Math.ceil(totalCount / pagination.limit),
            currentPage: pagination.page,
            itemsPerPage: pagination.limit,
            totalItems: totalCount
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [pagination.page, pagination.limit, searchQuery, locationId]);

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
      const { data, error: fetchError } = await supabase
        .from("inventory_data")
        .select("*");

      if (fetchError) throw fetchError;
      
      if (data) {
        setItems(data as InventoryItem[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error, pagination, paginate, refreshData };
};
