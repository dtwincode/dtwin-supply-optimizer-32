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
 * Fetch active Zone Adjustment Factor (ZAF) for a product-location pair
 * Returns the ZAF multiplier if there's an active adjustment, otherwise 1.0
 */
export const fetchActiveZAF = async (
  productId: string,
  locationId: string
): Promise<number> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('zone_adjustment_factor')
      .select('zaf')
      .eq('product_id', productId)
      .eq('location_id', locationId)
      .lte('start_date', today)
      .gte('end_date', today)
      .maybeSingle();

    if (error) {
      console.error('Error fetching ZAF:', error);
      return 1.0;
    }

    return data?.zaf || 1.0;
  } catch (error) {
    console.error('Error fetching active ZAF:', error);
    return 1.0;
  }
};

/**
 * Fetch active Lead Time Adjustment Factor (LTAF) for a product-location pair
 * Returns the LTAF multiplier if there's an active adjustment, otherwise 1.0
 */
export const fetchActiveLTAF = async (
  productId: string,
  locationId: string
): Promise<number> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('lead_time_adjustment_factor')
      .select('ltaf')
      .eq('product_id', productId)
      .eq('location_id', locationId)
      .lte('start_date', today)
      .gte('end_date', today)
      .maybeSingle();

    if (error) {
      console.error('Error fetching LTAF:', error);
      return 1.0;
    }

    return data?.ltaf || 1.0;
  } catch (error) {
    console.error('Error fetching active LTAF:', error);
    return 1.0;
  }
};

/**
 * Calculate buffer zones based on DDMRP principles
 * Matches the view calculations exactly
 * Now includes DAF, ZAF, and LTAF (Demand, Zone, Lead Time Adjustment Factors)
 */
export const calculateBufferZones = (
  adu: number,
  leadTimeDays: number,
  variabilityFactor: number,
  settings: ExtendedBufferFactorConfig,
  daf: number = 1.0, // DAF multiplier (default 1.0 = no adjustment)
  zaf: number = 1.0, // ZAF multiplier (default 1.0 = no adjustment)
  ltaf: number = 1.0 // LTAF multiplier (default 1.0 = no adjustment)
) => {
  const { lt_factor, order_cycle_days, min_order_qty } = settings;
  
  // Apply all three DDMRP planned adjustment factors
  const adjustedADU = adu * daf; // Adjust demand
  const adjustedVariabilityFactor = variabilityFactor * zaf; // Adjust variability
  const adjustedLTFactor = lt_factor * ltaf; // Adjust lead time factor
  
  // DDMRP Correct Formulas (matching database view with all adjustments):
  
  // Red Zone = Adjusted ADU × DLT × Adjusted LT Factor × Adjusted Variability Factor (minimum MOQ)
  const redZone = Math.max(
    adjustedADU * leadTimeDays * adjustedLTFactor * adjustedVariabilityFactor,
    min_order_qty
  );

  // Yellow Zone = Adjusted ADU × DLT × Adjusted LT Factor
  const yellowZone = adjustedADU * leadTimeDays * adjustedLTFactor;

  // Green Zone = Adjusted ADU × Order Cycle × Adjusted LT Factor OR Max(Red Zone, Yellow Zone)
  const greenZone = Math.max(
    adjustedADU * order_cycle_days * adjustedLTFactor,
    redZone
  );

  return {
    red: Math.round(redZone * 100) / 100,
    yellow: Math.round(yellowZone * 100) / 100,
    green: Math.round(greenZone * 100) / 100,
    adjustedADU: Math.round(adjustedADU * 100) / 100,
    adjustedVariabilityFactor: Math.round(adjustedVariabilityFactor * 100) / 100,
    adjustedLTFactor: Math.round(adjustedLTFactor * 100) / 100,
    dafApplied: daf !== 1.0,
    zafApplied: zaf !== 1.0,
    ltafApplied: ltaf !== 1.0
  };
};

/**
 * Check buffer penetration for an item
 */
export const checkBufferPenetration = async (itemId: string): Promise<number> => {
  // Mock implementation - would calculate actual penetration from inventory data
  return Math.random() * 100;
};
