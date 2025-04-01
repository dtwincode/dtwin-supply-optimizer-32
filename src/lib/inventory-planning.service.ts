
import { supabase } from "./supabaseClient";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";

export async function fetchInventoryPlanningView(filters?: {
  searchQuery?: string;
  locationId?: string;
  bufferProfileId?: string;
  decouplingPointsOnly?: boolean;
}): Promise<InventoryPlanningItem[]> {
  let query = supabase
    .from("inventory_planning_view")
    .select("*");

  // Apply filters if provided
  if (filters) {
    if (filters.searchQuery) {
      query = query.ilike('product_id', `%${filters.searchQuery}%`);
    }
    
    if (filters.locationId && filters.locationId !== 'all') {
      query = query.eq('location_id', filters.locationId);
    }
    
    if (filters.bufferProfileId && filters.bufferProfileId !== 'all') {
      query = query.eq('buffer_profile_id', filters.bufferProfileId);
    }
    
    if (filters.decouplingPointsOnly) {
      query = query.eq('decoupling_point', true);
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching inventory planning view:", error.message);
    return [];
  }

  return data as InventoryPlanningItem[];
}

export async function fetchLocations(): Promise<string[]> {
  const { data, error } = await supabase
    .from("location_master")
    .select("location_id")
    .order("location_id");

  if (error) {
    console.error("Error fetching locations:", error.message);
    return [];
  }

  // Extract unique location IDs and ensure they are strings
  const locations = [...new Set(data.map(item => String(item.location_id)))].filter(Boolean);
  return locations as string[];
}

export async function fetchBufferProfiles(): Promise<string[]> {
  const { data, error } = await supabase
    .from("buffer_profiles")
    .select("id")
    .order("id");

  if (error) {
    console.error("Error fetching buffer profiles:", error.message);
    return [];
  }

  // Extract unique buffer profile IDs and ensure they are strings
  const profiles = [...new Set(data.map(item => String(item.id)))].filter(Boolean);
  return profiles as string[];
}
