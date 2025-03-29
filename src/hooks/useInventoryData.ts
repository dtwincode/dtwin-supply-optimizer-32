
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  InventoryItem, 
  SKUClassification,
  PaginationState 
} from '@/types/inventory';

interface UseInventoryDataProps {
  initialPage?: number;
  initialLimit?: number;
  searchQuery?: string;
  locationId?: string;
}

interface InventoryDataResult {
  items: InventoryItem[];
  skuClassifications: SKUClassification[];
  replenishmentData: any[]; // Will be typed properly later
  loading: boolean;
  error: Error | null;
  pagination: PaginationState;
  paginate: (page: number, limit?: number) => void;
  refreshData: () => Promise<void>;
}

export const useInventoryData = ({
  initialPage = 1,
  initialLimit = 10,
  searchQuery = '',
  locationId = ''
}: UseInventoryDataProps = {}): InventoryDataResult => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [skuClassifications, setSkuClassifications] = useState<SKUClassification[]>([]);
  const [replenishmentData, setReplenishmentData] = useState<any[]>([]);
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

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      
      // Fetch inventory data with joined tables for more complete information
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory_data")
        .select(`
          inventory_id,
          product_id,
          location_id,
          quantity_on_hand,
          reserved_qty,
          available_qty,
          last_updated,
          buffer_profile_id,
          decoupling_point
        `)
        .order('last_updated', { ascending: false })
        .range(
          (pagination.page - 1) * pagination.limit, 
          pagination.page * pagination.limit - 1
        );

      if (inventoryError) throw inventoryError;

      // Fetch SKU classifications separately
      const { data: classificationsData, error: classificationError } = await supabase
        .from("sku_classification")
        .select("*");

      if (classificationError) throw classificationError;

      // Get count of total inventory items for pagination
      const { count, error: countError } = await supabase
        .from("inventory_data")
        .select("inventory_id", { count: 'exact', head: true });

      if (countError) throw countError;

      // Transform inventory data to match our frontend model
      const enrichedItems = inventoryData?.map(item => {
        const matchingClassification = classificationsData?.find(
          c => c.sku === item.product_id
        );
        
        return {
          id: item.inventory_id,
          inventory_id: item.inventory_id,
          sku: item.product_id,
          product_id: item.product_id,
          location_id: item.location_id,
          quantity_on_hand: item.quantity_on_hand,
          reserved_qty: item.reserved_qty || 0,
          available_qty: item.available_qty || (item.quantity_on_hand - (item.reserved_qty || 0)),
          last_updated: item.last_updated,
          buffer_profile_id: item.buffer_profile_id,
          decoupling_point: item.decoupling_point,
          currentStock: item.quantity_on_hand,
          onHand: item.quantity_on_hand,
          classification: matchingClassification ? {
            leadTimeCategory: matchingClassification.lead_time_category,
            variabilityLevel: matchingClassification.variability_level,
            criticality: matchingClassification.criticality,
            score: matchingClassification.score
          } : undefined
        } as InventoryItem;
      }) || [];

      setItems(enrichedItems);
      setSkuClassifications(classificationsData || []);
      
      setPagination({
        ...pagination,
        total: Math.ceil((count || 0) / pagination.limit),
        totalItems: count || 0
      });
      
      setError(null);
    } catch (err) {
      console.error("Error fetching inventory data:", err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const fetchReplenishmentData = async () => {
    try {
      const { data, error } = await supabase
        .from("replenishment_data")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      setReplenishmentData(data || []);
    } catch (err) {
      console.error("Error fetching replenishment data:", err);
      // We don't set the main error state here, just log it
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchInventoryData();
      await fetchReplenishmentData();
    };

    fetchData();
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
    await fetchInventoryData();
    await fetchReplenishmentData();
  };

  return { 
    items, 
    skuClassifications, 
    replenishmentData,
    loading, 
    error, 
    pagination, 
    paginate,
    refreshData
  };
};
