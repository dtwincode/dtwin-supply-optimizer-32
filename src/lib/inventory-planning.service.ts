
import { createClient } from "@supabase/supabase-js";
import { InventoryPlanningItem } from "@/types/inventory/planningTypes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    .from("inventory_planning_view")
    .select("location_id")
    .order("location_id");

  if (error) {
    console.error("Error fetching locations:", error.message);
    return [];
  }

  // Extract unique location IDs and ensure they are strings
  const locations = [...new Set(data.map(item => String(item.location_id)))];
  return locations.filter(Boolean); // Filter out null/undefined/empty strings
}

export async function fetchBufferProfiles(): Promise<string[]> {
  const { data, error } = await supabase
    .from("inventory_planning_view")
    .select("buffer_profile_id")
    .order("buffer_profile_id");

  if (error) {
    console.error("Error fetching buffer profiles:", error.message);
    return [];
  }

  // Extract unique buffer profile IDs and ensure they are strings
  const profiles = [...new Set(data.map(item => String(item.buffer_profile_id)))];
  return profiles.filter(Boolean); // Filter out null/undefined/empty strings
}
