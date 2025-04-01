
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
        
        // First, check if inventory_planning_view exists and has data
        const { data: planningViewData, error: planningViewError, count: planningViewCount } = await supabase
          .from("inventory_planning_view")
          .select("*", { count: 'exact' });
        
        if (planningViewError) {
          console.error('Error checking inventory_planning_view:', planningViewError);
          throw planningViewError;
        }
        
        // If we have data in inventory_planning_view, use it
        if (planningViewData && planningViewData.length > 0) {
          // Apply filters if provided
          let query = supabase
            .from("inventory_planning_view")
            .select("*, location_master!inner(warehouse, city, region, channel)");
          
          // Apply search filter if provided
          if (searchQuery && searchQuery.trim() !== '') {
            query = query.ilike('product_id', `%${searchQuery}%`);
          }
          
          // Apply location filter if provided
          if (locationId && locationId.trim() !== '' && locationId !== 'all') {
            query = query.eq('location_id', locationId);
          }
          
          // Apply pagination
          const from = (pagination.page - 1) * pagination.limit;
          const to = pagination.page * pagination.limit - 1;
          
          const { data, error: fetchError, count } = await query
            .order('product_id', { ascending: true })
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
        } else {
          // Fall back to inventory_data
          let query = supabase
            .from("inventory_data")
            .select("*, location_master!inner(warehouse, city, region, channel)");
          
          // Apply filters
          if (searchQuery && searchQuery.trim() !== '') {
            query = query.ilike('product_id', `%${searchQuery}%`);
          }
          
          if (locationId && locationId.trim() !== '' && locationId !== 'all') {
            query = query.eq('location_id', locationId);
          }
          
          const from = (pagination.page - 1) * pagination.limit;
          const to = pagination.page * pagination.limit - 1;
          
          const { data, error: fetchError, count } = await query
            .order('last_updated', { ascending: false })
            .range(from, to)
            .select('*', { count: 'exact' });

          if (fetchError) throw fetchError;
          
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
        }
      } catch (err) {
        console.error('Error fetching inventory data:', err);
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
      const { data: planningViewData, error: planningViewError } = await supabase
        .from("inventory_planning_view")
        .select("*");
      
      if (planningViewError) {
        console.error('Error checking inventory_planning_view:', planningViewError);
        
        // Fall back to inventory_data
        const { data, error: fetchError } = await supabase
          .from("inventory_data")
          .select("*");

        if (fetchError) throw fetchError;
        
        if (data) {
          setItems(data as InventoryItem[]);
        }
      } else if (planningViewData && planningViewData.length > 0) {
        setItems(planningViewData as InventoryItem[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error, pagination, paginate, refreshData };
};
