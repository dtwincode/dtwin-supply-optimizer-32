
export interface BufferZones {
  red: number;
  yellow: number;
  green: number;
}

export interface NetFlowPosition {
  onHand: number;
  onOrder: number;
  qualifiedDemand: number;
  netFlowPosition: number;
}

export interface BufferProfile {
  id: string;
  name: string;
  description?: string;
  variabilityFactor: 'high_variability' | 'medium_variability' | 'low_variability';
  leadTimeFactor: 'short' | 'medium' | 'long';
  moq?: number;
  lotSizeFactor?: number;
}

export type IndustryType = 'manufacturing' | 'retail' | 'distribution' | 'electronics' | 'automotive' | 'consumer_goods' | 'pharmaceuticals';

export interface BufferFactorConfig {
  id: string;
  shortLeadTimeFactor: number;
  mediumLeadTimeFactor: number;
  longLeadTimeFactor: number;
  shortLeadTimeThreshold: number;
  mediumLeadTimeThreshold: number;
  replenishmentTimeFactor: number;
  greenZoneFactor: number;
  description?: string;
  isActive: boolean;
  industry?: IndustryType;
  isBenchmarkBased?: boolean;
  metadata?: Record<string, any>;
}
