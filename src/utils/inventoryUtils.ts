
import { InventoryItem, BufferZones, NetFlowPosition, BufferFactorConfig } from "@/types/inventory";
import { supabase } from "@/lib/supabaseClient";

let activeBufferConfig: BufferFactorConfig | null = null;

export const fetchActiveBufferConfig = async (): Promise<BufferFactorConfig> => {
  if (activeBufferConfig) return activeBufferConfig;

  try {
    // Since buffer_factor_configs doesn't exist, use buffer_profiles instead
    const { data, error } = await supabase
      .from('buffer_profiles')
      .select('*')
      .eq('name', 'Default')  // Using name as a way to identify the default profile
      .single();

    if (error) {
      console.error('Error fetching buffer config:', error);
      return getDefaultBufferConfig();
    }

    // Transform from buffer_profiles to the expected BufferFactorConfig
    activeBufferConfig = {
      id: data.id,
      shortLeadTimeFactor: 0.7,
      mediumLeadTimeFactor: 1.0,
      longLeadTimeFactor: 1.3,
      shortLeadTimeThreshold: 7,
      mediumLeadTimeThreshold: 14,
      replenishmentTimeFactor: data.lead_time_factor || 1.0,
      greenZoneFactor: 0.7,
      description: data.description,
      isActive: true,
      metadata: {}
    };

    return activeBufferConfig;
  } catch (err) {
    console.error("Error in fetchActiveBufferConfig:", err);
    return getDefaultBufferConfig();
  }
};

// Helper function to provide default buffer configuration
const getDefaultBufferConfig = (): BufferFactorConfig => {
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
};

export const calculateBufferZones = async (item: InventoryItem): Promise<BufferZones> => {
  console.log("Calculating buffer zones for item:", item);
  
  try {
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
    
    // Next priority: Use safety_stock field from planning view
    if (typeof item.safetyStock !== 'undefined') {
      const safetyStock = Math.round(Number(item.safetyStock) || 0);
      const minLevel = Math.round(Number(item.minStockLevel) || 0);
      const maxLevel = Math.round(Number(item.maxStockLevel) || 0);
      
      // In inventory_planning_view, safetyStock is the red zone
      // minStockLevel includes safetyStock, so yellow = min - safety
      // maxStockLevel includes minStockLevel, so green = max - min
      const redZone = safetyStock;
      const yellowZone = minLevel - safetyStock;
      const greenZone = maxLevel - minLevel;
      
      console.log("Using inventory_planning_view data:", {
        red: redZone,
        yellow: yellowZone,
        green: greenZone,
        safetyStock: safetyStock,
        minStockLevel: minLevel,
        maxStockLevel: maxLevel
      });
      
      if (redZone > 0 || yellowZone > 0 || greenZone > 0) {
        return {
          red: redZone,
          yellow: yellowZone,
          green: greenZone
        };
      }
    }

    // If we don't have planning data, calculate from ADU and lead time
    console.log("Calculating buffer zones from ADU and lead time");
    const adu = 
      typeof item.adu !== 'undefined' ? Number(item.adu) : 0;
    
    const leadTimeDays = 
      typeof item.leadTimeDays !== 'undefined' ? Number(item.leadTimeDays) : 14; // default to 14 if unavailable
    
    // If we don't have enough data for ADU, use a default value based on on-hand inventory
    const estimatedAdu = adu || (item.onHand ? Math.max(1, Math.round(item.onHand / 30)) : 1);
    
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
      typeof item.demandVariabilityFactor !== 'undefined' ? Number(item.demandVariabilityFactor) : 1;

    // Calculate zones using the configurable DDMRP formulas
    const redZone = Math.round(estimatedAdu * leadTimeFactor * variabilityFactor);
    const yellowZone = Math.round(estimatedAdu * leadTimeDays * config.replenishmentTimeFactor);
    const greenZone = Math.round(yellowZone * config.greenZoneFactor);

    console.log("Calculated buffer zones:", {
      red: redZone,
      yellow: yellowZone,
      green: greenZone,
      adu: estimatedAdu,
      leadTimeDays,
      variabilityFactor
    });

    return {
      red: Math.max(redZone, 1),
      yellow: Math.max(yellowZone, 1),
      green: Math.max(greenZone, 1)
    };
  } catch (error) {
    console.error("Error in calculateBufferZones:", error);
    // Return default values if calculation fails
    return {
      red: 10,
      yellow: 20,
      green: 10
    };
  }
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
