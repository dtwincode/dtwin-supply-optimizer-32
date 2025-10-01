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
    // Fetch DDMRP buffer data
    const { data: bufferData, error: bufferError } = await supabase
      .from('inventory_ddmrp_buffers_view')
      .select('*');

    if (bufferError) throw bufferError;

    // Fetch net flow data
    const { data: netFlowData, error: netFlowError } = await supabase
      .from('inventory_net_flow_view')
      .select('*');

    if (netFlowError) throw netFlowError;

    // Fetch product master data for names
    const { data: productData, error: productError } = await supabase
      .from('product_master')
      .select('product_id, name, sku, category, subcategory');

    if (productError) throw productError;

    // Combine the data
    const combinedData = bufferData?.map((buffer: any) => {
      const netFlow = netFlowData?.find(
        (nf: any) => nf.product_id === buffer.product_id && nf.location_id === buffer.location_id
      );
      const product = productData?.find((p: any) => p.product_id === buffer.product_id);

      // Determine buffer status based on NFP
      let buffer_status = 'GREEN';
      if (netFlow?.nfp <= buffer.tor) {
        buffer_status = 'RED';
      } else if (netFlow?.nfp <= buffer.toy) {
        buffer_status = 'YELLOW';
      }

      // Generate a numeric hash for id (simple hash function)
      const hashString = `${buffer.product_id}-${buffer.location_id}`;
      const numericId = Math.abs(hashString.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));

      return {
        id: numericId,
        product_id: buffer.product_id,
        sku: product?.sku || buffer.product_id,
        product_name: product?.name || buffer.product_id,
        category: product?.category || 'Unknown',
        subcategory: product?.subcategory || '',
        location_id: buffer.location_id,
        channel_id: 'B2C',
        current_stock_level: netFlow?.on_hand || 0,
        average_daily_usage: buffer.adu_adj || 0,
        min_stock_level: buffer.tor || 0,
        max_stock_level: buffer.tog || 0,
        reorder_level: buffer.toy || 0,
        lead_time_days: buffer.dlt || 0,
        decoupling_point: true,
        buffer_status,
        red_zone: buffer.red_zone || 0,
        yellow_zone: buffer.yellow_zone || 0,
        green_zone: buffer.green_zone || 0,
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
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real application, this would send the updates to an API
  console.log(`Updating buffer levels for product ${productId}:`, updates);
  
  return { success: true };
};
export const fetchBufferProfiles = fetchInventoryPlanningView;

export const updateBufferProfile = updateBufferLevels;

export const createBufferProfile = async (profile) => {
  console.log("Creating buffer profile:", profile);
  return { success: true };
};

export const deleteBufferProfile = async (id) => {
  console.log("Deleting buffer profile with ID:", id);
  return { success: true };
};
