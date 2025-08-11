
import { supabase } from '@/lib/supabaseClient';
import { BufferFactorConfig, BufferProfile } from '@/types/inventory';

// Updated BufferFactorConfig interface that matches the data structure
export interface ExtendedBufferFactorConfig {
  id: string;
  shortLeadTimeFactor: number;
  mediumLeadTimeFactor: number;
  longLeadTimeFactor: number;
  shortLeadTimeThreshold: number;
  mediumLeadTimeThreshold: number;
  replenishmentTimeFactor: number;
  minGreenZoneDays: number;
  maxGreenZoneDays: number;
  yellowZoneFactor: number;
  decouplingPointFactor: number;
  created_at?: string;
  updated_at?: string;
  metadata: Record<string, any>;
}

// Mock data for buffer factor configurations
export const bufferFactorConfigs: ExtendedBufferFactorConfig[] = [
  {
    id: '1',
    shortLeadTimeFactor: 1.2,
    mediumLeadTimeFactor: 1.5,
    longLeadTimeFactor: 2.0,
    shortLeadTimeThreshold: 7, // days
    mediumLeadTimeThreshold: 30, // days
    replenishmentTimeFactor: 1.2, 
    minGreenZoneDays: 7,
    maxGreenZoneDays: 30,
    yellowZoneFactor: 1.1,
    decouplingPointFactor: 1.3,
    metadata: {}
  }
];

// Function to fetch buffer profiles
export const fetchBufferProfiles = async (): Promise<BufferProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('buffer_profiles')
      .select('*');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching buffer profiles:', error);
    return [];
  }
};

// Function to fetch buffer factor configurations
export const fetchBufferFactorConfigs = async (): Promise<BufferFactorConfig[]> => {
  try {
    // Mock implementation for now
    // In a real implementation, we would fetch from Supabase
    // Convert ExtendedBufferFactorConfig to BufferFactorConfig
    return bufferFactorConfigs.map(config => ({
      id: config.id,
      name: `Buffer Factor ${config.id}`, // Create a name from the ID
      factor: config.yellowZoneFactor, // Use one of the factors as the main factor
      description: `Configuration for buffer factors with short LT: ${config.shortLeadTimeFactor}, medium LT: ${config.mediumLeadTimeFactor}, long LT: ${config.longLeadTimeFactor}`
    }));
  } catch (error) {
    console.error('Error fetching buffer factor configs:', error);
    return [];
  }
};

// Function to calculate buffer zones
export const calculateBufferZones = (
  adu: number,
  leadTimeDays: number,
  variabilityFactor: number,
  settings: ExtendedBufferFactorConfig
): { red: number; yellow: number; green: number } => {
  let leadTimeFactor = settings.mediumLeadTimeFactor; // default to medium
  
  if (leadTimeDays <= settings.shortLeadTimeThreshold) {
    leadTimeFactor = settings.shortLeadTimeFactor;
  } else if (leadTimeDays > settings.mediumLeadTimeThreshold) {
    leadTimeFactor = settings.longLeadTimeFactor;
  }
  
  // Red zone calculation (base buffer)
  const redZone = Math.round(adu * leadTimeDays);
  
  // Yellow zone calculation (order cycle + variability)
  const yellowZone = Math.round(redZone * settings.yellowZoneFactor * variabilityFactor);
  
  // Green zone calculation (safety + market opportunity)
  let greenZoneDays = Math.min(
    Math.max(leadTimeDays * 0.5, settings.minGreenZoneDays),
    settings.maxGreenZoneDays
  );
  const greenZone = Math.round(adu * greenZoneDays);
  
  return {
    red: redZone,
    yellow: yellowZone,
    green: greenZone
  };
};

// Function to check and update buffer penetration status
export const checkBufferPenetration = async (itemId: string): Promise<number> => {
  try {
    // In a real implementation, we would:
    // 1. Fetch the current inventory for the item
    // 2. Calculate the buffer penetration
    // 3. Update the buffer status if needed
    
    // Mock implementation
    return Math.floor(Math.random() * 100);
  } catch (error) {
    console.error('Error checking buffer penetration:', error);
    return 0;
  }
};
