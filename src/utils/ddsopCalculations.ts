
import { InventoryItem, BufferZones, NetFlowPosition } from "@/types/inventory";
import { calculateBufferZones, calculateNetFlowPosition } from "./bufferCalculations";

export interface DDSOPMetrics {
  projectComplianceScore: number;
  demandReviewScore: number;
  supplyReviewScore: number;
  integrationScore: number;
  managementReviewScore: number;
  financialAlignmentScore: number;
  strategicAlignmentScore: number;
  tacticalExecutionScore: number;
  bufferComplianceScore: number;
}

export interface DDSOPCycleStatus {
  isActive: boolean;
  currentPhase: 'demand' | 'supply' | 'integration' | 'management' | 'none';
  nextMilestone: Date;
  lastCompletedDate: Date;
  cycleCompletionPercentage: number;
}

// Calculate overall DDS&OP compliance score
export const calculateDDSOPComplianceScore = (metrics: DDSOPMetrics): number => {
  const { 
    demandReviewScore,
    supplyReviewScore,
    integrationScore,
    managementReviewScore,
    financialAlignmentScore,
    strategicAlignmentScore,
    tacticalExecutionScore,
    bufferComplianceScore
  } = metrics;

  // Weighted calculation for overall compliance
  return (
    demandReviewScore * 0.15 +
    supplyReviewScore * 0.15 +
    integrationScore * 0.15 +
    managementReviewScore * 0.10 +
    financialAlignmentScore * 0.15 +
    strategicAlignmentScore * 0.10 +
    tacticalExecutionScore * 0.10 +
    bufferComplianceScore * 0.10
  );
};

// Calculate buffer compliance score for DDS&OP
export const calculateBufferComplianceScore = async (
  inventoryItems: InventoryItem[]
): Promise<number> => {
  if (inventoryItems.length === 0) return 0;
  
  let totalScore = 0;
  
  for (const item of inventoryItems) {
    const bufferZones = await calculateBufferZones(item);
    const netFlowPosition = calculateNetFlowPosition(item);
    
    // Calculate individual item compliance based on proper buffer management
    const itemScore = calculateItemBufferCompliance(bufferZones, netFlowPosition);
    totalScore += itemScore;
  }
  
  return totalScore / inventoryItems.length;
};

// Calculate individual item buffer compliance
const calculateItemBufferCompliance = (
  bufferZones: BufferZones,
  netFlowPosition: NetFlowPosition
): number => {
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  if (totalBuffer === 0) return 0;
  
  const idealPosition = bufferZones.red + (bufferZones.yellow * 0.5);
  const currentPosition = netFlowPosition.netFlowPosition;
  
  // Calculate deviation from ideal position (as percentage of total buffer)
  const deviation = Math.abs(currentPosition - idealPosition) / totalBuffer;
  
  // Convert to compliance score (100% minus deviation percentage, with minimum of 0)
  return Math.max(0, 100 - (deviation * 100));
};

// Calculate financial alignment score
export const calculateFinancialAlignmentScore = (
  projectedInventoryValue: number,
  targetInventoryValue: number,
  projectedServiceLevel: number,
  targetServiceLevel: number
): number => {
  // Calculate inventory value alignment (0-100)
  const inventoryDeviation = Math.abs(projectedInventoryValue - targetInventoryValue) / targetInventoryValue;
  const inventoryScore = Math.max(0, 100 - (inventoryDeviation * 100));
  
  // Calculate service level alignment (0-100)
  const serviceDeviation = Math.max(0, targetServiceLevel - projectedServiceLevel) / targetServiceLevel;
  const serviceScore = Math.max(0, 100 - (serviceDeviation * 100));
  
  // Weighted combination (inventory efficiency vs. service level)
  return (inventoryScore * 0.6) + (serviceScore * 0.4);
};

// Calculate strategic alignment score
export const calculateStrategicAlignmentScore = (
  tacticalBufferAdjustments: any[],
  strategicBusinessObjectives: any[]
): number => {
  if (strategicBusinessObjectives.length === 0) return 0;
  
  let alignedObjectives = 0;
  
  for (const objective of strategicBusinessObjectives) {
    // Check if there are buffer adjustments supporting this objective
    const hasAlignedAdjustments = tacticalBufferAdjustments.some(
      adjustment => adjustment.objectiveId === objective.id
    );
    
    if (hasAlignedAdjustments) {
      alignedObjectives++;
    }
  }
  
  return (alignedObjectives / strategicBusinessObjectives.length) * 100;
};

