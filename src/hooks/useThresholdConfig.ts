
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

  // Function to trigger the Bayesian update using the existing performance_tracking table
  const triggerBayesianUpdate = async () => {
    try {
      setLoading(true);
      
      // Call a stored procedure that will update thresholds based on performance_tracking data
      // Note: We're using update_threshold_bayesian RPC which should be updated to use performance_tracking
      const { error } = await supabase.rpc('update_threshold_bayesian');
      
      if (error) throw error;
      
      // Refetch the updated config
      const { data, error: fetchError } = await supabase
        .from('threshold_config')
        .select('*')
        .order('id', { ascending: false })
        .limit(1);
        
      if (fetchError) throw fetchError;
      
      if (data && data.length > 0) {
        setConfig(data[0] as ThresholdConfig);
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error triggering Bayesian update:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { config, loading, error, updateThresholdConfig, triggerBayesianUpdate };
};
