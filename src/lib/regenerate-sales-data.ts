import { supabase } from "@/integrations/supabase/client";

export const regenerateHistoricalSalesData = async (days: number = 90) => {
  try {
    console.log(`Triggering regeneration of ${days} days of historical sales data...`);
    
    const { data, error } = await supabase.functions.invoke('regenerate-historical-sales', {
      body: { days }
    });

    if (error) throw error;

    console.log('Historical sales data regenerated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error regenerating historical sales data:', error);
    throw error;
  }
};
