/**
 * Inventory Service
 * Handles buffer profiles and inventory calculations
 */

import { supabase } from '@/integrations/supabase/client';
import { BufferFactorConfig, BufferProfile } from '@/types/inventory';

// Updated BufferFactorConfig interface that matches the database structure
export interface ExtendedBufferFactorConfig {
  id: string;
  name: string;
  lt_factor: number;
  variability_factor: number;
  order_cycle_days: number;
  min_order_qty: number;
  rounding_multiple: number;
  description?: string;
}

// Mock buffer factor configurations for fallback
const bufferFactorConfigs: ExtendedBufferFactorConfig[] = [
  {
    id: '1',
    name: 'Low Variability - Short Lead Time',
    lt_factor: 0.5,
    variability_factor: 0.25,
    order_cycle_days: 7,
    min_order_qty: 10,
    rounding_multiple: 5,
    description: 'For stable demand with predictable lead times'
  },
  {
    id: '2',
    name: 'Medium Variability - Medium Lead Time',
    lt_factor: 1.0,
    variability_factor: 0.5,
    order_cycle_days: 14,
    min_order_qty: 20,
    rounding_multiple: 10,
    description: 'Standard buffer configuration'
  }
];

/**
 * Fetch buffer profiles from buffer_profile_master table
 */
export const fetchBufferProfiles = async (): Promise<BufferProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profile_master')
      .select('*');

    if (error) throw error;

    return (data || []).map(profile => ({
      id: profile.buffer_profile_id,
      name: profile.name,
      variabilityFactor: 'medium_variability' as any,
      leadTimeFactor: 'medium' as any,
      moq: profile.min_order_qty,
      lotSizeFactor: profile.rounding_multiple,
      description: profile.description || undefined,
      createdAt: profile.created_at || undefined,
      updatedAt: profile.updated_at || undefined,
    }));
  } catch (error) {
    console.error('Error fetching buffer profiles:', error);
    return [];
  }
};

/**
 * Fetch buffer factor configurations
 */
export const fetchBufferFactorConfigs = async (): Promise<BufferFactorConfig[]> => {
  // Return mock data for now
  return bufferFactorConfigs.map(config => ({
    id: config.id,
    name: config.name,
    factor: config.variability_factor,
    description: config.description || `LT Factor: ${config.lt_factor}, Variability: ${config.variability_factor}`
  }));
};

/**
 * Fetch active Demand Adjustment Factor (DAF) for a product-location pair
 * Returns the DAF multiplier if there's an active adjustment, otherwise 1.0
 */
export const fetchActiveDAF = async (
  productId: string,
  locationId: string
): Promise<number> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('demand_adjustment_factor')
      .select('daf')
      .eq('product_id', productId)
      .eq('location_id', locationId)
      .lte('start_date', today)
      .gte('end_date', today)
      .maybeSingle();

    if (error) {
      console.error('Error fetching DAF:', error);
      return 1.0;
    }

    return data?.daf || 1.0;
  } catch (error) {
    console.error('Error fetching active DAF:', error);
    return 1.0;
  }
};

/**
 * Calculate buffer zones based on DDMRP principles
 * Matches the view calculations exactly
 * Now includes DAF (Demand Adjustment Factor) integration
 */
export const calculateBufferZones = (
  adu: number,
  leadTimeDays: number,
  variabilityFactor: number,
  settings: ExtendedBufferFactorConfig,
  daf: number = 1.0 // DAF multiplier (default 1.0 = no adjustment)
) => {
  const { lt_factor, order_cycle_days, min_order_qty } = settings;
  
  // Apply DAF to ADU for DDMRP certification compliance
  const adjustedADU = adu * daf;
  
  // DDMRP Correct Formulas (matching database view):
  
  // Red Zone = Adjusted ADU × DLT × LT Factor × Variability Factor (minimum MOQ)
  const redZone = Math.max(
    adjustedADU * leadTimeDays * lt_factor * variabilityFactor,
    min_order_qty
  );

  // Yellow Zone = Adjusted ADU × DLT × LT Factor
  const yellowZone = adjustedADU * leadTimeDays * lt_factor;

  // Green Zone = Adjusted ADU × Order Cycle × LT Factor OR Max(Red Zone, Yellow Zone)
  const greenZone = Math.max(
    adjustedADU * order_cycle_days * lt_factor,
    redZone
  );

  return {
    red: Math.round(redZone * 100) / 100,
    yellow: Math.round(yellowZone * 100) / 100,
    green: Math.round(greenZone * 100) / 100,
    adjustedADU: Math.round(adjustedADU * 100) / 100, // Return adjusted ADU for display
    dafApplied: daf !== 1.0 // Flag indicating if DAF was applied
  };
};

/**
 * Check buffer penetration for an item
 */
export const checkBufferPenetration = async (itemId: string): Promise<number> => {
  // Mock implementation - would calculate actual penetration from inventory data
  return Math.random() * 100;
};
