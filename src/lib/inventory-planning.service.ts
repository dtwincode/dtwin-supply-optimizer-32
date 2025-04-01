
import { supabase } from "./supabaseClient";
import { InventoryItem } from "@/types/inventory";

export async function fetchInventoryPlanningView(filters?: {
  searchQuery?: string;
  locationId?: string;
  bufferProfileId?: string;
  decouplingPointsOnly?: boolean;
  priorityOnly?: boolean;
}): Promise<InventoryItem[]> {
  try {
    console.log("Fetching inventory planning view with filters:", filters);
    
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

    console.log("Inventory planning view data:", data);

    // Transform the data to match the InventoryItem interface
    const transformedData: InventoryItem[] = [];
    
    for (const item of data || []) {
      // Get location data from separate query
      const { data: locationData } = await supabase
        .from("location_master")
        .select("*")
        .eq('location_id', item.location_id)
        .maybeSingle();
      
      // Get product data if available
      const { data: productData } = await supabase
        .from("product_master")
        .select("*")
        .eq('product_id', item.product_id)
        .maybeSingle();
      
      // Get inventory data for current stock
      const { data: inventoryData } = await supabase
        .from("inventory_data")
        .select("*")
        .eq('product_id', item.product_id)
        .eq('location_id', item.location_id)
        .maybeSingle();

      // Calculate buffer penetration for priority filtering
      const currentStock = inventoryData?.quantity_on_hand || 0;
      const maxLevel = item.max_stock_level || 1;
      const bufferPenetration = (currentStock / maxLevel) * 100;
      const isPriority = bufferPenetration < 50; // Items below 50% buffer level are considered priority

      // Skip non-priority items if priorityOnly filter is active
      if (filters?.priorityOnly && !isPriority) {
        continue;
      }
      
      // Create the transformed item with all required fields
      const inventoryItem: InventoryItem = {
        id: `${item.product_id}-${item.location_id}`,
        product_id: item.product_id,
        sku: item.product_id, // Use product_id as SKU if needed
        name: productData?.name || item.product_id, // Use product name if available
        location: item.location_id,
        location_id: item.location_id,
        warehouse: locationData?.warehouse || '',
        city: locationData?.city || '',
        region: locationData?.region || '',
        channel: locationData?.channel || '',
        
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
        
        // Inventory data
        quantity_on_hand: inventoryData?.quantity_on_hand || 0,
        onHand: inventoryData?.quantity_on_hand || 0,
        currentStock: inventoryData?.quantity_on_hand || 0,
        available_qty: inventoryData?.available_qty || 0,
        reserved_qty: inventoryData?.reserved_qty || 0,
        
        // Priority data
        bufferPenetration: bufferPenetration,
        planningPriority: isPriority ? 'high' : 'normal',
        
        // Classification 
        classification: {
          leadTimeCategory: item.lead_time_days > 30 ? "long" : item.lead_time_days > 15 ? "medium" : "short",
          variabilityLevel: item.demand_variability > 1 ? "high" : item.demand_variability > 0.5 ? "medium" : "low",
          criticality: item.decoupling_point ? "high" : "low",
          score: item.max_stock_level || 0
        },
        
        // Product details
        productFamily: productData?.product_family || ''
      };
      
      transformedData.push(inventoryItem);
    }

    console.log("Transformed inventory data:", transformedData);
    return transformedData;
  } catch (error) {
    console.error("Exception in fetchInventoryPlanningView:", error);
    return [];
  }
}

export async function fetchLocations(): Promise<string[]> {
  try {
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
  } catch (error) {
    console.error("Exception in fetchLocations:", error);
    return [];
  }
}

export async function fetchLocationWithNames(): Promise<{id: string, name: string}[]> {
  try {
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
  } catch (error) {
    console.error("Exception in fetchLocationWithNames:", error);
    return [];
  }
}

export async function fetchBufferProfiles(): Promise<string[]> {
  try {
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
  } catch (error) {
    console.error("Exception in fetchBufferProfiles:", error);
    return [];
  }
}

// Function to fetch inventory data to supplement the planning view
export async function fetchInventoryData(productIds: string[] = [], locationIds: string[] = []): Promise<Record<string, any>> {
  try {
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
    
    for (const item of data || []) {
      const key = `${item.product_id}-${item.location_id}`;
      inventoryLookup[key] = {
        quantity_on_hand: item.quantity_on_hand,
        onHand: item.quantity_on_hand,
        currentStock: item.quantity_on_hand,
        available_qty: item.available_qty,
        reserved_qty: item.reserved_qty,
        last_updated: item.last_updated,
        decoupling_point: item.decoupling_point
      };
    }

    return inventoryLookup;
  } catch (error) {
    console.error("Exception in fetchInventoryData:", error);
    return {};
  }
}
