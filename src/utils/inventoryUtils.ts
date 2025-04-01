
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
      isActive: true,
      metadata: {}
    };
  }

  // Ensure metadata is an object, or default to empty object
  const metadata = typeof data.metadata === 'object' ? data.metadata : {};

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
    metadata: metadata as Record<string, any>
  };

  return activeBufferConfig;
};

export const calculateBufferZones = async (item: InventoryItem): Promise<BufferZones> => {
  console.log("Calculating buffer zones for item:", item);
  
  // First, check if we already have direct buffer zones data
  if (item.redZoneSize && item.yellowZoneSize && item.greenZoneSize) {
    console.log("Using predefined buffer zones:", {
      red: item.redZoneSize,
      yellow: item.yellowZoneSize,
      green: item.greenZoneSize
    });
    return {
      red: item.redZoneSize,
      yellow: item.yellowZoneSize,
      green: item.greenZoneSize
    };
  }
  
  // Next priority: Use planning view fields if available
  if (
    typeof item.safety_stock !== 'undefined' && 
    typeof item.min_stock_level !== 'undefined' &&
    typeof item.max_stock_level !== 'undefined'
  ) {
    const safetyStock = Math.round(Number(item.safety_stock) || 0);
    const minLevel = Math.round(Number(item.min_stock_level) || 0);
    const maxLevel = Math.round(Number(item.max_stock_level) || 0);
    
    // In inventory_planning_view, safety_stock is the red zone
    // min_stock_level includes safety_stock, so yellow = min - safety
    // max_stock_level includes min_stock_level, so green = max - min
    const redZone = safetyStock;
    const yellowZone = minLevel - safetyStock;
    const greenZone = maxLevel - minLevel;
    
    console.log("Using inventory_planning_view data:", {
      red: redZone,
      yellow: yellowZone,
      green: greenZone,
      safety_stock: safetyStock,
      min_stock_level: minLevel,
      max_stock_level: maxLevel
    });
    
    return {
      red: redZone,
      yellow: yellowZone,
      green: greenZone
    };
  }

  // If we don't have planning data, calculate from ADU and lead time
  console.log("Calculating buffer zones from ADU and lead time");
  const adu = 
    typeof item.adu !== 'undefined' ? Number(item.adu) : 
    typeof item.average_daily_usage !== 'undefined' ? Number(item.average_daily_usage) : 0;
  
  const leadTimeDays = 
    typeof item.leadTimeDays !== 'undefined' ? Number(item.leadTimeDays) : 
    typeof item.lead_time_days !== 'undefined' ? Number(item.lead_time_days) : 0;
  
  // If we don't have enough data, return zeros
  if (!adu || !leadTimeDays) {
    console.log("Insufficient data for buffer calculation: ADU:", adu, "Lead time:", leadTimeDays);
    return {
      red: 0,
      yellow: 0,
      green: 0
    };
  }

  const config = await fetchActiveBufferConfig();
  
  // Determine lead time category and factor
  let leadTimeFactor: number;
  if (leadTimeDays <= config.shortLeadTimeThreshold) {
    leadTimeFactor = config.shortLeadTimeFactor;
  } else if (leadTimeDays <= config.mediumLeadTimeThreshold) {
    leadTimeFactor = config.mediumLeadTimeFactor;
  } else {
    leadTimeFactor = config.longLeadTimeFactor;
  }
  
  // Variability factor (if not provided, default to 1)
  const variabilityFactor = 
    typeof item.variabilityFactor !== 'undefined' ? Number(item.variabilityFactor) : 
    typeof item.demand_variability !== 'undefined' ? Number(item.demand_variability) : 1;

  // Calculate zones using the configurable DDMRP formulas
  const redZone = Math.round(adu * leadTimeFactor * variabilityFactor);
  const yellowZone = Math.round(adu * leadTimeDays * config.replenishmentTimeFactor);
  const greenZone = Math.round(yellowZone * config.greenZoneFactor);

  console.log("Calculated buffer zones:", {
    red: redZone,
    yellow: yellowZone,
    green: greenZone,
    adu,
    leadTimeDays,
    variabilityFactor
  });

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
