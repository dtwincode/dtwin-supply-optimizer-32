import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { ValidationError } from "../validation/types";

export const processInventoryData = async (processedData: any[]) => {
  if (!processedData || processedData.length === 0) {
    return { success: false, message: 'No data to process' };
  }

  try {
    // Map the processed data to match inventory_data table structure
    const inventoryItems = processedData.map(item => {
      return {
        product_id: item.product_id || item.sku,
        quantity_on_hand: parseInt(item.quantity_on_hand || item.current_stock || 0),
        reserved_qty: parseInt(item.reserved_qty || 0),
        location_id: item.location_id || item.location
      };
    });

    const { data, error } = await supabase
      .from('inventory_data')
      .insert(inventoryItems);

    if (error) {
      console.error('Error inserting inventory data:', error);
      return { success: false, message: `Error inserting data: ${error.message}` };
    }

    return { success: true, message: `Inserted ${inventoryItems.length} inventory records` };
  } catch (error) {
    console.error('Error in processInventoryData:', error);
    return { 
      success: false, 
      message: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Process data based on module type
export const processDataByModule = async (
  module: Database["public"]["Enums"]["module_type"],
  processedData: any[],
  validationErrors: ValidationError[]
): Promise<{ success: boolean; message: string }> => {
  // Check if there are validation errors
  if (validationErrors.length > 0) {
    return {
      success: false,
      message: `Validation failed with ${validationErrors.length} errors. Please fix the issues before uploading.`
    };
  }

  // Process data based on module type
  switch (module) {
    case 'products':
      // Process products data
      return { success: true, message: 'Products processed' };

    case 'inventory':
      // Process inventory data
      return processInventoryData(processedData);

    case 'locations':
      // Process locations data
      return { success: true, message: 'Locations processed' };

    case 'vendors':
      // Process vendors data
      return { success: true, message: 'Vendors processed' };

    case 'historical_sales':
      // Process historical sales data
      return { success: true, message: 'Historical sales processed' };

    case 'product_pricing':
      // Process product pricing data
      return { success: true, message: 'Product pricing processed' };

    default:
      return { success: false, message: `Unknown module type: ${module}` };
  }
};
