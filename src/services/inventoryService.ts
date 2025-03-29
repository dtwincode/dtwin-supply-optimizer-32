
import { supabase } from "@/integrations/supabase/client";
import { 
  InventoryItem,
  BufferProfile,
  DecouplingPoint
} from "@/types/inventory";
import { Database } from "@/integrations/supabase/types";

// Buffer Profile functions
export const getBufferProfiles = async (): Promise<BufferProfile[]> => {
  const { data, error } = await supabase
    .from('buffer_profiles')
    .select('*');

  if (error) {
    console.error('Error fetching buffer profiles:', error);
    throw error;
  }

  // Map the database format to our frontend model
  return (data || []).map(profile => ({
    id: profile.id,
    name: profile.name,
    description: profile.description || undefined,
    variabilityFactor: profile.variability_factor,
    leadTimeFactor: profile.lead_time_factor,
    moq: profile.moq || undefined,
    lotSizeFactor: profile.lot_size_factor || undefined
  }));
};

export const createBufferProfile = async (profile: Omit<BufferProfile, 'id'>): Promise<BufferProfile> => {
  // Convert from our frontend model to the database format
  const dbProfile = {
    name: profile.name,
    description: profile.description,
    variability_factor: profile.variabilityFactor,
    lead_time_factor: profile.leadTimeFactor,
    moq: profile.moq,
    lot_size_factor: profile.lotSizeFactor
  };

  const { data, error } = await supabase
    .from('buffer_profiles')
    .insert(dbProfile)
    .select()
    .single();

  if (error) {
    console.error('Error creating buffer profile:', error);
    throw error;
  }

  // Map back to our frontend model
  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    variabilityFactor: data.variability_factor,
    leadTimeFactor: data.lead_time_factor,
    moq: data.moq || undefined,
    lotSizeFactor: data.lot_size_factor || undefined
  };
};

export const updateBufferProfile = async (profile: BufferProfile): Promise<BufferProfile> => {
  // Convert from our frontend model to the database format
  const dbProfile = {
    name: profile.name,
    description: profile.description,
    variability_factor: profile.variabilityFactor,
    lead_time_factor: profile.leadTimeFactor,
    moq: profile.moq,
    lot_size_factor: profile.lotSizeFactor
  };

  const { data, error } = await supabase
    .from('buffer_profiles')
    .update(dbProfile)
    .eq('id', profile.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating buffer profile:', error);
    throw error;
  }

  // Map back to our frontend model
  return {
    id: data.id,
    name: data.name,
    description: data.description || undefined,
    variabilityFactor: data.variability_factor,
    leadTimeFactor: data.lead_time_factor,
    moq: data.moq || undefined,
    lotSizeFactor: data.lot_size_factor || undefined
  };
};

// Decoupling Point functions
export const getDecouplingPoints = async (): Promise<DecouplingPoint[]> => {
  const { data, error } = await supabase
    .from('decoupling_points')
    .select('*');

  if (error) {
    console.error('Error fetching decoupling points:', error);
    throw error;
  }

  // Map the database format to our frontend model
  return (data || []).map(point => ({
    id: point.id,
    locationId: point.location_id,
    type: point.type,
    description: point.description || undefined,
    bufferProfileId: point.buffer_profile_id
  }));
};

export const createDecouplingPoint = async (point: Omit<DecouplingPoint, 'id'>): Promise<DecouplingPoint> => {
  // Convert from our frontend model to the database format
  const dbPoint = {
    location_id: point.locationId,
    type: point.type,
    description: point.description,
    buffer_profile_id: point.bufferProfileId
  };

  const { data, error } = await supabase
    .from('decoupling_points')
    .insert(dbPoint)
    .select()
    .single();

  if (error) {
    console.error('Error creating decoupling point:', error);
    throw error;
  }

  // Map back to our frontend model
  return {
    id: data.id,
    locationId: data.location_id,
    type: data.type,
    description: data.description || undefined,
    bufferProfileId: data.buffer_profile_id
  };
};

export const updateDecouplingPoint = async (point: DecouplingPoint): Promise<DecouplingPoint> => {
  // Convert from our frontend model to the database format
  const dbPoint = {
    location_id: point.locationId,
    type: point.type,
    description: point.description,
    buffer_profile_id: point.bufferProfileId
  };

  const { data, error } = await supabase
    .from('decoupling_points')
    .update(dbPoint)
    .eq('id', point.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating decoupling point:', error);
    throw error;
  }

  // Map back to our frontend model
  return {
    id: data.id,
    locationId: data.location_id,
    type: data.type,
    description: data.description || undefined,
    bufferProfileId: data.buffer_profile_id
  };
};

export const deleteDecouplingPoint = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('decoupling_points')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting decoupling point:', error);
    throw error;
  }
};

// Get all inventory items
export const getAllInventoryItems = async () => {
  try {
    const { data, error } = await supabase
      .from("inventory_data")
      .select("*");

    if (error) throw error;

    // Return data directly without transformation
    return { data, error: null };
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

    // Return data directly without transformation
    return { data, error: null };
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

    // Return data directly
    return { data, error: null };
  } catch (error) {
    console.error(`Error fetching inventory item with ID ${id}:`, error);
    return { data: null, error };
  }
};

// Create a new inventory item
export const createInventoryItem = async (item: Partial<InventoryItem>) => {
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
export const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
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
