
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IntegratedData } from "./types";

export function useIntegratedData() {
  const [data, setData] = useState<IntegratedData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIntegrating, setIsIntegrating] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching integrated data...');
      const { data: integratedData, error } = await supabase
        .from('integrated_forecast_data')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Raw integrated data:', integratedData);

      if (!integratedData || integratedData.length === 0) {
        console.log('No data found in integrated_forecast_data table');
        setData([]);
        return;
      }

      const transformedData: IntegratedData[] = integratedData.map((item, index) => {
        console.log(`Processing row ${index}:`, item);
        const transformedItem = {
          date: item.date,
          actual_value: item.actual_value || 0,
          sku: item.sku || 'N/A',
          l1_main_prod: item.l1_main_prod || 'N/A',
          l2_prod_line: item.l2_prod_line || 'N/A',
          l3_prod_category: item.l3_prod_category || 'N/A',
          l4_device_make: item.l4_device_make || 'N/A',
          l5_prod_sub_category: item.l5_prod_sub_category || 'N/A',
          l6_device_model: item.l6_device_model || 'N/A',
          region: item.region || 'N/A',
          city: item.city || 'N/A',
          warehouse: item.warehouse || 'N/A',
          channel: item.channel || 'N/A'
        };
        console.log(`Transformed row ${index}:`, transformedItem);
        return transformedItem;
      });

      console.log('Final transformed data:', transformedData);
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching integrated data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch integrated data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegration = async () => {
    setIsIntegrating(true);
    try {
      console.log('Checking for historical sales data...');
      
      const { data: historicalFiles, error: historicalError } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'historical_sales')
        .order('created_at', { ascending: false })
        .limit(1);

      if (historicalError) {
        console.error('Historical data query error:', historicalError);
        throw historicalError;
      }
      
      if (!historicalFiles || historicalFiles.length === 0) {
        console.log('No historical sales files found');
        throw new Error('No historical sales data found. Please upload historical sales data first.');
      }

      console.log('Found historical data file:', historicalFiles[0]);
      console.log('Historical data content:', historicalFiles[0].data);

      console.log('Calling integrate_forecast_data function...');
      const { data: result, error } = await supabase
        .rpc('integrate_forecast_data');
      
      if (error) {
        console.error('Integration function error:', error);
        throw error;
      }
      
      console.log('Integration completed successfully:', result);
      
      toast({
        title: "Success",
        description: "Data integration completed successfully.",
      });
      
      console.log('Refreshing data after integration...');
      await fetchData();
    } catch (error: any) {
      console.error('Integration error:', error);
      toast({
        title: "Integration Failed",
        description: error.message || "Failed to integrate data. Please ensure you have uploaded historical sales data.",
        variant: "destructive",
      });
    } finally {
      setIsIntegrating(false);
    }
  };

  return {
    data,
    isLoading,
    isIntegrating,
    fetchData,
    handleIntegration
  };
}
