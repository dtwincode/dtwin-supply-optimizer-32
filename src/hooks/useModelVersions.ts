
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type ModelVersion } from '@/types/forecasting';
import { useToast } from '@/components/ui/use-toast';

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
      setVersions(data);
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

  const createVersion = async (versionData: Partial<ModelVersion>) => {
    try {
      const { data, error } = await supabase
        .from('model_versions')
        .insert([versionData])
        .select()
        .single();

      if (error) throw error;
      setVersions(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "New model version created",
      });
      return data;
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

  useEffect(() => {
    if (modelId) {
      fetchVersions();
    }
  }, [modelId]);

  return {
    versions,
    isLoading,
    createVersion,
    refreshVersions: fetchVersions,
  };
};
