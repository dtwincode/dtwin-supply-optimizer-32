
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type ModelVersion } from '@/types/forecasting';
import { useToast } from '@/hooks/use-toast';

interface AccuracyMetrics {
  mape: number;
  mae: number;
  rmse: number;
}

export const useModelVersions = (modelId: string) => {
  const [versions, setVersions] = useState<ModelVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchVersions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('model_versions')
        .select('*')
        .eq('model_name', modelId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert the JSON data to match ModelVersion type
      const typedData: ModelVersion[] = data.map(item => {
        // Parse accuracy_metrics safely
        const rawMetrics = item.accuracy_metrics as { mape?: number; mae?: number; rmse?: number } | null;
        const accuracyMetrics: AccuracyMetrics = {
          mape: rawMetrics?.mape ?? 0,
          mae: rawMetrics?.mae ?? 0,
          rmse: rawMetrics?.rmse ?? 0
        };
        
        return {
          id: item.id,
          model_name: item.model_name,
          version: item.version,
          parameters: item.parameters as Record<string, any> || {},
          metadata: item.metadata as Record<string, any> || {},
          validation_metrics: item.validation_metrics as Record<string, any> || {},
          training_data_snapshot: item.training_data_snapshot as Record<string, any> || {},
          accuracy_metrics: accuracyMetrics,
          is_active: item.is_active,
          created_at: item.created_at,
          updated_at: item.updated_at
        };
      });
      
      setVersions(typedData);
    } catch (error) {
      console.error('Error fetching model versions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch model versions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createVersion = async (versionData: Omit<ModelVersion, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Prepare accuracy metrics for insertion as a plain object
      const accuracyMetricsJson = {
        mape: versionData.accuracy_metrics?.mape ?? 0,
        mae: versionData.accuracy_metrics?.mae ?? 0,
        rmse: versionData.accuracy_metrics?.rmse ?? 0
      };

      const { data, error } = await supabase
        .from('model_versions')
        .insert({
          ...versionData,
          parameters: versionData.parameters || {},
          metadata: versionData.metadata || {},
          validation_metrics: versionData.validation_metrics || {},
          training_data_snapshot: versionData.training_data_snapshot || {},
          accuracy_metrics: accuracyMetricsJson
        })
        .select()
        .single();

      if (error) throw error;

      // Parse the returned data safely
      const rawMetrics = data.accuracy_metrics as { mape?: number; mae?: number; rmse?: number } | null;
      const typedData: ModelVersion = {
        ...data,
        parameters: data.parameters as Record<string, any>,
        metadata: data.metadata as Record<string, any>,
        validation_metrics: data.validation_metrics as Record<string, any>,
        training_data_snapshot: data.training_data_snapshot as Record<string, any>,
        accuracy_metrics: {
          mape: rawMetrics?.mape ?? 0,
          mae: rawMetrics?.mae ?? 0,
          rmse: rawMetrics?.rmse ?? 0
        }
      };

      setVersions(prev => [typedData, ...prev]);
      toast({
        title: "Success",
        description: "New model version created",
      });
      return typedData;
    } catch (error) {
      console.error('Error creating model version:', error);
      toast({
        title: "Error",
        description: "Failed to create model version",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteVersion = async (versionId: string) => {
    try {
      const { error } = await supabase
        .from('model_versions')
        .delete()
        .eq('id', versionId);

      if (error) throw error;

      setVersions(prev => prev.filter(v => v.id !== versionId));
      toast({
        title: "Success",
        description: "Model version deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting model version:', error);
      toast({
        title: "Error",
        description: "Failed to delete model version",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (modelId) {
      fetchVersions();
    }
  }, [modelId]);

  return {
    versions,
    isLoading,
    createVersion,
    deleteVersion,
    refreshVersions: fetchVersions,
  };
};
