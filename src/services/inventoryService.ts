
import { supabase } from '@/lib/supabaseClient';
import { BufferProfile, BufferFactorConfig } from '@/types/inventory';

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
      shortLeadTimeFactor: Number(item.lead_time_factor) || 0.7,
      mediumLeadTimeFactor: Number(item.lead_time_factor) || 1.0,
      longLeadTimeFactor: Number(item.lead_time_factor) || 1.3,
      shortLeadTimeThreshold: 7,
      mediumLeadTimeThreshold: 14,
      replenishmentTimeFactor: 1.0,
      greenZoneFactor: 0.7,
      description: item.description || '',
      isActive: true,
      industry: item.variability_category || '',
      isBenchmarkBased: false,
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
      variabilityFactor: item.variability_category as any,
      leadTimeFactor: item.lead_time_category as any,
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
      variabilityFactor: data.variability_category as any,
      leadTimeFactor: data.lead_time_category as any,
      moq: 0,
      lotSizeFactor: data.lot_size_factor || 1
    };

    return { success: true, data: createdProfile };
  } catch (error) {
    console.error('Error creating buffer profile:', error);
    return { success: false, error };
  }
};

// Function to get the active buffer configuration
export const getActiveBufferConfig = async (): Promise<BufferFactorConfig | null> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profiles')
      .select('*')
      .eq('name', 'Default')
      .single();

    if (error) throw error;

    return {
      id: data.id,
      shortLeadTimeFactor: 0.7,
      mediumLeadTimeFactor: 1.0,
      longLeadTimeFactor: 1.3,
      shortLeadTimeThreshold: 7,
      mediumLeadTimeThreshold: 14,
      replenishmentTimeFactor: data.lead_time_factor || 1.0,
      greenZoneFactor: 0.7,
      description: data.description || '',
      isActive: true,
      metadata: {}
    };
  } catch (error) {
    console.error('Error getting active buffer config:', error);
    return null;
  }
};
