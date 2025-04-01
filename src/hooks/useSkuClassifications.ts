
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { SKUClassification } from '@/types/inventory';

export const useSkuClassifications = () => {
  const [classifications, setClassifications] = useState<SKUClassification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        setLoading(true);

        // Fetch from the product_classification table as shown in the schema
        const { data, error } = await supabase
          .from('product_classification')
          .select('*')
          .order('product_id', { ascending: true });

        if (error) throw error;

        // Transform data to match our frontend model
        const transformedData: SKUClassification[] = (data || []).map(item => ({
          id: `${item.product_id}-${item.location_id}`,
          sku: item.product_id,
          product_id: item.product_id,
          location_id: item.location_id,
          category: item.classification_label,
          last_updated: new Date().toISOString(), // Placeholder since last_updated might not be in the table
          classification: {
            leadTimeCategory: item.lead_time_category as 'short' | 'medium' | 'long',
            variabilityLevel: item.variability_level as 'low' | 'medium' | 'high',
            criticality: item.criticality as 'low' | 'medium' | 'high',
            score: item.score
          }
        }));

        setClassifications(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching SKU classifications:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchClassifications();
  }, []);

  const refreshClassifications = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('product_classification')
        .select('*')
        .order('product_id', { ascending: true });

      if (error) throw error;

      const transformedData: SKUClassification[] = (data || []).map(item => ({
        id: `${item.product_id}-${item.location_id}`,
        sku: item.product_id,
        product_id: item.product_id,
        location_id: item.location_id,
        category: item.classification_label,
        last_updated: new Date().toISOString(),
        classification: {
          leadTimeCategory: item.lead_time_category as 'short' | 'medium' | 'long',
          variabilityLevel: item.variability_level as 'low' | 'medium' | 'high',
          criticality: item.criticality as 'low' | 'medium' | 'high',
          score: item.score
        }
      }));

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
