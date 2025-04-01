
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
          let query = supabase
            .from("inventory_data")
            .select("*");
            
          if (searchQuery) {
            query = query.ilike('product_id', `%${searchQuery}%`);
          }
          
          if (locationId && locationId !== 'all') {
            query = query.eq('location_id', locationId);
          }
            
          const { data, count, error } = await query;
          
          if (error) throw error;
          
          if (data && data.length > 0) {
            const transformedData: InventoryItem[] = await Promise.all(data.map(async (item) => {
              // Get location data separately to avoid the relationship issue
              const { data: locationData } = await supabase
                .from("location_master")
                .select("warehouse, city, region, channel")
                .eq('location_id', item.location_id)
                .maybeSingle();
                
              return {
                id: item.inventory_id || `${item.product_id}-${item.location_id}`,
                product_id: item.product_id,
                sku: item.product_id,
                name: item.product_id, // Use product_id as name if not available
                currentStock: item.quantity_on_hand,
                onHand: item.quantity_on_hand,
                quantity_on_hand: item.quantity_on_hand,
                available_qty: item.available_qty,
                reserved_qty: item.reserved_qty,
                location: item.location_id,
                location_id: item.location_id,
                warehouse: locationData?.warehouse || '',
                city: locationData?.city || '',
                region: locationData?.region || '',
                channel: locationData?.channel || '',
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
            }));
            
            // Handle pagination
            const startIndex = (pagination.page - 1) * pagination.limit;
            const endIndex = startIndex + pagination.limit;
            const paginatedItems = transformedData.slice(startIndex, endIndex);
            
            setItems(paginatedItems);
            
            setPagination({
              page: pagination.page,
              limit: pagination.limit,
              total: Math.ceil(transformedData.length / pagination.limit),
              currentPage: pagination.page,
              itemsPerPage: pagination.limit,
              totalItems: transformedData.length
            });
          } else {
            setItems([]);
            setPagination(prev => ({
              ...prev,
              total: 0,
              totalItems: 0
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching inventory data:', err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setItems([]);
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
      const planningViewData = await fetchInventoryPlanningView({
        searchQuery,
        locationId: locationId !== 'all' ? locationId : undefined
      });
      
      if (planningViewData && planningViewData.length > 0) {
        // Extract product and location IDs
        const productIds = planningViewData.map(item => item.product_id || '').filter(Boolean);
        const locationIds = planningViewData.map(item => item.location_id || '').filter(Boolean);
        
        // Fetch inventory data
        const inventoryData = await fetchInventoryData(productIds, locationIds);
        
        // Combine the data
        const combinedData = planningViewData.map(item => {
          const key = `${item.product_id}-${item.location_id}`;
          const inventoryItem = inventoryData[key] || {};
          
          return {
            ...item,
            ...inventoryItem,
            id: item.id || key,
            onHand: inventoryItem.quantity_on_hand || item.average_daily_usage || 0,
            currentStock: inventoryItem.quantity_on_hand || item.average_daily_usage || 0
          };
        });
        
        setItems(combinedData);
        
        setPagination(prev => ({
          ...prev,
          total: Math.ceil(combinedData.length / prev.limit),
          totalItems: combinedData.length
        }));
      } else {
        // Fall back to basic inventory data
        const { data, error } = await supabase
          .from("inventory_data")
          .select("*");

        if (error) throw error;
        
        if (data && data.length > 0) {
          const transformedData = await Promise.all(data.map(async (item) => {
            // Get location data separately
            const { data: locationData } = await supabase
              .from("location_master")
              .select("warehouse, city, region, channel")
              .eq('location_id', item.location_id)
              .maybeSingle();
              
            return {
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
              warehouse: locationData?.warehouse || '',
              city: locationData?.city || '',
              region: locationData?.region || '',
              channel: locationData?.channel || '',
              last_updated: item.last_updated,
              decoupling_point: item.decoupling_point,
              classification: {
                leadTimeCategory: "medium",
                variabilityLevel: "medium",
                criticality: item.decoupling_point ? "high" : "low",
                score: 0
              }
            };
          }));
          
          setItems(transformedData);
          
          setPagination(prev => ({
            ...prev,
            total: Math.ceil(transformedData.length / prev.limit),
            totalItems: transformedData.length
          }));
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return { items, loading, error, pagination, paginate, refreshData };
};
