
import { InventoryItem, BufferZones, NetFlowPosition } from "@/types/inventory";

export const calculateADU = (dailyDemand: number[], days: number): number => {
  if (days <= 0 || dailyDemand.length === 0) return 0;
  const sum = dailyDemand.reduce((acc, curr) => acc + curr, 0);
  return sum / days;
};

export const calculateBufferZones = (
  adu: number,
  leadTimeDays: number,
  variabilityFactor: number
): BufferZones => {
  const redZone = adu * leadTimeDays * variabilityFactor;
  const yellowZone = adu * leadTimeDays;
  const greenZone = yellowZone * 0.7; // Default top of green factor
  
  return {
    red: Math.round(redZone),
    yellow: Math.round(yellowZone),
    green: Math.round(greenZone)
  };
};

export const calculateNetFlowPosition = (
  onHand: number,
  onOrder: number,
  qualifiedDemand: number
): NetFlowPosition => {
  const netFlow = onHand + onOrder - qualifiedDemand;
  
  return {
    onHand,
    onOrder,
    qualifiedDemand,
    netFlowPosition: netFlow
  };
};

export const calculateBufferStatus = (
  netFlowPosition: number,
  totalBufferSize: number
): number => {
  if (totalBufferSize <= 0) return 0;
  return (netFlowPosition / totalBufferSize) * 100;
};

export const calculateDynamicBuffer = (
  baseBuffer: number,
  seasonality: number,
  trend: number,
  marketStrategy: number
): number => {
  return baseBuffer * seasonality * trend * marketStrategy;
};

export const calculateDecoupledLeadTime = (leadTimes: number[]): number => {
  return leadTimes.reduce((acc, curr) => acc + curr, 0);
};

export const calculateOrderSpikeProtection = (
  adu: number,
  spikeFactor: number
): number => {
  return adu * spikeFactor;
};

export const calculateEOQ = (
  annualDemand: number,
  orderCost: number,
  holdingCost: number
): number => {
  return Math.sqrt((2 * annualDemand * orderCost) / holdingCost);
};

export const calculateDemandVariabilityFactor = (
  demandValues: number[],
  adu: number
): number => {
  if (demandValues.length === 0 || adu === 0) return 0;
  const mean = adu;
  const squaredDiffs = demandValues.map(x => Math.pow(x - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b) / demandValues.length;
  const stdDev = Math.sqrt(variance);
  return stdDev / mean;
};

export const calculateServiceLevel = (
  ordersOnTime: number,
  totalOrders: number
): number => {
  if (totalOrders === 0) return 0;
  return (ordersOnTime / totalOrders) * 100;
};

export const calculateBufferHealthAssessment = (
  adu: number,
  replenishmentLeadTime: number,
  netFlowPosition: number
): number => {
  if (netFlowPosition === 0) return 0;
  return (adu * replenishmentLeadTime) / netFlowPosition;
};

export const calculateInventoryTurns = (
  annualDemand: number,
  averageInventory: number
): number => {
  if (averageInventory === 0) return 0;
  return annualDemand / averageInventory;
};

export const calculateLeadTimeCompressionIndex = (
  originalLeadTime: number,
  decoupledLeadTime: number
): number => {
  if (originalLeadTime === 0) return 0;
  return ((originalLeadTime - decoupledLeadTime) / originalLeadTime) * 100;
};

export const calculateDemandDrivenFillRate = (
  demandMetFromStock: number,
  totalDemand: number
): number => {
  if (totalDemand === 0) return 0;
  return (demandMetFromStock / totalDemand) * 100;
};

export const calculateInventoryCarryingCost = (
  holdingCostRate: number,
  averageInventoryValue: number
): number => {
  return (holdingCostRate * averageInventoryValue) / 100;
};

export const calculateDemandSensingAccuracy = (
  actualDemand: number,
  plannedDemand: number
): number => {
  if (actualDemand === 0) return 0;
  return 1 - Math.abs((actualDemand - plannedDemand) / actualDemand);
};

export const calculateAllDDMRPMetrics = (item: InventoryItem, historicalDemand: number[]): Partial<InventoryItem> => {
  if (!item.adu || !item.leadTimeDays) return {};

  const bufferZones = calculateBufferZones(item.adu, item.leadTimeDays, item.variabilityFactor || 1);
  const netFlow = calculateNetFlowPosition(item.onHand, item.onOrder, item.qualifiedDemand);
  const totalBufferSize = bufferZones.red + bufferZones.yellow + bufferZones.green;

  return {
    ...item,
    redZoneSize: bufferZones.red,
    yellowZoneSize: bufferZones.yellow,
    greenZoneSize: bufferZones.green,
    netFlowPosition: netFlow.netFlowPosition,
    bufferPenetration: calculateBufferStatus(netFlow.netFlowPosition, totalBufferSize),
    demandVariabilityFactor: calculateDemandVariabilityFactor(historicalDemand, item.adu),
    // Additional metrics can be calculated here as needed
  };
};
