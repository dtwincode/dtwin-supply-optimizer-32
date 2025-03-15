
import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IntegratedData, ForecastMappingConfig } from "./types";

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
  
  // Add refs to track fetch operations and prevent concurrent fetches
  const isFetchingRef = useRef(false);
  const isFetchingSavedMappingsRef = useRef(false);

  const fetchData = useCallback(async (showLoading = true) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current || !selectedMapping) {
      if (!selectedMapping) {
        setData([]);
      }
      return;
    }
    
    isFetchingRef.current = true;
    
    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const { data: integratedData, error } = await supabase
        .from('integrated_forecast_data')
        .select('*, metadata, source_files')
        .order('date', { ascending: true });

      if (error) throw error;

      if (!integratedData || integratedData.length === 0) {
        setData([]);
        setIsLoading(false);
        isFetchingRef.current = false;
        return;
      }

      // Process data in smaller batches to avoid UI freezing
      const batchSize = 500;
      const totalBatches = Math.ceil(integratedData.length / batchSize);
      let processedItems: IntegratedData[] = [];
      
      // Function to process a single batch
      const processBatch = (batchIndex: number) => {
        const startIdx = batchIndex * batchSize;
        const endIdx = Math.min(startIdx + batchSize, integratedData.length);
        const currentBatch = integratedData.slice(startIdx, endIdx);
        
        const transformedBatch = currentBatch.map(item => {
          // Normalize metadata to be a proper object
          const parsedMetadata = typeof item.metadata === 'object' && item.metadata !== null
            ? item.metadata as Record<string, any>
            : {};

          // Normalize source files
          const parsedSourceFiles = Array.isArray(item.source_files) 
            ? item.source_files 
            : (item.source_files ? JSON.parse(item.source_files as string) : []);

          // Normalize validation status
          let typedValidationStatus: 'valid' | 'needs_review' | 'pending' = 'pending';
          if (item.validation_status === 'valid' || 
              item.validation_status === 'needs_review' || 
              item.validation_status === 'pending') {
            typedValidationStatus = item.validation_status;
          }

          // Create clean record with consistent structure
          return {
            id: item.id,
            date: item.date,
            actual_value: item.actual_value,
            sku: item.sku,
            created_at: item.created_at,
            updated_at: item.updated_at,
            validation_status: typedValidationStatus,
            source_files: parsedSourceFiles,
            metadata: parsedMetadata,
            ...parsedMetadata // Spread for direct property access
          };
        });
        
        processedItems = [...processedItems, ...transformedBatch];
        
        // If this is the last batch, update state
        if (batchIndex === totalBatches - 1) {
          setData(processedItems);
          setIsLoading(false);
          isFetchingRef.current = false;
          
          if (processedItems.length > 0) {
            setValidationStatus(
              processedItems[0].validation_status === 'valid' || 
              processedItems[0].validation_status === 'needs_review' 
                ? processedItems[0].validation_status 
                : null
            );
            setHasIntegrated(true);
          }
        } else {
          // Process next batch in next animation frame
          requestAnimationFrame(() => processBatch(batchIndex + 1));
        }
      };
      
      // Start processing with first batch
      requestAnimationFrame(() => processBatch(0));
      
    } catch (error: any) {
      console.error('Error fetching integrated data:', error);
      setError('Failed to fetch integrated data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to fetch integrated data. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [selectedMapping]);

  useEffect(() => {
    if (selectedMapping) {
      fetchData();
    }
  }, [fetchData, selectedMapping]);

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

  const fetchSavedMappings = useCallback(async () => {
    // Prevent concurrent fetches
    if (isFetchingSavedMappingsRef.current) {
      return;
    }
    
    isFetchingSavedMappingsRef.current = true;
    
    try {
      const { data: mappings, error } = await supabase
        .from('forecast_integration_mappings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching mappings:', error);
        throw error;
      }

      if (!mappings || mappings.length === 0) {
        setSavedMappings([]);
        setSelectedMapping(null);
        return;
      }

      const validMappings = mappings
        .filter(m => m && m.id)
        .map(mapping => {
          let selectedCols: string[] = [];
          
          // Try to get columns from selected_columns_array first
          if (Array.isArray(mapping.selected_columns_array)) {
            selectedCols = mapping.selected_columns_array;
          } 
          // Then try to parse from columns_config if it exists
          else if (mapping.columns_config && typeof mapping.columns_config === 'string') {
            try {
              selectedCols = JSON.parse(mapping.columns_config);
            } catch (e) {
              console.warn('Failed to parse columns_config', e);
            }
          }
          
          return {
            ...mapping,
            selected_columns: selectedCols
          };
        });
      
      setSavedMappings(validMappings);

      const activeMapping = validMappings.find(m => m.is_active);
      
      // Only update selectedMapping if it's different to prevent unnecessary rerenders
      if (!selectedMapping || (activeMapping && selectedMapping.id !== activeMapping.id)) {
        setSelectedMapping(activeMapping || null);
      }
      
      if (!activeMapping) {
        setData([]);
        setHasIntegrated(false);
      }
    } catch (error: any) {
      console.error('Error fetching mappings:', error);
      toast({
        title: "Error",
        description: "Failed to load saved mappings",
        variant: "destructive",
      });
      setSavedMappings([]);
      setSelectedMapping(null);
      setData([]);
    } finally {
      isFetchingSavedMappingsRef.current = false;
    }
  }, [selectedMapping]);

  useEffect(() => {
    fetchSavedMappings();
  }, [fetchSavedMappings]);

  const handleIntegration = useCallback(async () => {
    if (!selectedMapping) {
      setMappingDialogOpen(true);
      return;
    }

    if (isIntegrating) return;
    
    setIsIntegrating(true);
    setError(null);

    let backgroundCheckInterval: NodeJS.Timeout;
    
    try {
      await checkRequiredFiles();
      
      toast({
        title: "Integration Started",
        description: "Starting data integration process. This may take several minutes...",
        duration: 5000,
      });
      
      // Prepare mapping configuration based on selected mapping
      const mappingConfig: MappingConfigType = {
        use_product_mapping: selectedMapping.use_product_mapping,
        use_location_mapping: selectedMapping.use_location_mapping,
        product_key_column: selectedMapping.product_key_column || null,
        location_key_column: selectedMapping.location_key_column || null,
        historical_product_key_column: selectedMapping.historical_product_key_column || null,
        historical_location_key_column: selectedMapping.historical_location_key_column || null,
        id: selectedMapping.id
      };

      // Call the database function to integrate data
      const { data: result, error } = await supabase.rpc('integrate_forecast_data', {
        p_mapping_config: mappingConfig
      });
      
      if (error) {
        if (error.code === '57014') { // Query timeout
          toast({
            title: "Integration Status",
            description: "Integration is taking longer than expected. The process will continue in the background.",
            duration: 5000,
          });
          
          // Set up polling to check for completion
          backgroundCheckInterval = setInterval(async () => {
            const { data: checkData } = await supabase
              .from('integrated_forecast_data')
              .select('id')
              .limit(1);
            
            if (checkData && checkData.length > 0) {
              clearInterval(backgroundCheckInterval);
              setIsIntegrating(false);
              setHasIntegrated(true);
              toast({
                title: "Integration Complete",
                description: "Data integration has finished successfully.",
              });
              await fetchData(false);
            }
          }, 10000);
          
          return;
        }
        throw error;
      }
      
      setHasIntegrated(true);
      await fetchData(false);
      
      toast({
        title: "Success",
        description: result || "Data integrated successfully.",
      });
    } catch (error: any) {
      console.error('Integration error:', error);
      let errorMessage = error.message || "Failed to integrate data";
      
      setError(errorMessage);
      toast({
        title: "Integration Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      toast({
        title: "Integration Status",
        description: "Integration process has completed.",
        duration: 3000,
      });
      setIsIntegrating(false);
    }
  }, [selectedMapping, isIntegrating, checkRequiredFiles, fetchData]);

  const handleSaveMapping = useCallback(async (mapping: ForecastMappingConfig) => {
    try {
      // First, set all mappings to inactive
      await supabase
        .from('forecast_integration_mappings')
        .update({ is_active: false })
        .neq('id', mapping.id);

      // Then activate the selected one
      await supabase
        .from('forecast_integration_mappings')
        .update({ is_active: true })
        .eq('id', mapping.id);

      setSelectedMapping(mapping);
      await fetchSavedMappings();

      toast({
        title: "Success",
        description: "Mapping configuration activated successfully",
      });
    } catch (error) {
      console.error('Error activating mapping:', error);
      toast({
        title: "Error",
        description: "Failed to activate mapping configuration",
        variant: "destructive",
      });
    }
  }, [fetchSavedMappings]);

  const handleDeleteMapping = useCallback(async () => {
    if (!selectedMapping) {
      toast({
        title: "Error",
        description: "No mapping selected to delete",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('forecast_integration_mappings')
        .delete()
        .eq('id', selectedMapping.id);

      if (error) {
        console.error('Error deleting mapping:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Deleted mapping: ${selectedMapping.mapping_name}`,
      });

      setData([]);
      setHasIntegrated(false);
      setValidationStatus(null);
      setSelectedMapping(null);
      setMappingDialogOpen(false);
      
      fetchSavedMappings();
    } catch (error: any) {
      console.error('Error deleting mapping:', error);
      toast({
        title: "Error",
        description: "Failed to delete mapping configuration",
        variant: "destructive",
      });
    }
  }, [selectedMapping, fetchSavedMappings]);

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
