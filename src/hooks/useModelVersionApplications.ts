
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ModelVersionApplication {
  id: string;
  model_version_id: string;
  location_id: string;
  product_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  performance_metrics: {
    mape: number | null;
    mae: number | null;
    rmse: number | null;
    last_evaluation_date: string | null;
  };
}

interface UseModelVersionApplicationsProps {
  modelVersionId?: string;
}

export const useModelVersionApplications = ({ modelVersionId }: UseModelVersionApplicationsProps) => {
  const [applications, setApplications] = useState<ModelVersionApplication[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchApplications = async () => {
    if (!modelVersionId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('model_version_applications')
        .select(`
          *,
          location_hierarchy(display_name, location_type),
          product_hierarchy(name)
        `)
        .eq('model_version_id', modelVersionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching model version applications:', error);
      toast({
        title: "Error",
        description: "Failed to fetch model version applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createApplication = async (application: Omit<ModelVersionApplication, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('model_version_applications')
        .insert(application)
        .select()
        .single();

      if (error) throw error;

      setApplications(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Model version application created",
      });
      return data;
    } catch (error) {
      console.error('Error creating model version application:', error);
      toast({
        title: "Error",
        description: "Failed to create model version application",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateApplication = async (id: string, updates: Partial<ModelVersionApplication>) => {
    try {
      const { data, error } = await supabase
        .from('model_version_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setApplications(prev => prev.map(app => app.id === id ? data : app));
      toast({
        title: "Success",
        description: "Model version application updated",
      });
      return data;
    } catch (error) {
      console.error('Error updating model version application:', error);
      toast({
        title: "Error",
        description: "Failed to update model version application",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteApplication = async (id: string) => {
    try {
      const { error } = await supabase
        .from('model_version_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApplications(prev => prev.filter(app => app.id !== id));
      toast({
        title: "Success",
        description: "Model version application deleted",
      });
    } catch (error) {
      console.error('Error deleting model version application:', error);
      toast({
        title: "Error",
        description: "Failed to delete model version application",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (modelVersionId) {
      fetchApplications();
    }
  }, [modelVersionId]);

  return {
    applications,
    isLoading,
    createApplication,
    updateApplication,
    deleteApplication,
    refreshApplications: fetchApplications,
  };
};
