
import { InventoryItem, BufferZones, NetFlowPosition, BufferFactorConfig } from "@/types/inventory";
import { supabase } from "@/integrations/supabase/client";

let activeBufferConfig: BufferFactorConfig | null = null;

export const fetchActiveBufferConfig = async (): Promise<BufferFactorConfig> => {
  if (activeBufferConfig) return activeBufferConfig;

  const { data, error } = await supabase
    .from('buffer_factor_configs')
    .select('*')
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching buffer config:', error);
    // Fall back to default values if fetch fails
    return {
      id: 'default',
      shortLeadTimeFactor: 0.7,
      mediumLeadTimeFactor: 1.0,
      longLeadTimeFactor: 1.3,
      shortLeadTimeThreshold: 7,
      mediumLeadTimeThreshold: 14,
      replenishmentTimeFactor: 1.0,
      greenZoneFactor: 0.7,
      isActive: true
    };
  }

  // Map database columns to camelCase interface
  activeBufferConfig = {
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
    metadata: data.metadata
  };

  return activeBufferConfig;
};

export const calculateBufferZones = async (item: InventoryItem): Promise<BufferZones> => {
  if (!item.adu || !item.leadTimeDays) {
    return {
      red: 0,
      yellow: 0,
      green: 0
    };
  }

  const config = await fetchActiveBufferConfig();

  // Determine lead time category and factor
  let leadTimeFactor: number;
  if (item.leadTimeDays <= config.shortLeadTimeThreshold) {
    leadTimeFactor = config.shortLeadTimeFactor;
  } else if (item.leadTimeDays <= config.mediumLeadTimeThreshold) {
    leadTimeFactor = config.mediumLeadTimeFactor;
  } else {
    leadTimeFactor = config.longLeadTimeFactor;
  }
  
  // Variability factor (if not provided, default to 1)
  const variabilityFactor = item.variabilityFactor || 1;

  // Calculate zones using the configurable DDMRP formulas
  const redZone = Math.round(item.adu * leadTimeFactor * variabilityFactor);
  const yellowZone = Math.round(item.adu * item.leadTimeDays * config.replenishmentTimeFactor);
  const greenZone = Math.round(yellowZone * config.greenZoneFactor);

  return {
    red: redZone,
    yellow: yellowZone,
    green: greenZone
  };
};

export const calculateNetFlowPosition = (item: InventoryItem): NetFlowPosition => {
  const onHand = item.onHand || 0;
  const onOrder = item.onOrder || 0;
  const qualifiedDemand = item.qualifiedDemand || 0;
  const netFlowPosition = onHand + onOrder - qualifiedDemand;

  return {
    onHand,
    onOrder,
    qualifiedDemand,
    netFlowPosition
  };
};

export const calculateBufferPenetration = (
  netFlowPosition: number,
  bufferZones: BufferZones
): number => {
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  const penetration = ((totalBuffer - netFlowPosition) / totalBuffer) * 100;
  return Math.max(0, Math.min(100, penetration));
};

export const calculatePlanningPriority = (bufferPenetration: number): string => {
  if (bufferPenetration >= 95) return 'Critical';
  if (bufferPenetration >= 80) return 'High';
  if (bufferPenetration >= 60) return 'Medium';
  return 'Low';
};

export const shouldCreatePurchaseOrder = (
  netFlowPosition: number,
  bufferZones: BufferZones
): boolean => {
  const topOfGreen = bufferZones.red + bufferZones.yellow + bufferZones.green;
  return netFlowPosition < (bufferZones.red + (bufferZones.yellow * 0.5));
};

export const calculateOrderQuantity = (
  netFlowPosition: number,
  bufferZones: BufferZones,
  moq?: number
): number => {
  const topOfGreen = bufferZones.red + bufferZones.yellow + bufferZones.green;
  let orderQuantity = topOfGreen - netFlowPosition;
  
  // Round up to MOQ if specified
  if (moq && orderQuantity > 0) {
    orderQuantity = Math.ceil(orderQuantity / moq) * moq;
  }
  
  return Math.max(0, orderQuantity);
};

export const getBufferStatus = (bufferPenetration: number): 'green' | 'yellow' | 'red' => {
  if (bufferPenetration <= 33) return 'green';
  if (bufferPenetration <= 66) return 'yellow';
  return 'red';
};

export const bufferZoneFormulas = {
  redZone: "Red Zone = ADU × Lead Time Factor × Variability Factor",
  yellowZone: "Yellow Zone = ADU × Replenishment Time × Replenishment Factor",
  greenZone: "Green Zone = Yellow Zone × Green Zone Factor",
  notes: `
    Where:
    - ADU = Average Daily Usage
    - Lead Time Factor varies based on lead time category:
      • Short (≤ 7 days): 0.7
      • Medium (≤ 14 days): 1.0
      • Long (> 14 days): 1.3
    - Replenishment Time is measured in days
    - Replenishment Factor adjusts for order processing time
    - Green Zone Factor determines safety stock level
    All factors are configurable in the buffer configuration settings.
  `
};
