
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { InventoryItem } from '@/types/inventory';
import { PaginationState } from '@/types/inventory/index';
import { fetchInventoryPlanningView, fetchInventoryData } from '@/lib/inventory-planning.service';

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
        
        // Fetch items from the inventory_planning_view
        const filters = {
          searchQuery: searchQuery,
          locationId: locationId !== 'all' ? locationId : undefined
        };
        
        const planningViewData = await fetchInventoryPlanningView(filters);
        
        if (planningViewData && planningViewData.length > 0) {
          // Extract product and location IDs to fetch additional inventory data
          const productIds = planningViewData.map(item => item.product_id || '').filter(Boolean);
          const locationIds = planningViewData.map(item => item.location_id || '').filter(Boolean);
          
          // Fetch inventory data to supplement the planning view data
          const inventoryData = await fetchInventoryData(productIds, locationIds);
          
          // Combine the data
          const combinedData = planningViewData.map(item => {
            const key = `${item.product_id}-${item.location_id}`;
            const inventoryItem = inventoryData[key] || {};
            
            return {
              ...item,
              ...inventoryItem,
              // Ensure id is set
              id: item.id || key,
              // Set onHand from inventory_data if available
              onHand: inventoryItem.quantity_on_hand || item.average_daily_usage || 0,
              currentStock: inventoryItem.quantity_on_hand || item.average_daily_usage || 0
            };
          });
          
          // Handle pagination
          const startIndex = (pagination.page - 1) * pagination.limit;
          const endIndex = startIndex + pagination.limit;
          const paginatedItems = combinedData.slice(startIndex, endIndex);
          
          setItems(paginatedItems);
          
          setPagination(prev => ({
            ...prev,
            total: Math.ceil(combinedData.length / pagination.limit),
            totalItems: combinedData.length
          }));
        } else {
          // Fallback to inventory_data if planning view is empty
          const { data, count, error } = await supabase
            .from("inventory_data")
            .select("*, location_master!inner(warehouse, city, region, channel)", { count: 'exact' })
            .range((pagination.page - 1) * pagination.limit, pagination.page * pagination.limit - 1);
          
          if (error) throw error;
          
          if (data) {
            const transformedData: InventoryItem[] = data.map(item => {
              const locationData = item.location_master || {};
              
              return {
                id: item.inventory_id || `${item.product_id}-${item.location_id}`,
                product_id: item.product_id,
                sku: item.product_id,
                name: item.product_id,
                currentStock: item.quantity_on_hand,
                onHand: item.quantity_on_hand,
                quantity_on_hand: item.quantity_on_hand,
                available_qty: item.available_qty,
                reserved_qty: item.reserved_qty,
                location: item.location_id,
                location_id: item.location_id,
                warehouse: locationData.warehouse,
                city: locationData.city,
                region: locationData.region,
                channel: locationData.channel,
                last_updated: item.last_updated,
                decoupling_point: item.decoupling_point,
                
                // Create classification based on limited data
                classification: {
                  leadTimeCategory: "medium",
                  variabilityLevel: "medium",
                  criticality: item.decoupling_point ? "high" : "low",
                  score: 0
                }
              };
            });
            
            setItems(transformedData);
            
            setPagination({
              page: pagination.page,
              limit: pagination.limit,
              total: Math.ceil((count || 0) / pagination.limit),
              currentPage: pagination.page,
              itemsPerPage: pagination.limit,
              totalItems: count || 0
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
      const planningViewData = await fetchInventoryPlanningView();
      
      if (planningViewData && planningViewData.length > 0) {
        setItems(planningViewData);
      } else {
        const { data, error } = await supabase
          .from("inventory_data")
          .select("*");

        if (error) throw error;
        
        if (data) {
          const transformedData: InventoryItem[] = data.map(item => ({
            id: item.inventory_id || `${item.product_id}-${item.location_id}`,
            product_id: item.product_id,
            sku: item.product_id,
            quantity_on_hand: item.quantity_on_hand,
            onHand: item.quantity_on_hand,
            currentStock: item.quantity_on_hand,
            available_qty: item.available_qty,
            reserved_qty: item.reserved_qty,
            location: item.location_id,
            location_id: item.location_id,
            last_updated: item.last_updated,
            decoupling_point: item.decoupling_point,
            classification: {
              leadTimeCategory: "medium",
              variabilityLevel: "medium",
              criticality: item.decoupling_point ? "high" : "low",
              score: 0
            }
          }));
          
          setItems(transformedData);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error, pagination, paginate, refreshData };
};
