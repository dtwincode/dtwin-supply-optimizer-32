
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
        const { data, error } = await supabase
          .from("sku_classification")
          .select("*");

        if (error) throw error;
        setClassifications(data || []);
      } catch (err) {
        console.error("Error fetching SKU classifications:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch SKU classifications'));
      } finally {
        setLoading(false);
      }
    };

    fetchClassifications();
  }, []);

  const refreshClassifications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("sku_classification")
        .select("*");

      if (error) throw error;
      setClassifications(data || []);
      setError(null);
    } catch (err) {
      console.error("Error refreshing SKU classifications:", err);
      setError(err instanceof Error ? err : new Error('Failed to refresh SKU classifications'));
    } finally {
      setLoading(false);
    }
  };

  const updateClassification = async (sku: string, updates: Partial<SKUClassification>) => {
    try {
      const { error } = await supabase
        .from("sku_classification")
        .update(updates)
        .eq('sku', sku);

      if (error) throw error;
      
      // Refresh data after update
      await refreshClassifications();
      return { success: true };
    } catch (err) {
      console.error("Error updating SKU classification:", err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update classification'
      };
    }
  };

  const createClassification = async (classification: Omit<SKUClassification, 'id'>) => {
    try {
      const { error } = await supabase
        .from("sku_classification")
        .insert([classification]);

      if (error) throw error;
      
      // Refresh data after create
      await refreshClassifications();
      return { success: true };
    } catch (err) {
      console.error("Error creating SKU classification:", err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create classification'
      };
    }
  };

  return { 
    classifications, 
    loading, 
    error, 
    refreshClassifications,
    updateClassification,
    createClassification
  };
};
