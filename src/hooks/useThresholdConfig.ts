
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ThresholdConfig {
  id: number;
  demand_variability_threshold: number;
  decoupling_threshold: number;
  first_time_adjusted: boolean;
  updated_at: string;
}

export const useThresholdConfig = () => {
  const [config, setConfig] = useState<ThresholdConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchThresholdConfig = async () => {
      try {
        setLoading(true);
        
        // Query the threshold_config table as shown in the schema
        const { data, error } = await supabase
          .from('threshold_config')
          .select('*')
          .order('id', { ascending: false })
          .limit(1);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setConfig(data[0] as ThresholdConfig);
        } else {
          // No config exists yet, we could create a default one
          console.log('No threshold config found');
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching threshold config:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchThresholdConfig();
  }, []);

  const updateThresholdConfig = async (updatedConfig: Partial<ThresholdConfig>) => {
    try {
      setLoading(true);

      if (!config) {
        // Create a new config if none exists
        const { data, error } = await supabase
          .from('threshold_config')
          .insert([{
            demand_variability_threshold: updatedConfig.demand_variability_threshold || 0.6,
            decoupling_threshold: updatedConfig.decoupling_threshold || 0.75,
            first_time_adjusted: true
          }])
          .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
          setConfig(data[0] as ThresholdConfig);
        }
      } else {
        // Update existing config
        const { data, error } = await supabase
          .from('threshold_config')
          .update({
            ...updatedConfig,
            first_time_adjusted: true, // Mark as adjusted
            updated_at: new Date().toISOString()
          })
          .eq('id', config.id)
          .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
          setConfig(data[0] as ThresholdConfig);
        }
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating threshold config:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { config, loading, error, updateThresholdConfig };
};
