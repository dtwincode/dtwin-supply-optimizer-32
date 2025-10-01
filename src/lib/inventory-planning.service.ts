/**
 * Inventory Planning Service
 * Handles fetching and processing inventory planning data from Supabase
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch inventory planning view data from Supabase
 * Combines DDMRP buffers with net flow position data
 */
export const fetchInventoryPlanningView = async () => {
  try {
    // Fetch DDMRP buffer data with all calculations
    const { data: bufferData, error: bufferError } = await supabase
      .from('inventory_ddmrp_buffers_view')
      .select('*');

    if (bufferError) throw bufferError;

    // Fetch net flow position data using type assertion since view isn't in generated types
    const { data: netFlowData, error: netFlowError } = await supabase
      .from('inventory_net_flow_view' as any)
      .select('*');

    if (netFlowError) {
      console.warn('Net flow data not available:', netFlowError);
    }

    // Combine buffer data with net flow data
    const combinedData = bufferData?.map((buffer: any) => {
      const netFlow: any = netFlowData?.find(
        (nf: any) => nf.product_id === buffer.product_id && nf.location_id === buffer.location_id
      );

      // Determine buffer status based on NFP vs thresholds
      const nfp = netFlow?.nfp ?? 0;
      let buffer_status = 'GREEN';
      if (nfp <= buffer.tor) {
        buffer_status = 'RED';
      } else if (nfp <= buffer.toy) {
        buffer_status = 'YELLOW';
      }

      // Generate a numeric hash for id
      const hashString = `${buffer.product_id}-${buffer.location_id}`;
      const numericId = Math.abs(hashString.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));

      return {
        id: numericId,
        product_id: buffer.product_id,
        sku: buffer.sku || buffer.product_id,
        product_name: buffer.product_name || buffer.product_id,
        category: buffer.category || 'Unknown',
        subcategory: buffer.subcategory || '',
        location_id: buffer.location_id,
        channel_id: 'B2C',
        current_stock_level: netFlow?.on_hand || 0,
        average_daily_usage: buffer.adu || 0,
        min_stock_level: buffer.tor || 0,
        max_stock_level: buffer.tog || 0,
        reorder_level: buffer.toy || 0,
        lead_time_days: buffer.dlt || 0,
        decoupling_point: true,
        buffer_status,
        red_zone: buffer.red_zone || 0,
        yellow_zone: buffer.yellow_zone || 0,
        green_zone: buffer.green_zone || 0,
        buffer_profile_id: buffer.buffer_profile_id,
        buffer_profile_name: buffer.buffer_profile_name,
        on_hand: netFlow?.on_hand || 0,
        on_order: netFlow?.on_order || 0,
        qualified_demand: netFlow?.qualified_demand || 0,
        nfp: netFlow?.nfp || 0,
        tor: buffer.tor || 0,
        toy: buffer.toy || 0,
        tog: buffer.tog || 0,
      };
    }) || [];

    return combinedData;
  } catch (error) {
    console.error('Error fetching inventory planning data:', error);
    return [];
  }
};

/**
 * Update buffer levels for a specific product
 */
export const updateBufferLevels = async (
  productId: number, 
  updates: {
    min_stock_level?: number;
    max_stock_level?: number;
  }
) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  console.log(`Updating buffer levels for product ${productId}:`, updates);
  return { success: true };
};

export const fetchBufferProfiles = fetchInventoryPlanningView;
export const updateBufferProfile = updateBufferLevels;

export const createBufferProfile = async (profile: any) => {
  console.log("Creating buffer profile:", profile);
  return { success: true };
};

export const deleteBufferProfile = async (id: string) => {
  console.log("Deleting buffer profile with ID:", id);
  return { success: true };
};
