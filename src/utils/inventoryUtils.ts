
import { InventoryItem, BufferZones, NetFlowPosition } from "@/types/inventory";

export const calculateBufferZones = (item: InventoryItem): BufferZones => {
  // Lead time category factors
  const leadTimeFactors = {
    short: 0.7,
    medium: 1.0,
    long: 1.3
  };

  // Variability factors
  const variabilityFactors = {
    low_variability: 0.8,
    medium_variability: 1.0,
    high_variability: 1.2
  };

  const leadTimeFactor = leadTimeFactors[item.leadTimeDays <= 7 ? 'short' : item.leadTimeDays <= 14 ? 'medium' : 'long'];
  const variabilityFactor = item.variabilityFactor || 1;
  const baseBuffer = (item.adu || 0) * leadTimeFactor * variabilityFactor;

  return {
    red: Math.round(baseBuffer * 0.33),
    yellow: Math.round(baseBuffer * 0.33),
    green: Math.round(baseBuffer * 0.34)
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
