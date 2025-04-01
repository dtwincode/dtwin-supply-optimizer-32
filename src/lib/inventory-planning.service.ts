
import { supabase } from "./supabaseClient";
import { InventoryItem } from "@/types/inventory/planningTypes";

export async function fetchInventoryPlanningView(filters?: {
  searchQuery?: string;
  locationId?: string;
  bufferProfileId?: string;
  decouplingPointsOnly?: boolean;
}): Promise<InventoryItem[]> {
  let query = supabase
    .from("inventory_planning_view")
    .select("*, location_master(warehouse, city, region, channel)");

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

  // Transform the data to match the InventoryItem interface
  const transformedData = data.map(item => {
    // Extract location data from the joined location_master
    const locationData = item.location_master || {};
    
    return {
      id: `${item.product_id}-${item.location_id}`,
      product_id: item.product_id,
      sku: item.product_id, // Use product_id as sku if not available
      name: item.product_id, // Use product_id as name if not available
      location: item.location_id,
      location_id: item.location_id,
      warehouse: locationData.warehouse,
      city: locationData.city,
      region: locationData.region,
      channel: locationData.channel,
      
      // Planning view specific fields
      lead_time_days: item.lead_time_days,
      leadTimeDays: item.lead_time_days,
      average_daily_usage: item.average_daily_usage,
      adu: item.average_daily_usage,
      demand_variability: item.demand_variability,
      variabilityFactor: item.demand_variability,
      min_stock_level: item.min_stock_level,
      safety_stock: item.safety_stock,
      max_stock_level: item.max_stock_level,
      buffer_profile_id: item.buffer_profile_id,
      decoupling_point: item.decoupling_point,
      
      // Set some default values for required fields
      onHand: 0, // This will be updated from inventory_data if available
      currentStock: 0,
      
      // Create classification based on the available data
      classification: {
        leadTimeCategory: item.lead_time_days > 30 ? "long" : item.lead_time_days > 15 ? "medium" : "short",
        variabilityLevel: item.demand_variability > 1 ? "high" : item.demand_variability > 0.5 ? "medium" : "low",
        criticality: item.decoupling_point ? "high" : "low",
        score: item.max_stock_level || 0
      }
    };
  });

  return transformedData;
}

export async function fetchLocations(): Promise<string[]> {
  const { data, error } = await supabase
    .from("location_master")
    .select("location_id, warehouse")
    .order("warehouse");

  if (error) {
    console.error("Error fetching locations:", error.message);
    return [];
  }

  // Extract unique location IDs and ensure they are strings
  const locations = [...new Set(data.map(item => String(item.location_id)))].filter(Boolean);
  return locations as string[];
}

export async function fetchLocationWithNames(): Promise<{id: string, name: string}[]> {
  const { data, error } = await supabase
    .from("location_master")
    .select("location_id, warehouse")
    .order("warehouse");

  if (error) {
    console.error("Error fetching locations:", error.message);
    return [];
  }

  return data.map(location => ({
    id: location.location_id,
    name: location.warehouse || location.location_id
  }));
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

// Function to fetch inventory data to supplement the planning view
export async function fetchInventoryData(productIds: string[] = [], locationIds: string[] = []): Promise<Record<string, any>> {
  let query = supabase
    .from("inventory_data")
    .select("*");
  
  if (productIds.length > 0) {
    query = query.in('product_id', productIds);
  }
  
  if (locationIds.length > 0) {
    query = query.in('location_id', locationIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching inventory data:", error.message);
    return {};
  }

  // Create a lookup object by product_id and location_id
  const inventoryLookup: Record<string, any> = {};
  
  data.forEach(item => {
    const key = `${item.product_id}-${item.location_id}`;
    inventoryLookup[key] = {
      quantity_on_hand: item.quantity_on_hand,
      onHand: item.quantity_on_hand,
      currentStock: item.quantity_on_hand,
      available_qty: item.available_qty,
      reserved_qty: item.reserved_qty,
      last_updated: item.last_updated
    };
  });

  return inventoryLookup;
}
