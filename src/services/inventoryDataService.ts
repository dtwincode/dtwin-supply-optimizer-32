import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';
import { supabase } from '@/integrations/supabase/client';

// Cache for inventory data
let inventoryCache: any[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for breach alerts
let breachAlertsCache: any[] | null = null;
let breachCacheTimestamp: number = 0;

/**
 * Centralized inventory data fetching with caching
 */
export const getInventoryData = async (forceRefresh = false): Promise<any[]> => {
  const now = Date.now();
  
  if (!forceRefresh && inventoryCache && (now - cacheTimestamp < CACHE_DURATION)) {
    return inventoryCache;
  }
  
  const data = await fetchInventoryPlanningView();
  inventoryCache = data;
  cacheTimestamp = now;
  
  return data;
};

/**
 * Get breach alerts with caching
 */
export const getBreachAlerts = async (forceRefresh = false): Promise<any[]> => {
  const now = Date.now();
  
  if (!forceRefresh && breachAlertsCache && (now - breachCacheTimestamp < CACHE_DURATION)) {
    return breachAlertsCache;
  }
  
  const { data, error } = await supabase
    .from('buffer_breach_alerts')
    .select('*')
    .eq('acknowledged', false)
    .order('detected_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching breach alerts:', error);
    return [];
  }
  
  breachAlertsCache = data || [];
  breachCacheTimestamp = now;
  
  return breachAlertsCache;
};

/**
 * Invalidate cache (call after data updates)
 */
export const invalidateInventoryCache = () => {
  inventoryCache = null;
  cacheTimestamp = 0;
  breachAlertsCache = null;
  breachCacheTimestamp = 0;
};
