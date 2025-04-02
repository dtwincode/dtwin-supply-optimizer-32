
import { supabase } from "./supabaseClient";

export async function uploadInventoryData(dataToUpload: any[], defaultLocationId: string) {
  try {
    // Format the data for the database
    const formattedData = dataToUpload.map(item => ({
      product_id: item.product_id,
      quantity_on_hand: item.quantity_on_hand,
      location_id: defaultLocationId, // Add required location_id 
    }));

    const { error } = await supabase
      .from('inventory_data')
      .insert(formattedData);

    if (error) {
      console.error("Error uploading inventory data:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("Exception in uploadInventoryData:", err);
    return { success: false, error: err };
  }
}
