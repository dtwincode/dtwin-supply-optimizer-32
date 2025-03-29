
export interface BufferZones {
  red: number;
  yellow: number;
  green: number;
}

export interface BufferProfile {
  id: string;
  name: string;
  description?: string;
  variabilityFactor: number;
  leadTimeFactor: number;
  moq?: number;
  lotSizeFactor?: number;
}

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
  industry?: string;
  isBenchmarkBased?: boolean;
  metadata?: Record<string, any>;
}
