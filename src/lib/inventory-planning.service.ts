
import { supabase } from "./supabaseClient";
import { InventoryItem } from "@/types/inventory";

export async function fetchInventoryPlanningView(filters?: {
  searchQuery?: string;
  locationId?: string;
  bufferProfileId?: string;
  decouplingPointsOnly?: boolean;
  priorityOnly?: boolean;
  limit?: number;
  offset?: number;
}): Promise<InventoryItem[]> {
  try {
    console.log("Fetching inventory planning view with filters:", filters);
    
    // Step 1: Get total count for pagination
    let countQuery = supabase
      .from("inventory_planning_view")
      .select("product_id", { count: 'exact', head: true });
    
    // Apply basic filters to count query
    if (filters) {
      if (filters.searchQuery) {
        countQuery = countQuery.ilike('product_id', `%${filters.searchQuery}%`);
      }
      
      if (filters.locationId && filters.locationId !== 'all') {
        countQuery = countQuery.eq('location_id', filters.locationId);
      }
      
      if (filters.bufferProfileId && filters.bufferProfileId !== 'all') {
        countQuery = countQuery.eq('buffer_profile_id', filters.bufferProfileId);
      }
      
      if (filters.decouplingPointsOnly) {
        countQuery = countQuery.eq('decoupling_point', true);
      }
    }
    
    const { count } = await countQuery;
    console.log("Total count of records:", count);
    
    // Step 2: Build the main query with optimizations
    let query = supabase
      .from("inventory_planning_view")
      .select(`
        product_id,
        location_id,
        lead_time_days,
        average_daily_usage,
        demand_variability,
        min_stock_level,
        safety_stock,
        max_stock_level,
        buffer_profile_id,
        decoupling_point
      `);

    // Apply filters
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
      
      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset !== undefined) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching inventory planning view:", error.message);
      return [];
    }

    console.log(`Fetched ${data?.length || 0} planning view records`);
    if (data && data.length > 0) {
      console.log("Sample planning view record:", data[0]);
    }

    // Get product and location data in batch operations
    const productIds = [...new Set(data?.map(item => item.product_id) || [])];
    const locationIds = [...new Set(data?.map(item => item.location_id) || [])];
    
    console.log(`Fetching data for ${productIds.length} products and ${locationIds.length} locations`);
    
    // Fetch product data in one batch
    const { data: productData } = await supabase
      .from("product_master")
      .select("*")
      .in('product_id', productIds);
    
    // Create product lookup map
    const productMap = (productData || []).reduce((map: Record<string, any>, product) => {
      map[product.product_id] = product;
      return map;
    }, {});
    
    // Fetch location data in one batch
    const { data: locationData } = await supabase
      .from("location_master")
      .select("*")
      .in('location_id', locationIds);
    
    // Create location lookup map
    const locationMap = (locationData || []).reduce((map: Record<string, any>, location) => {
      map[location.location_id] = location;
      return map;
    }, {});
    
    // Fetch inventory data in one batch
    const { data: inventoryData } = await supabase
      .from("inventory_data")
      .select("*")
      .in('product_id', productIds)
      .in('location_id', locationIds);
    
    // Create inventory lookup map
    const inventoryMap: Record<string, any> = {};
    (inventoryData || []).forEach(item => {
      const key = `${item.product_id}-${item.location_id}`;
      inventoryMap[key] = item;
    });

    console.log(`Created lookup maps for ${Object.keys(productMap).length} products, ${Object.keys(locationMap).length} locations, and ${Object.keys(inventoryMap).length} inventory items`);

    // Transform data
    const transformedData = [];
    
    for (const item of data || []) {
      const key = `${item.product_id}-${item.location_id}`;
      const inventoryItem = inventoryMap[key] || {};
      const product = productMap[item.product_id] || {};
      const location = locationMap[item.location_id] || {};
      
      // Calculate buffer penetration for priority filtering
      const currentStock = inventoryItem.quantity_on_hand || 0;
      const maxLevel = item.max_stock_level || 1;
      const bufferPenetration = maxLevel > 0 ? ((maxLevel - currentStock) / maxLevel) * 100 : 0;
      const isPriority = bufferPenetration > 50; // Items above 50% buffer penetration are priority
      
      // Skip non-priority items if priorityOnly filter is active
      if (filters?.priorityOnly && !isPriority) {
        continue;
      }
      
      const transformedItem = {
        id: key,
        product_id: item.product_id,
        sku: item.product_id,
        name: product.name || item.product_id,
        location: item.location_id,
        location_id: item.location_id,
        warehouse: location.warehouse || '',
        city: location.city || '',
        region: location.region || '',
        channel: location.channel || '',
        
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
        quantity_on_hand: inventoryItem.quantity_on_hand || 0,
        onHand: inventoryItem.quantity_on_hand || 0,
        currentStock: inventoryItem.quantity_on_hand || 0,
        available_qty: inventoryItem.available_qty || 0,
        reserved_qty: inventoryItem.reserved_qty || 0,
        
        // Buffer zones calculation
        redZoneSize: item.safety_stock || 0,
        yellowZoneSize: (item.min_stock_level || 0) - (item.safety_stock || 0),
        greenZoneSize: (item.max_stock_level || 0) - (item.min_stock_level || 0),
        
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
        productFamily: product.product_family || ''
      };
      
      transformedData.push(transformedItem);
    }

    // Attach count for pagination
    const finalData = transformedData as any;
    finalData.totalCount = count || transformedData.length;
    
    console.log(`Processed ${transformedData.length} items out of ${data?.length || 0} raw items`);
    return finalData as InventoryItem[];
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
