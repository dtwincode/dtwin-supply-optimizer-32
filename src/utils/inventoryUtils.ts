import { InventoryItem, BufferZones, NetFlowPosition } from "@/types/inventory";

export const calculateBufferZones = (item: InventoryItem): BufferZones => {
  if (!item.adu || !item.leadTimeDays) {
    return {
      red: 0,
      yellow: 0,
      green: 0
    };
  }

  // Lead time category factors
  const leadTimeFactors = {
    short: 0.7,
    medium: 1.0,
    long: 1.3
  };

  // Get the appropriate lead time factor
  const leadTimeFactor = leadTimeFactors[item.leadTimeDays <= 7 ? 'short' : item.leadTimeDays <= 14 ? 'medium' : 'long'];
  
  // Variability factor (if not provided, default to 1)
  const variabilityFactor = item.variabilityFactor || 1;

  // Calculate zones using the DDMRP formulas
  const redZone = Math.round(item.adu * leadTimeFactor * variabilityFactor); // Red Zone = ADU × Lead Time Factor
  const yellowZone = Math.round(item.adu * item.leadTimeDays); // Yellow Zone = ADU × Replenishment Time
  const greenZone = Math.round(yellowZone * 0.7); // Green Zone = Yellow Zone × Top of Green Factor (using 0.7 as default)

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
  redZone: "Red Zone = ADU × Lead Time Factor",
  yellowZone: "Yellow Zone = ADU × Replenishment Time",
  greenZone: "Green Zone = Yellow Zone × Top of Green Factor",
  notes: `
    Where:
    - ADU = Average Daily Usage
    - Lead Time Factor varies based on lead time category (short: 0.7, medium: 1.0, long: 1.3)
    - Replenishment Time is measured in days
    - Top of Green Factor is typically 0.7 (70% of Yellow Zone)
  `
};
