
import { supabase } from '@/integrations/supabase/client';
import { InventoryItem, BufferProfile, DecouplingPoint, BufferFactorConfig } from '@/types/inventory';
import { inventoryData } from '@/data/inventoryData';

// Fetch inventory items with pagination and filtering
export const getInventoryItems = async (
  filters?: Partial<Record<string, string>>,
  page = 1,
  pageSize = 10
): Promise<{ data: InventoryItem[]; count: number }> => {
  try {
    // In a real application, this would query the database
    // For now, use mock data and simulate filtering and pagination
    let filteredData = [...inventoryData];
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          filteredData = filteredData.filter(item => 
            String(item[key as keyof InventoryItem])
              .toLowerCase()
              .includes(value.toLowerCase())
          );
        }
      });
    }
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredData.slice(start, end);
    
    return {
      data: paginatedData,
      count: filteredData.length
    };
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return { data: [], count: 0 };
  }
};

// Fetch buffer profiles
export const getBufferProfiles = async (): Promise<BufferProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profiles')
      .select('*');
      
    if (error) throw error;
    
    return data.map(profile => ({
      id: profile.id,
      name: profile.name,
      description: profile.description,
      variabilityFactor: profile.variability_factor,
      leadTimeFactor: profile.lead_time_factor,
      moq: profile.moq,
      lotSizeFactor: profile.lot_size_factor
    }));
  } catch (error) {
    console.error('Error fetching buffer profiles:', error);
    
    // Return mock data if API call fails
    return [
      {
        id: 'profile-1',
        name: 'High Variability Profile',
        description: 'For items with unstable demand patterns',
        variabilityFactor: 'high_variability',
        leadTimeFactor: 'medium'
      },
      {
        id: 'profile-2',
        name: 'Standard Profile',
        description: 'For regular items with predictable demand',
        variabilityFactor: 'medium_variability',
        leadTimeFactor: 'medium'
      },
      {
        id: 'profile-3',
        name: 'Low Variability Profile',
        description: 'For stable items with consistent demand',
        variabilityFactor: 'low_variability',
        leadTimeFactor: 'short'
      }
    ];
  }
};

// Fetch decoupling points
export const getDecouplingPoints = async (): Promise<DecouplingPoint[]> => {
  try {
    const { data, error } = await supabase
      .from('decoupling_points')
      .select('*');
      
    if (error) throw error;
    
    return data.map(point => ({
      id: point.id,
      locationId: point.location_id,
      type: point.type,
      description: point.description,
      bufferProfileId: point.buffer_profile_id
    }));
  } catch (error) {
    console.error('Error fetching decoupling points:', error);
    
    // Return mock data if API call fails
    return [
      {
        id: 'dp-001',
        locationId: 'loc-001',
        type: 'strategic',
        description: 'Main distribution center',
        bufferProfileId: 'profile-1'
      },
      {
        id: 'dp-002',
        locationId: 'loc-002',
        type: 'customer_order',
        description: 'Regional fulfillment center',
        bufferProfileId: 'profile-2'
      }
    ];
  }
};

// Create/update buffer profile
export const saveBufferProfile = async (profile: BufferProfile): Promise<BufferProfile> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profiles')
      .upsert({
        id: profile.id,
        name: profile.name,
        description: profile.description,
        variability_factor: profile.variabilityFactor,
        lead_time_factor: profile.leadTimeFactor,
        moq: profile.moq,
        lot_size_factor: profile.lotSizeFactor
      })
      .select()
      .single();
      
    if (error) throw error;
    
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
    console.error('Error saving buffer profile:', error);
    throw error;
  }
};

// Create/update decoupling point
export const saveDecouplingPoint = async (point: DecouplingPoint): Promise<DecouplingPoint> => {
  try {
    const { data, error } = await supabase
      .from('decoupling_points')
      .upsert({
        id: point.id,
        location_id: point.locationId,
        type: point.type,
        description: point.description,
        buffer_profile_id: point.bufferProfileId
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      locationId: data.location_id,
      type: data.type,
      description: data.description,
      bufferProfileId: data.buffer_profile_id
    };
  } catch (error) {
    console.error('Error saving decoupling point:', error);
    throw error;
  }
};

// Get active buffer configuration
export const getActiveBufferConfig = async (): Promise<BufferFactorConfig> => {
  try {
    const { data, error } = await supabase
      .from('buffer_factor_configs')
      .select('*')
      .eq('is_active', true)
      .single();
      
    if (error) throw error;
    
    return {
      id: data.id,
      shortLeadTimeFactor: data.short_lead_time_factor,
      mediumLeadTimeFactor: data.medium_lead_time_factor,
      longLeadTimeFactor: data.long_lead_time_factor,
      shortLeadTimeThreshold: data.short_lead_time_threshold,
      mediumLeadTimeThreshold: data.medium_lead_time_threshold,
      replenishmentTimeFactor: data.replenishment_time_factor,
      greenZoneFactor: data.green_zone_factor,
      description: data.description,
      isActive: data.is_active,
      industry: data.industry,
      isBenchmarkBased: data.is_benchmark_based,
      metadata: data.metadata
    };
  } catch (error) {
    console.error('Error fetching buffer config:', error);
    
    // Return default config if API call fails
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

// Create purchase order
export const createPurchaseOrder = async (
  sku: string,
  quantity: number,
  supplier?: string
): Promise<{ success: boolean; message: string; id?: string }> => {
  try {
    const poNumber = `PO-${Date.now().toString().slice(-6)}`;
    
    const { data, error } = await supabase
      .from('purchase_orders')
      .insert({
        po_number: poNumber,
        sku,
        quantity,
        supplier,
        status: 'draft',
        order_date: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      success: true,
      message: `Purchase order ${poNumber} created successfully`,
      id: data.id
    };
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return {
      success: false,
      message: `Failed to create purchase order: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
