import { createClient } from "@supabase/supabase-js";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchInventoryPlanningView(): Promise<InventoryPlanningItem[]> {
  const { data, error } = await supabase
    .from("inventory_planning_view")
    .select("*");

  if (error) {
    console.error("Error fetching inventory planning view:", error.message);
    return [];
  }

  return data as InventoryPlanningItem[];
}
