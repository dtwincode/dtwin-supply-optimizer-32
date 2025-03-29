
import { supabase } from "@/lib/supabaseClient";
import { DBInventoryItem, InventoryItemUI } from "@/types/inventory";

// Helper function to transform database items to UI format if needed
const transformToUIItem = (item: any): InventoryItemUI => {
  return {
    id: item.inventory_id || item.id || '',
    sku: item.sku || '',
    name: item.name || '',
    current_stock: item.quantity_on_hand || 0,
    category: item.category || '',
    subcategory: item.subcategory || '',
    location: item.location_id || item.location || '',
    product_family: item.product_family || '',
    region: item.region || '',
    city: item.city || '',
    channel: item.channel || '',
    warehouse: item.warehouse || '',
    decoupling_point_id: item.decoupling_point_id || '',
    adu: item.adu || 0,
    lead_time_days: item.lead_time_days || 0,
    variability_factor: item.variability_factor || 0,
    red_zone_size: item.red_zone_size || 0,
    yellow_zone_size: item.yellow_zone_size || 0,
    green_zone_size: item.green_zone_size || 0,
    on_hand: item.quantity_on_hand || 0,
    on_order: item.on_order || 0,
    qualified_demand: item.qualified_demand || 0,
    net_flow_position: (item.quantity_on_hand || 0) + (item.on_order || 0) - (item.qualified_demand || 0),
    planning_priority: item.planning_priority || '',
    created_at: item.created_at || '',
    updated_at: item.updated_at || '',
    max_stock: item.max_stock || 0,
    min_stock: item.min_stock || 0
  };
};

// Get all inventory items
export const getAllInventoryItems = async () => {
  try {
    const { data, error } = await supabase
      .from("inventory_data")
      .select("*");

    if (error) throw error;

    // Map to UI format if needed
    return { data: data.map(transformToUIItem), error: null };
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return { data: null, error };
  }
};

// Get inventory items with filtering
export const getInventoryItems = async (filters: any = {}) => {
  try {
    let query = supabase.from("inventory_data").select("*");

    // Apply filters if provided
    if (filters.searchQuery) {
      query = query.or(`product_id.ilike.%${filters.searchQuery}%`);
    }

    if (filters.location) {
      query = query.eq("location_id", filters.location);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Map to UI format if needed
    return { data: data.map(transformToUIItem), error: null };
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return { data: null, error };
  }
};

// Get a single inventory item by ID
export const getInventoryItemById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("inventory_data")
      .select("*")
      .eq("inventory_id", id)
      .single();

    if (error) throw error;

    // Map to UI format if needed
    return { data: transformToUIItem(data), error: null };
  } catch (error) {
    console.error(`Error fetching inventory item with ID ${id}:`, error);
    return { data: null, error };
  }
};

// Create a new inventory item
export const createInventoryItem = async (item: Partial<DBInventoryItem>) => {
  try {
    // Make sure we're not including available_qty which has a default value constraint
    const { available_qty, ...itemData } = item;
    
    const { data, error } = await supabase
      .from("inventory_data")
      .insert([itemData])
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error creating inventory item:", error);
    return { data: null, error };
  }
};

// Update an existing inventory item
export const updateInventoryItem = async (id: string, updates: Partial<DBInventoryItem>) => {
  try {
    // Make sure we're not including available_qty which has a default value constraint
    const { available_qty, ...updateData } = updates;
    
    const { data, error } = await supabase
      .from("inventory_data")
      .update(updateData)
      .eq("inventory_id", id)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error(`Error updating inventory item with ID ${id}:`, error);
    return { data: null, error };
  }
};

// Delete an inventory item
export const deleteInventoryItem = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("inventory_data")
      .delete()
      .eq("inventory_id", id);

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error(`Error deleting inventory item with ID ${id}:`, error);
    return { data: null, error };
  }
};

// Helper function to check if the inventory_data table exists
export const checkInventoryTableExists = async () => {
  try {
    const { data, error } = await supabase.from("inventory_data").select("inventory_id").limit(1);
    
    if (error && error.code === "42P01") {
      // Table doesn't exist - error code 42P01 is "undefined_table"
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking inventory table:", error);
    return false;
  }
};
