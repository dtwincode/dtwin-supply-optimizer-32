
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IntegratedData, ForecastMappingConfig } from "./types";
import { useLocation } from "react-router-dom";

interface MappingConfigType {
  product_mapping: boolean;
  location_mapping: boolean;
  product_key: string | undefined;
  location_key: string | undefined;
  historical_product_key: string | undefined;
  historical_location_key: string | undefined;
  mapping_id: string;
}

export function useIntegratedData() {
  const [data, setData] = useState<IntegratedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [mappingDialogOpen, setMappingDialogOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<ForecastMappingConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationStatus, setValidationStatus] = useState<'valid' | 'needs_review' | null>(null);
  const [hasIntegrated, setHasIntegrated] = useState(false);
  
  const location = useLocation();

  const fetchData = useCallback(async () => {
    if (isLoading || !hasIntegrated) {
      setData([]);
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

        const baseData = {
          id: item.id,
          date: item.date,
          actual_value: item.actual_value,
          sku: item.sku,
          created_at: item.created_at,
          updated_at: item.updated_at,
          validation_status: item.validation_status,
          source_files: parsedSourceFiles,
          metadata: parsedMetadata
        };

        const flattenedMetadata = Object.entries(parsedMetadata).reduce((acc, [key, value]) => {
          if (value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {} as Record<string, any>);

        return {
          ...baseData,
          ...flattenedMetadata
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
  }, [hasIntegrated, isLoading]);

  const checkRequiredFiles = async () => {
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
  };

  const handleIntegration = async () => {
    if (!selectedMapping) {
      setMappingDialogOpen(true);
      return;
    }

    if (isIntegrating) return;
    
    setIsIntegrating(true);
    setError(null);
    
    try {
      await checkRequiredFiles();
      
      // Create the mapping configuration object with proper typing
      const mappingConfig: MappingConfigType = {
        product_mapping: selectedMapping.use_product_mapping,
        location_mapping: selectedMapping.use_location_mapping,
        product_key: selectedMapping.product_key_column,
        location_key: selectedMapping.location_key_column,
        historical_product_key: selectedMapping.historical_product_key_column,
        historical_location_key: selectedMapping.historical_location_key_column,
        mapping_id: selectedMapping.id
      };

      type IntegrateForecastParams = {
        p_mapping_config: MappingConfigType;
      };

      // Call the RPC function with proper typing
      const { data, error } = await supabase.rpc<string, IntegrateForecastParams>(
        'integrate_forecast_data',
        { p_mapping_config: mappingConfig }
      );
      
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
  };

  const handleSaveMapping = (mapping: ForecastMappingConfig) => {
    setSelectedMapping(mapping);
    handleIntegration();
  };

  useEffect(() => {
    if (!hasIntegrated) {
      setData([]);
      return;
    }
    
    fetchData();
  }, [fetchData, hasIntegrated]);

  return {
    data,
    isLoading,
    isIntegrating,
    mappingDialogOpen,
    setMappingDialogOpen,
    selectedMapping,
    setSelectedMapping,
    validationStatus,
    error,
    hasIntegrated,
    fetchData,
    handleIntegration,
    handleSaveMapping
  };
}
