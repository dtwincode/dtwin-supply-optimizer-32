
// Define metric types for enhanced type safety
export interface CycleMetric {
  id: string;
  name: string;
  value: number;
  target: string;
  trend: 'improving' | 'stable' | 'declining';
  unit?: string;
  status: string; // Added status property needed by AdaptivePlanning component
}

// Export metrics for DDSOP dashboard
export const cycleMetrics: CycleMetric[] = [
  {
    id: 'cycle-adherence',
    name: 'tacticalCycleAdherence',
    value: 92,
    target: '90%',
    trend: 'improving',
    status: 'on-track'
  },
  {
    id: 'response-time',
    name: 'adaptiveResponseTime',
    value: 24,
    unit: 'hours',
    target: '36',
    trend: 'improving',
    status: 'on-track'
  },
  {
    id: 'signal-detection',
    name: 'signalDetectionRate',
    value: 85,
    target: '80%',
    trend: 'stable',
    status: 'on-track'
  },
  {
    id: 'adjustment-accuracy',
    name: 'adjustmentAccuracy',
    value: 78,
    target: '85%',
    trend: 'declining',
    status: 'warning'
  }
];

// Add interface for execution metrics
export interface ExecutionMetric {
  id: string;
  name: string;
  value: number;
  target: number | string;
  status: string;
  trend: string;
  recommendation: string;
}

// Export execution metrics
export const executionMetrics: ExecutionMetric[] = [
  {
    id: 'flow-index',
    name: 'flowIndexMetric',
    value: 0.87,
    target: 0.85,
    status: 'success',
    trend: 'improving',
    recommendation: 'maintainCurrentApproach'
  },
  {
    id: 'execution-variance',
    name: 'executionVarianceMetric',
    value: 12.4,
    target: 10.0,
    status: 'warning',
    trend: 'stable',
    recommendation: 'preventiveActionRecommended'
  },
  {
    id: 'demand-signal',
    name: 'demandSignalQualityMetric',
    value: 0.79,
    target: 0.80,
    status: 'warning',
    trend: 'declining',
    recommendation: 'immediateActionNeeded'
  }
];

export const varianceData = {
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  planned: [120, 140, 150, 135, 160, 170],
  actual: [125, 135, 155, 140, 150, 165],
  variance: [5, -5, 5, 5, -10, -5]
};

// Add DDOM operational metrics
export const ddomMetrics = [
  {
    id: 'flow-index',
    name: 'Flow Index',
    value: 87,
    target: '85%',
    status: 'success'
  },
  {
    id: 'cycle-time',
    name: 'Cycle Time',
    value: 8.4,
    unit: 'days',
    target: '10',
    status: 'success'
  },
  {
    id: 'signal-quality',
    name: 'Signal Quality',
    value: 79,
    target: '80%',
    status: 'warning'
  },
  {
    id: 'execution-accuracy',
    name: 'Execution Accuracy',
    value: 93,
    target: '90%',
    status: 'success'
  },
  {
    id: 'response-time',
    name: 'Response Time',
    value: 1.2,
    unit: 'days',
    target: '1.0',
    status: 'warning'
  }
];

// Add execution items for ExecutionMetrics component
export const executionItems = [
  {
    id: 1,
    name: 'Flow Index',
    status: 'on-track',
    metric: '87%',
    target: '85%',
    trend: 'improving'
  },
  {
    id: 2,
    name: 'Execution Variance',
    status: 'warning',
    metric: '12.4%',
    target: '10.0%',
    trend: 'stable'
  },
  {
    id: 3,
    name: 'Demand Signal Quality',
    status: 'alert',
    metric: '79%',
    target: '80%',
    trend: 'declining'
  },
  {
    id: 4,
    name: 'Response Time',
    status: 'on-track',
    metric: '1.2 days',
    target: '1.5 days',
    trend: 'improving'
  }
];

// Add planning cycles for AdaptivePlanning component
export const planningCycles = [
  {
    id: 'tactical',
    name: 'Tactical Cycle',
    status: 'on-track',
    frequency: 'Monthly',
    nextDate: '2023-07-15',
    type: 'standard'
  },
  {
    id: 'operational',
    name: 'Operational Cycle',
    status: 'upcoming',
    frequency: 'Weekly',
    nextDate: '2023-06-30',
    type: 'standard'
  },
  {
    id: 'emergency',
    name: 'Emergency Cycle',
    status: 'standby',
    frequency: 'As Needed',
    nextDate: 'N/A',
    type: 'adaptive'
  }
];

// Add market signals for AdaptivePlanning component
export const marketSignals = [
  {
    id: 'demand-spike',
    name: 'Demand Spike in Region A',
    impact: 'high',
    category: 'Demand',
    status: 'in-assessment',
    detectedDate: '2023-06-20'
  },
  {
    id: 'supply-disruption',
    name: 'Supplier B Delivery Delays',
    impact: 'medium',
    category: 'Supply',
    status: 'monitored',
    detectedDate: '2023-06-18'
  },
  {
    id: 'price-change',
    name: 'Raw Material Price Increase',
    impact: 'medium',
    category: 'Market',
    status: 'pending-action',
    detectedDate: '2023-06-15'
  },
  {
    id: 'competitor-action',
    name: 'Competitor Promotion Launch',
    impact: 'low',
    category: 'Competition',
    status: 'monitored',
    detectedDate: '2023-06-12'
  }
];
