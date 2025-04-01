
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SKUClassification, Classification } from '@/types/inventory';

export const useSkuClassifications = () => {
  const [classifications, setClassifications] = useState<SKUClassification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchClassifications();
  }, []);

  const fetchClassifications = async () => {
    try {
      setLoading(true);

      // Fetch from the product_classification table
      const { data, error } = await supabase
        .from('product_classification')
        .select('*')
        .order('product_id', { ascending: true });

      if (error) throw error;

      // Transform data to match our frontend model
      const transformedData: SKUClassification[] = (data || []).map(item => {
        const classification: Classification = {
          leadTimeCategory: item.lead_time_category,
          variabilityLevel: item.variability_level,
          criticality: item.criticality,
          score: item.score
        };

        return {
          id: `${item.product_id}-${item.location_id}`,
          sku: item.product_id,
          product_id: item.product_id,
          location_id: item.location_id,
          category: item.classification_label,
          last_updated: new Date().toISOString(),
          classification
        };
      });

      setClassifications(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching SKU classifications:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const refreshClassifications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('product_classification')
        .select('*')
        .order('product_id', { ascending: true });

      if (error) throw error;

      const transformedData: SKUClassification[] = (data || []).map(item => {
        const classification: Classification = {
          leadTimeCategory: item.lead_time_category,
          variabilityLevel: item.variability_level,
          criticality: item.criticality,
          score: item.score
        };

        return {
          id: `${item.product_id}-${item.location_id}`,
          sku: item.product_id,
          product_id: item.product_id,
          location_id: item.location_id,
          category: item.classification_label,
          last_updated: new Date().toISOString(),
          classification
        };
      });

      setClassifications(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error refreshing SKU classifications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { classifications, loading, error, refreshClassifications };
};
