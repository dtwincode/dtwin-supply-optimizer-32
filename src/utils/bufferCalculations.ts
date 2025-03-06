import { InventoryItem, BufferZones, NetFlowPosition, BufferFactorConfig } from '@/types/inventory';
import { getActiveBufferConfig } from '@/services/inventoryService';

// Calculate buffer zones based on DDMRP methodology
export const calculateBufferZones = async (item: InventoryItem): Promise<BufferZones> => {
  if (!item.adu || !item.leadTimeDays) {
    return {
      red: 0,
      yellow: 0,
      green: 0
    };
  }

  const config = await getActiveBufferConfig();

  // Determine lead time category and factor
  let leadTimeFactor: number;
  if (item.leadTimeDays <= config.shortLeadTimeThreshold) {
    leadTimeFactor = config.shortLeadTimeFactor;
  } else if (item.leadTimeDays <= config.mediumLeadTimeThreshold) {
    leadTimeFactor = config.mediumLeadTimeFactor;
  } else {
    leadTimeFactor = config.longLeadTimeFactor;
  }
  
  // Apply variability factor
  const variabilityFactor = item.variabilityFactor || 1;

  // Apply dynamic adjustments if available
  const seasonalityFactor = item.dynamicAdjustments?.seasonality || 1;
  const trendFactor = item.dynamicAdjustments?.trend || 1;
  const marketStrategyFactor = item.dynamicAdjustments?.marketStrategy || 1;
  
  // Calculate combined adjustment factor
  const combinedAdjustmentFactor = seasonalityFactor * trendFactor * marketStrategyFactor;

  // Calculate zones using the advanced DDMRP formulas with dynamic adjustments
  const redZone = Math.round(item.adu * leadTimeFactor * variabilityFactor * combinedAdjustmentFactor);
  const yellowZone = Math.round(item.adu * item.leadTimeDays * config.replenishmentTimeFactor);
  const greenZone = Math.round(yellowZone * config.greenZoneFactor);

  return {
    red: redZone,
    yellow: yellowZone,
    green: greenZone
  };
};

// Calculate net flow position with improved formula
export const calculateNetFlowPosition = (item: InventoryItem): NetFlowPosition => {
  const onHand = item.onHand || 0;
  const onOrder = item.onOrder || 0;
  
  // Consider qualified demand with adjustments based on demand variability
  const qualifiedDemand = calculateQualifiedDemand(item);
  
  const netFlowPosition = onHand + onOrder - qualifiedDemand;

  return {
    onHand,
    onOrder,
    qualifiedDemand,
    netFlowPosition
  };
};

// New function: Calculate qualified demand with spike adjustment
export const calculateQualifiedDemand = (item: InventoryItem): number => {
  const baseQualifiedDemand = item.qualifiedDemand || 0;
  
  // Apply spike threshold adjustment if configured
  if (item.orderSpikeThreshold && baseQualifiedDemand > item.orderSpikeThreshold) {
    // Adjust demand that exceeds the spike threshold
    const regularDemand = item.orderSpikeThreshold;
    const spikeDemand = baseQualifiedDemand - item.orderSpikeThreshold;
    
    // Apply a dampening factor to spike demand
    const spikeDampeningFactor = 0.5; // This could be configurable
    return regularDemand + (spikeDemand * spikeDampeningFactor);
  }
  
  return baseQualifiedDemand;
};

// Calculate buffer penetration percentage with improved precision
export const calculateBufferPenetration = (
  netFlowPosition: number,
  bufferZones: BufferZones
): number => {
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  if (totalBuffer === 0) return 0;
  
  const penetration = ((totalBuffer - netFlowPosition) / totalBuffer) * 100;
  return Math.max(0, Math.min(100, Number(penetration.toFixed(2))));
};

// Enhanced planning priority calculation with more granularity
export const calculatePlanningPriority = (bufferPenetration: number): string => {
  if (bufferPenetration >= 95) return 'Critical';
  if (bufferPenetration >= 85) return 'Very High';
  if (bufferPenetration >= 70) return 'High';
  if (bufferPenetration >= 50) return 'Medium';
  if (bufferPenetration >= 25) return 'Low';
  return 'Very Low';
};

// New function: Calculate decoupled lead time
export const calculateDecoupledLeadTime = (
  item: InventoryItem,
  bufferProfile?: { variabilityFactor: string; leadTimeFactor: string }
): number => {
  if (!item.leadTimeDays) return 0;
  
  // Apply lead time compression based on decoupling point strategy
  let compressionFactor = 1.0;
  
  if (bufferProfile) {
    // Adjust compression factor based on buffer profile
    if (bufferProfile.variabilityFactor === 'low_variability' && 
        bufferProfile.leadTimeFactor === 'short') {
      compressionFactor = 0.7;
    } else if (bufferProfile.variabilityFactor === 'medium_variability' ||
              bufferProfile.leadTimeFactor === 'medium') {
      compressionFactor = 0.85;
    }
  }
  
  return Number((item.leadTimeDays * compressionFactor).toFixed(1));
};

