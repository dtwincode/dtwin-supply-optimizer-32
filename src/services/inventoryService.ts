
import { supabase } from '@/lib/supabaseClient';
import { BufferProfile } from '@/types/inventory';
import { BufferFactorConfig } from '@/types/supabase';

// Function to fetch buffer factor configurations
export const fetchBufferFactorConfigs = async (): Promise<BufferFactorConfig[]> => {
  try {
    // Note: This table might need to be created in your Supabase instance
    const { data, error } = await supabase
      .from('buffer_profiles') // Use existing table instead of buffer_factor_configs
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map database columns to camelCase interface
    return data.map(item => ({
      id: item.id || '',
      short_lead_time_factor: Number(item.lead_time_factor) || 0.7,
      medium_lead_time_factor: Number(item.lead_time_factor) || 1.0,
      long_lead_time_factor: Number(item.lead_time_factor) || 1.3,
      short_lead_time_threshold: 7,
      medium_lead_time_threshold: 14,
      replenishment_time_factor: 1.0,
      green_zone_factor: 0.7,
      description: item.description || '',
      is_active: true,
      industry: item.variability_category || '',
      is_benchmark_based: false,
      metadata: {}
    }));
  } catch (error) {
    console.error('Error fetching buffer factor configs:', error);
    return [];
  }
};

// Function to fetch buffer profiles
export const getBufferProfiles = async (): Promise<BufferProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profiles')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    const profiles = data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      variabilityFactor: item.variability_category as "high_variability" | "medium_variability" | "low_variability" || "medium_variability",
      leadTimeFactor: item.lead_time_category as "short" | "medium" | "long" || "medium",
      moq: 0, // Default value as moq doesn't exist in the DB schema
      lotSizeFactor: item.lot_size_factor || 1
    }));

    return profiles as BufferProfile[];
  } catch (error) {
    console.error('Error fetching buffer profiles:', error);
    return [];
  }
};

// Function to create a buffer profile
export const createBufferProfile = async (profile: Omit<BufferProfile, 'id'>): Promise<{ success: boolean; error?: any; data?: BufferProfile }> => {
  try {
    // Convert the frontend model to database model
    const dbProfile = {
      name: profile.name,
      description: profile.description,
      variability_category: profile.variabilityFactor,
      lead_time_category: profile.leadTimeFactor,
      variability_factor: parseFloat(String(0.5)), // Default value
      lead_time_factor: parseFloat(String(1.0)), // Default value
      lot_size_factor: profile.lotSizeFactor || 1
      // moq isn't in the schema
    };

    const { data, error } = await supabase
      .from('buffer_profiles')
      .insert([dbProfile])
      .select('*')
      .single();

    if (error) throw error;

    // Convert the database model back to frontend model
    const createdProfile: BufferProfile = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      variabilityFactor: data.variability_category as "high_variability" | "medium_variability" | "low_variability",
      leadTimeFactor: data.lead_time_category as "short" | "medium" | "long",
      moq: 0, // Default as it doesn't exist in schema
      lotSizeFactor: data.lot_size_factor || 1
    };

    return { success: true, data: createdProfile };
  } catch (error) {
    console.error('Error creating buffer profile:', error);
    return { success: false, error };
  }
};

// Function to update a buffer profile
export const updateBufferProfile = async (profile: BufferProfile): Promise<{ success: boolean; error?: any; data?: BufferProfile }> => {
  try {
    // Convert the frontend model to database model
    const dbProfile = {
      name: profile.name,
      description: profile.description,
      variability_category: profile.variabilityFactor,
      lead_time_category: profile.leadTimeFactor,
      variability_factor: 0.5, // Default value
      lead_time_factor: 1.0, // Default value
      lot_size_factor: profile.lotSizeFactor || 1
      // moq isn't in the schema
    };

    const { data, error } = await supabase
      .from('buffer_profiles')
      .update(dbProfile)
      .eq('id', profile.id)
      .select('*')
      .single();

    if (error) throw error;

    // Convert the database model back to frontend model
    const updatedProfile: BufferProfile = {
      id: data.id,
      name: data.name,
      description: data.description || '',
      variabilityFactor: data.variability_category as "high_variability" | "medium_variability" | "low_variability",
      leadTimeFactor: data.lead_time_category as "short" | "medium" | "long",
      moq: 0, // Default as it doesn't exist in schema
      lotSizeFactor: data.lot_size_factor || 1
    };

    return { success: true, data: updatedProfile };
  } catch (error) {
    console.error('Error updating buffer profile:', error);
    return { success: false, error };
  }
};
