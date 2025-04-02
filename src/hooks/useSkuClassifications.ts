
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from './use-toast';
import type { Classification, SKUClassification } from '@/types/inventory';

export const useSkuClassifications = () => {
  const [classifications, setClassifications] = useState<SKUClassification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClassifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('product_classification')
        .select('*');

      if (error) {
        throw error;
      }

      const formattedData: SKUClassification[] = data.map(item => ({
        product_id: item.product_id,
        location_id: item.location_id,
        classification: {
          leadTimeCategory: item.lead_time_category as any,
          variabilityLevel: item.variability_level as any,
          criticality: item.criticality as any,
          score: item.score || 0
        },
        lastUpdated: item.created_at
      }));

      setClassifications(formattedData);
    } catch (err: any) {
      console.error('Error fetching classifications:', err);
      setError(err.message || 'Failed to fetch classifications');
      toast({
        title: 'Error',
        description: 'Failed to load classification data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassifications();
  }, []);

  const updateClassification = async (
    product_id: string,
    location_id: string,
    classification: Classification
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('product_classification')
        .upsert({
          product_id,
          location_id,
          lead_time_category: classification.leadTimeCategory,
          variability_level: classification.variabilityLevel,
          criticality: classification.criticality,
          score: classification.score
        });

      if (error) {
        throw error;
      }

      await fetchClassifications();
      toast({
        title: 'Success',
        description: 'Classification updated successfully'
      });
      return true;
    } catch (err: any) {
      console.error('Error updating classification:', err);
      toast({
        title: 'Error',
        description: `Failed to update classification: ${err.message}`,
        variant: 'destructive'
      });
      return false;
    }
  };

  return {
    classifications,
    loading,
    error,
    fetchClassifications,
    updateClassification
  };
};
