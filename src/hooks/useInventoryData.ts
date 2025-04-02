import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  InventoryItem, 
  PaginationState,
  ReplenishmentData,
  SKUClassification
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
  replenishmentData: ReplenishmentData[]; 
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
  const [replenishmentData, setReplenishmentData] = useState<ReplenishmentData[]>([]);
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
          decoupling_point
        `)
        .order('last_updated', { ascending: false })
        .range(
          (pagination.page - 1) * pagination.limit, 
          pagination.page * pagination.limit - 1
        );

      if (inventoryError) throw inventoryError;

      const { data: classificationsData, error: classificationError } = await supabase
        .from("product_classification")
        .select("*");

      if (classificationError) throw classificationError;
      
      const { data: planningData, error: planningError } = await supabase
        .from("inventory_planning_view")
        .select("*");
        
      if (planningError) throw planningError;

      const { count, error: countError } = await supabase
        .from("inventory_data")
        .select("inventory_id", { count: 'exact', head: true });

      if (countError) throw countError;

      const enrichedItems = inventoryData?.map(item => {
        const matchingClassification = classificationsData?.find(
          c => c.product_id === item.product_id && c.location_id === item.location_id
        );
        
        const matchingPlanningData = planningData?.find(
          p => p.product_id === item.product_id && p.location_id === item.location_id
        );

        const classification = matchingClassification ? {
          leadTimeCategory: matchingClassification.lead_time_category as 'short' | 'medium' | 'long',
          variabilityLevel: matchingClassification.variability_level as 'low' | 'medium' | 'high',
          criticality: matchingClassification.criticality as 'low' | 'medium' | 'high',
          score: matchingClassification.score
        } : undefined;
        
        const inventoryItem: InventoryItem = {
          id: item.inventory_id,
          sku: item.product_id,
          name: item.product_id,
          location: item.location_id,
          onHand: item.quantity_on_hand,
          currentStock: item.quantity_on_hand,
          product_id: item.product_id,
          location_id: item.location_id,
          decoupling_point: item.decoupling_point || false,
          classification,
          ...(matchingPlanningData ? {
            bufferProfileId: matchingPlanningData.buffer_profile_id,
            adu: matchingPlanningData.average_daily_usage,
            leadTimeDays: matchingPlanningData.lead_time_days,
            variabilityFactor: matchingPlanningData.demand_variability,
            minStockLevel: matchingPlanningData.min_stock_level,
            safetyStock: matchingPlanningData.safety_stock,
            maxStockLevel: matchingPlanningData.max_stock_level,
          } : {})
        };

        return inventoryItem;
      }) || [];

      const transformedClassifications: SKUClassification[] = classificationsData?.map(c => ({
        id: `${c.product_id}-${c.location_id}`,
        sku: c.product_id,
        productId: c.product_id,
        product_id: c.product_id,
        location_id: c.location_id,
        leadTimeCategory: c.lead_time_category as 'short' | 'medium' | 'long',
        variabilityLevel: c.variability_level as 'low' | 'medium' | 'high',
        criticality: c.criticality as 'low' | 'medium' | 'high',
        score: c.score,
        classification: c.classification_label,
        category: c.classification_label,
        lastUpdated: c.created_at
      })) || [];

      setItems(enrichedItems);
      setSkuClassifications(transformedClassifications);
      
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
      
      const mappedData: ReplenishmentData[] = data ? data.map(item => {
        let replenishmentDetails = {};
        try {
          if (item.data && typeof item.data === 'object') {
            replenishmentDetails = item.data;
          }
        } catch (e) {
          console.error("Error parsing replenishment data JSON:", e);
        }
        
        return {
          id: item.id,
          sku: replenishmentDetails.sku || '',
          quantity: replenishmentDetails.quantity || 0,
          replenishmentType: replenishmentDetails.replenishment_type || '',
          source: replenishmentDetails.source_location || '',
          destination: replenishmentDetails.destination_location || '',
          status: replenishmentDetails.status || 'pending',
          expectedDate: replenishmentDetails.expected_date || new Date().toISOString(),
          internalTransferTime: replenishmentDetails.internal_transfer_time,
          totalCycleTime: replenishmentDetails.total_cycle_time,
          lastUpdated: item.created_at,
          locationFrom: replenishmentDetails.location_from,
          locationTo: replenishmentDetails.location_to,
          replenishmentLeadTime: replenishmentDetails.replenishment_lead_time
        };
      }) : [];
      
      setReplenishmentData(mappedData);
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
