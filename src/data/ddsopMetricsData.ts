
// Define metric types for enhanced type safety
export interface CycleMetric {
  id: string;
  name: string;
  value: number;
  target: string;
  trend: 'improving' | 'stable' | 'declining';
  unit?: string;
}

// Export metrics for DDSOP dashboard
export const cycleMetrics: CycleMetric[] = [
  {
    id: 'cycle-adherence',
    name: 'tacticalCycleAdherence',
    value: 92,
    target: '90%',
    trend: 'improving'
  },
  {
    id: 'response-time',
    name: 'adaptiveResponseTime',
    value: 24,
    unit: 'hours',
    target: '36',
    trend: 'improving'
  },
  {
    id: 'signal-detection',
    name: 'signalDetectionRate',
    value: 85,
    target: '80%',
    trend: 'stable'
  },
  {
    id: 'adjustment-accuracy',
    name: 'adjustmentAccuracy',
    value: 78,
    target: '85%',
    trend: 'declining'
  }
];

export const executionMetrics = [
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
