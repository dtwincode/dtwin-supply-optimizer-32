
import { BufferFactorConfig, BufferProfile } from "@/types/inventory";
import { supabase } from "@/lib/supabaseClient";

// Get active buffer configuration
export const getActiveBufferConfig = async (): Promise<BufferFactorConfig> => {
  try {
    const { data, error } = await supabase
      .from('buffer_factor_configs')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error fetching buffer config:', error);
      // Return a default configuration as fallback
      return {
        id: 'default',
        shortLeadTimeFactor: 0.7,
        mediumLeadTimeFactor: 1.0,
        longLeadTimeFactor: 1.3,
        shortLeadTimeThreshold: 7,
        mediumLeadTimeThreshold: 14,
        replenishmentTimeFactor: 1.0,
        greenZoneFactor: 0.7,
        isActive: true,
        metadata: {}
      };
    }

    // Map database columns to camelCase interface
    return {
      id: data.id,
      shortLeadTimeFactor: data.short_lead_time_factor || 0.7,
      mediumLeadTimeFactor: data.medium_lead_time_factor || 1.0,
      longLeadTimeFactor: data.long_lead_time_factor || 1.3,
      shortLeadTimeThreshold: data.short_lead_time_threshold || 7,
      mediumLeadTimeThreshold: data.medium_lead_time_threshold || 14,
      replenishmentTimeFactor: data.replenishment_time_factor || 1.0,
      greenZoneFactor: data.green_zone_factor || 0.7,
      description: data.description,
      isActive: data.is_active,
      industry: data.industry,
      isBenchmarkBased: data.is_benchmark_based,
      metadata: data.metadata || {}
    };
  } catch (error) {
    console.error('Error in getActiveBufferConfig:', error);
    // Return default configuration
    return {
      id: 'default',
      shortLeadTimeFactor: 0.7,
      mediumLeadTimeFactor: 1.0,
      longLeadTimeFactor: 1.3,
      shortLeadTimeThreshold: 7,
      mediumLeadTimeThreshold: 14,
      replenishmentTimeFactor: 1.0,
      greenZoneFactor: 0.7,
      isActive: true,
      metadata: {}
    };
  }
};

// Get buffer profiles
export const getBufferProfiles = async (): Promise<BufferProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profiles')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching buffer profiles:', error);
      return [];
    }

    // Convert database records to BufferProfile objects
    return data.map(profile => ({
      id: profile.id,
      name: profile.name,
      description: profile.description,
      variabilityFactor: profile.variability_factor || 'medium_variability',
      leadTimeFactor: profile.lead_time_factor || 'medium',
      moq: profile.moq,
      lotSizeFactor: profile.lot_size_factor
    }));
  } catch (error) {
    console.error('Error in getBufferProfiles:', error);
    return [];
  }
};

// Create buffer profile
export const createBufferProfile = async (profile: Omit<BufferProfile, 'id'>): Promise<BufferProfile> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profiles')
      .insert({
        name: profile.name,
        description: profile.description,
        variability_factor: profile.variabilityFactor,
        lead_time_factor: profile.leadTimeFactor,
        moq: profile.moq,
        lot_size_factor: profile.lotSizeFactor
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating buffer profile:', error);
      throw new Error(`Failed to create buffer profile: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      variabilityFactor: data.variability_factor,
      leadTimeFactor: data.lead_time_factor,
      moq: data.moq,
      lotSizeFactor: data.lot_size_factor
    };
  } catch (error) {
    console.error('Error in createBufferProfile:', error);
    throw error;
  }
};

// Update buffer profile
export const updateBufferProfile = async (profile: BufferProfile): Promise<BufferProfile> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profiles')
      .update({
        name: profile.name,
        description: profile.description,
        variability_factor: profile.variabilityFactor,
        lead_time_factor: profile.leadTimeFactor,
        moq: profile.moq,
        lot_size_factor: profile.lotSizeFactor
      })
      .eq('id', profile.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating buffer profile:', error);
      throw new Error(`Failed to update buffer profile: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      variabilityFactor: data.variability_factor,
      leadTimeFactor: data.lead_time_factor,
      moq: data.moq,
      lotSizeFactor: data.lot_size_factor
    };
  } catch (error) {
    console.error('Error in updateBufferProfile:', error);
    throw error;
  }
};

// Fix types for existing interfaces in types/inventory
export const fixBufferTypes = () => {
  console.log("Buffer types loaded");
  return true;
};
