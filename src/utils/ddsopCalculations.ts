
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

// DDS&OP Report interfaces
export interface DDSOPReportData {
  generatedDate: string;
  reportName: string;
  complianceScore: number;
  cycleData: any;
  metrics: any[];
  adjustments: any[];
  steps: any[];
  recommendations: DDSOPRecommendation[];
  strategicAdjustments?: DDSOPStrategicAdjustment[];
}

export interface DDSOPRecommendation {
  id: number;
  area: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
}

// New interface for strategic adjustments
export interface DDSOPStrategicAdjustment {
  id: number;
  bufferType: string;
  currentValue: number;
  recommendedValue: number;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  strategy: string;
}

// Generate DDS&OP Report
export const generateDDSOPReport = async (data: {
  cycleData: any;
  metrics: any[];
  adjustments: any[];
  stepData: any[];
}): Promise<DDSOPReportData> => {
  const { cycleData, metrics, adjustments, stepData } = data;
  
  // Calculate overall compliance score from metrics
  const complianceScore = metrics.reduce((sum, metric) => {
    return sum + (metric.value / metric.target) * 100;
  }, 0) / metrics.length;
  
  // Generate recommendations based on metrics and adjustments
  const recommendations: DDSOPRecommendation[] = [];
  
  // Add recommendations based on metrics that are below target
  metrics.forEach((metric, index) => {
    if (metric.value < metric.target) {
      recommendations.push({
        id: index + 1,
        area: metric.name,
        description: `Improve ${metric.name} metrics which are currently at ${metric.value}% versus target of ${metric.target}%`,
        impact: metric.value < metric.target * 0.8 ? 'high' : 'medium',
        timeframe: 'Next cycle'
      });
    }
  });
  
  // Add recommendations for non-aligned adjustments
  adjustments.forEach((adjustment, index) => {
    if (!adjustment.alignedWithDDSOP) {
      recommendations.push({
        id: recommendations.length + 1,
        area: 'Strategic Alignment',
        description: `Align adjustment "${adjustment.description}" with DDS&OP principles`,
        impact: adjustment.impact as 'high' | 'medium' | 'low',
        timeframe: 'Current cycle'
      });
    }
  });
  
  // Add missing step recommendations
  const pendingSteps = stepData.filter(step => step.status === 'pending');
  if (pendingSteps.length > 0) {
    recommendations.push({
      id: recommendations.length + 1,
      area: 'Process Compliance',
      description: `Complete ${pendingSteps.length} pending DDS&OP process steps`,
      impact: 'high',
      timeframe: 'Immediate'
    });
  }

  // Generate strategic buffer adjustments (new addition)
  const strategicAdjustments = generateStrategicBufferAdjustments(metrics, adjustments);
  
  return {
    generatedDate: new Date().toISOString(),
    reportName: `DDS&OP Compliance Report - ${new Date().toLocaleDateString()}`,
    complianceScore: Math.round(complianceScore * 100) / 100,
    cycleData,
    metrics,
    adjustments,
    steps: stepData,
    recommendations,
    strategicAdjustments
  };
};

// New function to generate strategic buffer adjustments based on DDS&OP principles
export const generateStrategicBufferAdjustments = (
  metrics: any[],
  adjustments: any[]
): DDSOPStrategicAdjustment[] => {
  const strategicAdjustments: DDSOPStrategicAdjustment[] = [];
  
  // Example strategic buffer adjustments based on metrics
  const bufferComplianceMetric = metrics.find(m => m.name === 'Buffer Alignment');
  
  if (bufferComplianceMetric && bufferComplianceMetric.value < bufferComplianceMetric.target) {
    // Recommend buffer adjustment for low compliance
    strategicAdjustments.push({
      id: 1,
      bufferType: 'Safety Stock',
      currentValue: 10,
      recommendedValue: 15,
      reason: 'Buffer compliance below target threshold',
      impact: 'high',
      strategy: 'Increase safety buffer to improve overall buffer alignment'
    });
  }
  
  // Recommend adjustments for seasonal patterns
  strategicAdjustments.push({
    id: 2,
    bufferType: 'Seasonal Variability Factor',
    currentValue: 1.0,
    recommendedValue: 1.2,
    reason: 'Upcoming high-demand season',
    impact: 'medium',
    strategy: 'Temporarily increase variability factor for seasonal products'
  });
  
  // Recommend lead time adjustment if there are delays
  const supplyMetric = metrics.find(m => m.name === 'Supply-Demand Balance');
  if (supplyMetric && supplyMetric.value < supplyMetric.target) {
    strategicAdjustments.push({
      id: 3,
      bufferType: 'Lead Time Factor',
      currentValue: 0.8,
      recommendedValue: 1.0,
      reason: 'Recent supply delays affecting buffer positioning',
      impact: 'medium',
      strategy: 'Adjust lead time factors to account for recent supplier delays'
    });
  }
  
  // Bi-directional adjustment - strategic to tactical
  const hasStrategicAdjustment = adjustments.some(a => 
    a.description.includes('strategic') && a.alignedWithDDSOP
  );
  
  if (hasStrategicAdjustment) {
    strategicAdjustments.push({
      id: 4,
      bufferType: 'Decoupling Point Placement',
      currentValue: 2,
      recommendedValue: 3,
      reason: 'Strategic business objective change',
      impact: 'high',
      strategy: 'Reposition decoupling points to align with new strategic direction'
    });
  }
  
  return strategicAdjustments;
};

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
  
  const hasProperBufferZones = Boolean(item.redZoneSize && item.yellowZoneSize && item.greenZoneSize);
  const hasNetFlowPosition = typeof item.netFlowPosition === 'number';
  const hasVariabilityFactor = typeof item.variabilityFactor === 'number';
  const hasStrategicAdjustments = Boolean(item.dynamicAdjustments && 
    (item.dynamicAdjustments.seasonality || 
     item.dynamicAdjustments.trend || 
     item.dynamicAdjustments.marketStrategy));
  
  return hasProperBufferZones && 
         hasNetFlowPosition && 
         hasVariabilityFactor &&
         hasStrategicAdjustments;
};

// Evaluate if an item needs strategic buffer adjustment
export const evaluateStrategicBufferAdjustment = (
  item: InventoryItem, 
  marketTrends: any[],
  businessObjectives: any[]
): { needsAdjustment: boolean; recommendations: string[] } => {
  const recommendations: string[] = [];
  let needsAdjustment = false;
  
  // Check for seasonality trends
  const hasSeasonal = marketTrends.some(trend => 
    trend.type === 'seasonal' && 
    trend.affectedSkus.includes(item.sku)
  );
  
  if (hasSeasonal && (!item.dynamicAdjustments || !item.dynamicAdjustments.seasonality)) {
    needsAdjustment = true;
    recommendations.push('Apply seasonal adjustment to buffer profile');
  }
  
  // Check for strategic business objectives alignment
  const relatedObjectives = businessObjectives.filter(obj => 
    obj.affectedCategories.includes(item.category) ||
    obj.affectedRegions.includes(item.region)
  );
  
  if (relatedObjectives.length > 0 && (!item.dynamicAdjustments || !item.dynamicAdjustments.marketStrategy)) {
    needsAdjustment = true;
    recommendations.push('Align buffer with strategic business objectives');
  }
  
  // Check buffer health
  if (item.bufferHealthAssessment && item.bufferHealthAssessment < 70) {
    needsAdjustment = true;
    recommendations.push('Recalibrate buffer zones due to low buffer health');
  }
  
  return { needsAdjustment, recommendations };
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
