
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IntegratedData, ForecastMappingConfig } from "./types";
import { useLocation } from "react-router-dom";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

interface MappingConfigType {
  [key: string]: JsonValue;
}

export function useIntegratedData() {
  const [data, setData] = useState<IntegratedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<ForecastMappingConfig | null>(null);
  const [savedMappings, setSavedMappings] = useState<ForecastMappingConfig[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'needs_review' | null>(null);
  const [hasIntegrated, setHasIntegrated] = useState(false);
  
  const location = useLocation();

  const fetchSavedMappings = useCallback(async () => {
    try {
      const { data: mappings, error } = await supabase
        .from('forecast_integration_mappings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSavedMappings(mappings || []);
    } catch (error: any) {
      console.error('Error fetching mappings:', error);
      toast({
        title: "Error",
        description: "Failed to load saved mappings",
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    if (mappingDialogOpen) {
      fetchSavedMappings();
    }
  }, [mappingDialogOpen, fetchSavedMappings]);

  const handleDeleteMapping = useCallback(async () => {
    if (!selectedMapping?.id) {
      toast({
        title: "Error",
        description: "No mapping configuration selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forecast_integration_mappings')
        .delete()
        .eq('id', selectedMapping.id);

      if (error) throw error;

      setSavedMappings(current => current.filter(m => m.id !== selectedMapping.id));
      setSelectedMapping(null);
      toast({
        title: "Success",
        description: "Mapping configuration deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting mapping:', error);
      toast({
        title: "Error",
        description: "Failed to delete mapping configuration",
        variant: "destructive",
      });
    }
  }, [selectedMapping]);

  const handleSaveMapping = useCallback((mapping: ForecastMappingConfig) => {
    setSelectedMapping(mapping);
  }, []);

  const checkRequiredFiles = useCallback(async () => {
    try {
      const { data: historicalFiles, error: historicalError } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'historical_sales')
        .order('created_at', { ascending: false })
        .limit(1);

      if (historicalError) throw historicalError;
      if (!historicalFiles?.length) {
        throw new Error('Please upload historical sales data before running integration');
      }

      return true;
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  }, []);

  const handleIntegration = useCallback(async () => {
    if (!selectedMapping) {
      setMappingDialogOpen(true);
      return;
    }

    if (isIntegrating) return;
    
    setIsIntegrating(true);
    setError(null);
    
    try {
      await checkRequiredFiles();
      
      const mappingConfig: MappingConfigType = {
        use_product_mapping: selectedMapping.use_product_mapping,
        use_location_mapping: selectedMapping.use_location_mapping,
        product_key_column: selectedMapping.product_key_column || null,
        location_key_column: selectedMapping.location_key_column || null,
        historical_product_key_column: selectedMapping.historical_product_key_column || null,
        historical_location_key_column: selectedMapping.historical_location_key_column || null,
        id: selectedMapping.id
      };

      const { data, error } = await supabase.rpc('integrate_forecast_data', {
        p_mapping_config: mappingConfig
      });
      
      if (error) {
        console.error('Integration error:', error);
        throw error;
      }
      
      setHasIntegrated(true);
      toast({
        title: "Success",
        description: "Data integrated successfully.",
      });
      
      await fetchData();
    } catch (error: any) {
      console.error('Integration error:', error);
      const errorMessage = error.message || "Failed to integrate data. Please make sure all required data is uploaded.";
      setError(errorMessage);
      toast({
        title: "Integration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setHasIntegrated(false);
    } finally {
      setIsIntegrating(false);
    }
  }, [selectedMapping, isIntegrating, checkRequiredFiles, fetchData]);

  const fetchData = useCallback(async () => {
    if (isLoading || !hasIntegrated) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const { data: integratedData, error } = await supabase
        .from('integrated_forecast_data')
        .select('*, metadata, source_files')
        .order('date', { ascending: true });

      if (error) throw error;

      if (!integratedData || integratedData.length === 0) {
        setData([]);
        return;
      }

      const transformedData: IntegratedData[] = integratedData.map(item => {
        const parsedMetadata = typeof item.metadata === 'object' && item.metadata !== null
          ? item.metadata as Record<string, any>
          : {};

        const parsedSourceFiles = Array.isArray(item.source_files) 
          ? item.source_files 
          : (item.source_files ? JSON.parse(item.source_files as string) : []);

        setValidationStatus(item.validation_status as 'valid' | 'needs_review' | null);

        return {
          id: item.id,
          date: item.date,
          actual_value: item.actual_value,
          sku: item.sku,
          created_at: item.created_at,
          updated_at: item.updated_at,
          validation_status: item.validation_status,
          source_files: parsedSourceFiles,
          metadata: parsedMetadata,
          ...parsedMetadata
        };
      });

      setData(transformedData);
    } catch (error: any) {
      console.error('Error fetching integrated data:', error);
      setError('Failed to fetch integrated data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to fetch integrated data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasIntegrated]);

  return {
    data,
    isLoading,
    isIntegrating,
    mappingDialogOpen,
    setMappingDialogOpen,
    selectedMapping,
    setSelectedMapping,
    savedMappings,
    validationStatus,
    error,
    hasIntegrated,
    fetchData,
    handleIntegration,
    handleSaveMapping,
    handleDeleteMapping,
    fetchSavedMappings
  };
}