// Check if inventory item is DDS&OP compliant
export const isItemDDSOPCompliant = async (item: InventoryItem): Promise<boolean> => {
  // An item is considered DDS&OP compliant if:
  // 1. It has proper buffer zones defined
  // 2. It has net flow position properly calculated
  // 3. It has proper variability factor assigned
  // 4. Strategic adjustments are applied when necessary
  
  const hasProperBufferZones = item.redZoneSize && item.yellowZoneSize && item.greenZoneSize;
  const hasNetFlowPosition = typeof item.netFlowPosition === 'number';
  const hasVariabilityFactor = typeof item.variabilityFactor === 'number';
  const hasStrategicAdjustments = item.dynamicAdjustments && 
    (item.dynamicAdjustments.seasonality || 
     item.dynamicAdjustments.trend || 
     item.dynamicAdjustments.marketStrategy);
  
  return hasProperBufferZones && 
         hasNetFlowPosition && 
         hasVariabilityFactor &&
         hasStrategicAdjustments;
};

// Get DDS&OP cycle status
export const getDDSOPCycleStatus = (
  today: Date,
  cycleStartDate: Date, 
  cycleDurationDays: number
): DDSOPCycleStatus => {
  const cycleEndDate = new Date(cycleStartDate);
  cycleEndDate.setDate(cycleEndDate.getDate() + cycleDurationDays);
  
  const isActive = today >= cycleStartDate && today <= cycleEndDate;
  
  // Calculate cycle progress percentage
  const totalDuration = cycleDurationDays * 24 * 60 * 60 * 1000; // in milliseconds
  const elapsed = today.getTime() - cycleStartDate.getTime();
  const cycleCompletionPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  
  // Determine current phase (simplified example)
  let currentPhase: 'demand' | 'supply' | 'integration' | 'management' | 'none' = 'none';
  
  if (isActive) {
    if (cycleCompletionPercentage < 25) {
      currentPhase = 'demand';
    } else if (cycleCompletionPercentage < 50) {
      currentPhase = 'supply';
    } else if (cycleCompletionPercentage < 75) {
      currentPhase = 'integration';
    } else {
      currentPhase = 'management';
    }
  }
  
  // Calculate next milestone date
  const nextMilestone = new Date(cycleStartDate);
  if (currentPhase === 'demand') {
    nextMilestone.setDate(cycleStartDate.getDate() + Math.floor(cycleDurationDays * 0.25));
  } else if (currentPhase === 'supply') {
    nextMilestone.setDate(cycleStartDate.getDate() + Math.floor(cycleDurationDays * 0.5));
  } else if (currentPhase === 'integration') {
    nextMilestone.setDate(cycleStartDate.getDate() + Math.floor(cycleDurationDays * 0.75));
  } else {
    nextMilestone.setDate(cycleStartDate.getDate() + cycleDurationDays);
  }
  
  // Set last completed date (simplified)
  const lastCompletedDate = new Date(cycleStartDate);
  lastCompletedDate.setMonth(lastCompletedDate.getMonth() - 1);
  
  return {
    isActive,
    currentPhase,
    nextMilestone,
    lastCompletedDate,
    cycleCompletionPercentage
  };
};

// DDS&OP formulas reference
export const ddsopFormulas = {
  complianceScore: "Compliance Score = Weighted Sum of Process Component Scores",
  bufferCompliance: "Buffer Compliance = 100 - (|Current Position - Ideal Position| / Total Buffer × 100)",
  financialAlignment: "Financial Alignment = (Inventory Score × 0.6) + (Service Level Score × 0.4)",
  strategicAlignment: "Strategic Alignment = (Aligned Objectives / Total Objectives) × 100",
  notes: `
    DDS&OP compliant systems must demonstrate:
    - Bi-directional integration between tactical and strategic processes
    - Properly defined buffer profiles aligned with strategic objectives
    - Regular review cycles with clear phases (demand, supply, integration, management)
    - Financial and operational metric reconciliation
    - Strategic adjustments to tactical buffers when business conditions change
  `
};
