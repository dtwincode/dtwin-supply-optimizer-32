import { supabase } from "./supabaseClient";

export async function fetchInventoryPlanningView() {
  const { data, error } = await supabase
    .from("inventory_planning_view")
    .select("*");

  if (error) {
    console.error("Error fetching inventory planning view:", error.message);
    return [];
  }

  return data;
}