// New function: Calculate inventory health metrics
export const calculateInventoryHealthMetrics = (
  item: InventoryItem,
  bufferZones: BufferZones,
  netFlowPosition: number
): {
  inventoryTurnsRatio: number;
  bufferHealthAssessment: number;
  leadTimeCompressionIndex: number;
  demandDrivenFillRate: number;
} => {
  // Calculate inventory turns ratio (higher is better)
  const averageInventory = (item.onHand + (item.onHand - item.qualifiedDemand + item.onOrder)) / 2;
  const annualizedDemand = (item.adu || 0) * 365;
  const inventoryTurnsRatio = averageInventory > 0 ? Number((annualizedDemand / averageInventory).toFixed(2)) : 0;
  
  // Calculate buffer health (0-100, higher is better)
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  const idealPosition = bufferZones.red + (bufferZones.yellow * 0.5);
  const positionDeviation = Math.abs(netFlowPosition - idealPosition);
  const bufferHealthAssessment = totalBuffer > 0 
    ? Number((100 - ((positionDeviation / totalBuffer) * 100)).toFixed(2))
    : 0;
  
  // Calculate lead time compression index (0-100, higher is better)
  const originalLeadTime = item.originalLeadTime || item.leadTimeDays || 0;
  const currentLeadTime = item.decoupledLeadTime || item.leadTimeDays || 0;
  const leadTimeCompressionIndex = originalLeadTime > 0 
    ? Number((100 * (1 - (currentLeadTime / originalLeadTime))).toFixed(2))
    : 0;
  
  // Calculate demand-driven fill rate (0-100%, higher is better)
  // This is an estimation based on buffer penetration
  const bufferPenetration = calculateBufferPenetration(netFlowPosition, bufferZones);
  const demandDrivenFillRate = bufferPenetration <= 70 
    ? 99 
    : (bufferPenetration <= 85 
      ? 95 
      : (bufferPenetration <= 95 
        ? 90 
        : 80));
  
  return {
    inventoryTurnsRatio,
    bufferHealthAssessment,
    leadTimeCompressionIndex,
    demandDrivenFillRate
  };
};

// New function: Determine optimal buffer levels
export const calculateOptimalBufferLevels = (
  item: InventoryItem,
  config: BufferFactorConfig
): {
  optimalRedZone: number;
  optimalYellowZone: number;
  optimalGreenZone: number;
  currentDeviation: number;
} => {
  if (!item.adu || !item.leadTimeDays) {
    return {
      optimalRedZone: 0,
      optimalYellowZone: 0,
      optimalGreenZone: 0,
      currentDeviation: 0
    };
  }
  
  // Determine lead time category and factor
  let leadTimeFactor: number;
  if (item.leadTimeDays <= config.shortLeadTimeThreshold) {
    leadTimeFactor = config.shortLeadTimeFactor;
  } else if (item.leadTimeDays <= config.mediumLeadTimeThreshold) {
    leadTimeFactor = config.mediumLeadTimeFactor;
  } else {
    leadTimeFactor = config.longLeadTimeFactor;
  }
  
  // Calculate optimal variability factor based on demand patterns
  const optimalVariabilityFactor = item.demandVariabilityFactor || 1;
  
  // Calculate optimal zones
  const optimalRedZone = Math.round(item.adu * leadTimeFactor * optimalVariabilityFactor);
  const optimalYellowZone = Math.round(item.adu * item.leadTimeDays * config.replenishmentTimeFactor);
  const optimalGreenZone = Math.round(optimalYellowZone * config.greenZoneFactor);
  
  // Calculate current deviation
  const currentRedZone = item.redZoneSize || 0;
  const currentYellowZone = item.yellowZoneSize || 0;
  const currentGreenZone = item.greenZoneSize || 0;
  
  const totalOptimal = optimalRedZone + optimalYellowZone + optimalGreenZone;
  const totalCurrent = currentRedZone + currentYellowZone + currentGreenZone;
  
  const currentDeviation = totalOptimal > 0 
    ? Number((Math.abs(totalCurrent - totalOptimal) / totalOptimal * 100).toFixed(2))
    : 0;
  
  return {
    optimalRedZone,
    optimalYellowZone,
    optimalGreenZone,
    currentDeviation
  };
};

