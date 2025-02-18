
import { supabase } from '@/integrations/supabase/client';

export interface LogisticsMetric {
  id: string;
  metric_type: string;
  metric_value: number;
  dimension: string | null;
  timestamp: string;
  metadata: Record<string, any>;
}

export const getLogisticsMetrics = async (metricType: string) => {
  const { data, error } = await supabase
    .from('logistics_analytics')
    .select('*')
    .eq('metric_type', metricType)
    .order('timestamp', { ascending: false });

  if (error) throw error;
  return data as LogisticsMetric[];
};

export const recordMetric = async (
  metricType: string,
  value: number,
  dimension?: string,
  metadata?: Record<string, any>
) => {
  const { error } = await supabase
    .from('logistics_analytics')
    .insert({
      metric_type: metricType,
      metric_value: value,
      dimension,
      metadata
    });

  if (error) throw error;
};
