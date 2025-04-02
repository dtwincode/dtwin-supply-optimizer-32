
export interface BufferFactorBenchmark {
  id: string;
  industry: string;
  short_lead_time_factor: number;
  medium_lead_time_factor: number;
  long_lead_time_factor: number;
  short_lead_time_threshold: number;
  medium_lead_time_threshold: number;
  replenishment_time_factor: number;
  green_zone_factor: number;
  description?: string;
  is_active: boolean;
  is_benchmark_based: boolean;
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
