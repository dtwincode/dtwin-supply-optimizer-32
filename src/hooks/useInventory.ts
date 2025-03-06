
import { useState, useEffect } from 'react';
import { getInventoryItems } from '@/services/inventoryService';
import { InventoryItem } from '@/types/inventory';
import { PaginationState } from '@/types/inventory/databaseTypes';

export const useInventory = (initialPage = 1, initialLimit = 10) => {
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
        const data = await getInventoryItems();
        setItems(data);
        
        setPagination({
          page: pagination.page,
          limit: pagination.limit,
          total: data.length,
          currentPage: pagination.page,
          itemsPerPage: pagination.limit,
          totalItems: data.length
        });
        
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [pagination.page, pagination.limit]);

  const paginate = (page: number, limit: number = pagination.limit) => {
    setPagination({
      ...pagination,
      page,
      limit,
      currentPage: page,
      itemsPerPage: limit
    });
  };

  return { items, loading, error, pagination, paginate };
};
