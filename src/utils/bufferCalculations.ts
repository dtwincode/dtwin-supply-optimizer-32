
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

// Calculate net flow position
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

// Calculate buffer penetration percentage
export const calculateBufferPenetration = (
  netFlowPosition: number,
  bufferZones: BufferZones
): number => {
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  if (totalBuffer === 0) return 0;
  
  const penetration = ((totalBuffer - netFlowPosition) / totalBuffer) * 100;
  return Math.max(0, Math.min(100, penetration));
};

// Determine planning priority based on buffer penetration
export const calculatePlanningPriority = (bufferPenetration: number): string => {
  if (bufferPenetration >= 95) return 'Critical';
  if (bufferPenetration >= 80) return 'High';
  if (bufferPenetration >= 60) return 'Medium';
  return 'Low';
};

// Determine if a purchase order should be created
export const shouldCreatePurchaseOrder = (
  netFlowPosition: number,
  bufferZones: BufferZones
): boolean => {
  const topOfYellow = bufferZones.red + bufferZones.yellow;
  return netFlowPosition < bufferZones.red;
};

// Calculate how much to order
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

// Get buffer status color
export const getBufferStatus = (bufferPenetration: number): 'green' | 'yellow' | 'red' => {
  if (bufferPenetration <= 33) return 'green';
  if (bufferPenetration <= 66) return 'yellow';
  return 'red';
};

// Buffer zone formulas reference
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
