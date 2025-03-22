
// Centralized data store for DDSOP metrics to avoid duplication

// Cycle metrics used in multiple components
export const cycleMetrics = [
  {
    id: 'cycle-adherence',
    name: 'tacticalCycleAdherence',
    value: 92,
    target: 95,
    status: 'on-track',
    trend: 'improving'
  },
  {
    id: 'response-time',
    name: 'marketResponseTime',
    value: 3.5,
    unit: 'days',
    target: '< 5',
    status: 'on-track',
    trend: 'stable'
  },
  {
    id: 'signal-detection',
    name: 'signalDetectionRate',
    value: 87,
    target: 90,
    status: 'warning',
    trend: 'stable'
  },
  {
    id: 'adjustment-accuracy',
    name: 'adjustmentAccuracy',
    value: 83,
    target: 85,
    status: 'warning',
    trend: 'improving'
  }
];

// Planning cycles data
export const planningCycles = [
  {
    id: 1,
    name: 'Weekly Operational Review',
    frequency: 'Weekly',
    nextDate: '2023-08-10',
    status: 'on-track',
    type: 'operational'
  },
  {
    id: 2,
    name: 'Monthly Tactical Review',
    frequency: 'Monthly',
    nextDate: '2023-08-25',
    status: 'on-track',
    type: 'tactical'
  },
  {
    id: 3,
    name: 'Quarterly Strategic Adjustment',
    frequency: 'Quarterly',
    nextDate: '2023-09-15',
    status: 'upcoming',
    type: 'strategic'
  },
  {
    id: 4,
    name: 'Market Disruption Response',
    frequency: 'As Needed',
    nextDate: 'On Demand',
    status: 'standby',
    type: 'adaptive'
  }
];

// Market signals data
export const marketSignals = [
  {
    id: 1,
    name: 'Supplier Lead Time Increase',
    impact: 'high',
    detectedDate: '2023-08-01',
    status: 'pending-action',
    category: 'supply'
  },
  {
    id: 2,
    name: 'Regional Demand Spike',
    impact: 'medium',
    detectedDate: '2023-07-28',
    status: 'in-assessment',
    category: 'demand'
  },
  {
    id: 3,
    name: 'Competitor Pricing Change',
    impact: 'low',
    detectedDate: '2023-07-25',
    status: 'monitored',
    category: 'market'
  }
];

// Execution metrics data
export const executionItems = [
  { 
    id: 1, 
    name: 'Buffer Penetration Response', 
    status: 'on-track', 
    metric: '95%',
    target: '90%',
    trend: 'improving'
  },
  { 
    id: 2, 
    name: 'Resource Utilization', 
    status: 'warning', 
    metric: '84%',
    target: '85-95%',
    trend: 'stable'
  },
  { 
    id: 3, 
    name: 'Tactical Cycle Adherence', 
    status: 'on-track', 
    metric: '92%',
    target: '90%',
    trend: 'improving'
  },
  { 
    id: 4, 
    name: 'Demand Signal Quality', 
    status: 'alert', 
    metric: '78%',
    target: '85%',
    trend: 'declining'
  },
  { 
    id: 5, 
    name: 'Strategic Decoupling Effectiveness', 
    status: 'on-track', 
    metric: '89%',
    target: '80%',
    trend: 'stable'
  }
];

// Dashboard metrics
export const ddomMetrics = [
  { 
    id: 'flow-index', 
    name: 'flowIndex', 
    value: 86, 
    target: 90, 
    status: 'warning'
  },
  { 
    id: 'tactical-cycle', 
    name: 'tacticalCycleAdherence', 
    value: 92, 
    target: 90, 
    status: 'success'
  },
  { 
    id: 'demand-signal', 
    name: 'demandSignalQuality', 
    value: 78, 
    target: 85, 
    status: 'danger'
  },
  { 
    id: 'execution-variance', 
    name: 'executionVariance', 
    value: 88, 
    target: 85, 
    status: 'success'
  },
  { 
    id: 'adaptive-response', 
    name: 'adaptiveResponseTime', 
    value: 4.2, 
    unit: 'hours', 
    target: "< 5.0",
    status: 'success'
  }
];
