
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SKUClassification } from '@/types/inventory';
import { useToast } from './use-toast';

interface UseSkuClassificationsResult {
  classifications: SKUClassification[];
  loading: boolean;
  error: Error | null;
  refreshClassifications: () => Promise<void>;
}

export const useSkuClassifications = (): UseSkuClassificationsResult => {
  const [classifications, setClassifications] = useState<SKUClassification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchClassifications = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('sku_classification')
        .select('*');

      if (fetchError) throw fetchError;

      // Map the response to our SKUClassification type
      const mappedClassifications: SKUClassification[] = data?.map(item => ({
        id: item.id || undefined,
        sku: item.sku,
        lead_time_category: item.lead_time_category || undefined,
        variability_level: item.variability_level || undefined,
        criticality: item.criticality || undefined,
        score: item.score || undefined,
        last_updated: item.last_updated || undefined,
        category: item.category || undefined
      })) || [];

      setClassifications(mappedClassifications);
      setError(null);
    } catch (err) {
      console.error('Error fetching SKU classifications:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast({
        title: 'Error',
        description: 'Failed to load classification data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClassifications();
  }, [fetchClassifications]);

  const refreshClassifications = async () => {
    try {
      await fetchClassifications();
      toast({
        title: 'Success',
        description: 'Classification data refreshed successfully',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to refresh classification data',
        variant: 'destructive',
      });
    }
  };

  return {
    classifications,
    loading,
    error,
    refreshClassifications
  };
};
