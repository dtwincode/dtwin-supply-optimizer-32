
export interface BufferFactorConfig {
  id: string;
  short_lead_time_factor: number;
  medium_lead_time_factor: number;
  long_lead_time_factor: number;
  short_lead_time_threshold: number;
  medium_lead_time_threshold: number;
  replenishment_time_factor: number;
  green_zone_factor: number;
  description?: string;
  is_active: boolean;
  industry?: string;
  is_benchmark_based?: boolean;
  metadata?: Record<string, any>;
}