// Determine if a purchase order should be created with enhanced logic
export const shouldCreatePurchaseOrder = (
  netFlowPosition: number,
  bufferZones: BufferZones,
  supplySignals?: { leadTimeAlert: boolean; qualityAlert: boolean; orderDelayRisk: string }
): { shouldOrder: boolean; urgencyLevel: 'normal' | 'expedite' | 'emergency' } => {
  const topOfYellow = bufferZones.red + bufferZones.yellow;
  const topOfRed = bufferZones.red;
  const redYellowMidpoint = bufferZones.red + (bufferZones.yellow * 0.5);
  
  // Base decision on buffer penetration and zone position
  let shouldOrder = false;
  let urgencyLevel: 'normal' | 'expedite' | 'emergency' = 'normal';
  
  if (netFlowPosition < redYellowMidpoint) {
    shouldOrder = true;
    
    // Determine urgency level
    if (netFlowPosition < (topOfRed * 0.5)) {
      urgencyLevel = 'emergency';
    } else if (netFlowPosition < topOfRed) {
      urgencyLevel = 'expedite';
    }
    
    // Adjust based on supply signals if available
    if (supplySignals) {
      if (supplySignals.leadTimeAlert || 
          supplySignals.qualityAlert || 
          supplySignals.orderDelayRisk === 'high') {
        // Increase urgency level if supply risks are present
        if (urgencyLevel === 'normal') urgencyLevel = 'expedite';
        else if (urgencyLevel === 'expedite') urgencyLevel = 'emergency';
      }
    }
  }
  
  return { shouldOrder, urgencyLevel };
};

// Calculate how much to order with enhanced logic
export const calculateOrderQuantity = (
  netFlowPosition: number,
  bufferZones: BufferZones,
  moq?: number,
  economicOrderQty?: number,
  lotSizeFactor?: number
): number => {
  const topOfGreen = bufferZones.red + bufferZones.yellow + bufferZones.green;
  let orderQuantity = topOfGreen - netFlowPosition;
  
  // Apply economic order quantity if available
  if (economicOrderQty && orderQuantity > 0) {
    // Round up to nearest multiple of EOQ
    orderQuantity = Math.ceil(orderQuantity / economicOrderQty) * economicOrderQty;
  } 
  // Otherwise apply MOQ if specified
  else if (moq && orderQuantity > 0) {
    // Round up to MOQ
    orderQuantity = Math.ceil(orderQuantity / moq) * moq;
  }
  
  // Apply lot size factor if specified
  if (lotSizeFactor && lotSizeFactor > 1 && orderQuantity > 0) {
    orderQuantity = Math.ceil(orderQuantity * lotSizeFactor);
  }
  
  return Math.max(0, orderQuantity);
};

// Get buffer status color with more granular states
export const getBufferStatus = (bufferPenetration: number): 'green' | 'yellow' | 'orange' | 'red' | 'critical' => {
  if (bufferPenetration <= 33) return 'green';
  if (bufferPenetration <= 66) return 'yellow';
  if (bufferPenetration <= 85) return 'orange';
  if (bufferPenetration <= 95) return 'red';
  return 'critical';
};

// Buffer zone formulas reference
export const bufferZoneFormulas = {
  redZone: "Red Zone = ADU × Lead Time Factor × Variability Factor × Dynamic Adjustments",
  yellowZone: "Yellow Zone = ADU × Replenishment Time × Replenishment Factor",
  greenZone: "Green Zone = Yellow Zone × Green Zone Factor",
  netFlowPosition: "Net Flow Position = On Hand + On Order - Qualified Demand",
  bufferPenetration: "Buffer Penetration % = ((Red + Yellow + Green) - Net Flow Position) / (Red + Yellow + Green) × 100",
  qualifiedDemand: "Qualified Demand = Base Demand with Spike Adjustments",
  decoupledLeadTime: "Decoupled Lead Time = Original Lead Time × Compression Factor",
  notes: `
    Where:
    - ADU = Average Daily Usage
    - Lead Time Factor varies based on lead time category:
      • Short (≤ ${7} days): ${0.7}
      • Medium (≤ ${14} days): ${1.0}
      • Long (> ${14} days): ${1.3}
    - Dynamic Adjustments = Seasonality × Trend × Market Strategy
    - Replenishment Time is measured in days
    - Replenishment Factor adjusts for order processing time
    - Green Zone Factor determines safety stock level
    All factors are configurable in the buffer configuration settings.
  `
};

// Export all the functions
export {
  calculateQualifiedDemand,
  calculateDecoupledLeadTime,
  calculateInventoryHealthMetrics,
  calculateOptimalBufferLevels
};
