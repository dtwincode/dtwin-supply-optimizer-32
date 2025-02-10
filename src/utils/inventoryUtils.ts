
import { InventoryItem } from "@/types/inventory";

export const calculateBufferSize = (item: InventoryItem) => {
  const leadTimeFactor = item.leadTime === "5 days" ? 1 : item.leadTime === "7 days" ? 1.4 : 0.8;
  const variabilityFactor = item.decouplingPoint.variabilityFactor === "High demand variability" ? 1.5 : 1;
  const baseBuffer = item.netFlow.avgDailyUsage * leadTimeFactor * variabilityFactor;
  return {
    red: Math.round(baseBuffer * 0.33),
    yellow: Math.round(baseBuffer * 0.33),
    green: Math.round(baseBuffer * 0.34)
  };
};

export const calculateBufferStatus = (netFlow: InventoryItem["netFlow"]) => {
  const totalBuffer = netFlow.redZone + netFlow.yellowZone + netFlow.greenZone;
  const currentPosition = netFlow.netFlowPosition;
  
  if (currentPosition >= netFlow.greenZone) return "green";
  if (currentPosition >= netFlow.yellowZone) return "yellow";
  return "red";
};
