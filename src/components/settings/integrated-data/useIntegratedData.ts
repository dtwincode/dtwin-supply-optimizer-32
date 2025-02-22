
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IntegratedData } from "./types";
import { useFilters } from "@/contexts/FilterContext";
import { useLocation } from "react-router-dom";

export function useIntegratedData() {
  const [data, setData] = useState<IntegratedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIntegrating, setIsIntegrating] = useState(false);
  
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'settings';
  const { getProductHierarchyState, getLocationState } = useFilters();
  
  const fetchData = useCallback(async () => {
    if (isLoading) return; // Prevent multiple concurrent fetches
    
    setIsLoading(true);
    try {
      console.log('Fetching integrated data...');
      
      const productFilters = getProductHierarchyState(currentTab);
      const locationFilters = getLocationState(currentTab);
      
      let query = supabase
        .from('integrated_forecast_data')
        .select('*');

      // Only apply filters if they exist and have valid values
      if (productFilters && Object.keys(productFilters).length > 0) {
        Object.entries(productFilters).forEach(([level, { selected }]) => {
          if (selected && selected !== level) {
            query = query.eq(level, selected);
          }
        });
      }

      if (locationFilters && Object.keys(locationFilters).length > 0) {
        Object.entries(locationFilters).forEach(([level, value]) => {
          if (value && value !== level) {
            query = query.eq(level, value);
          }
        });
      }

      const { data: integratedData, error } = await query.order('date', { ascending: true });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      if (!integratedData || integratedData.length === 0) {
        console.log('No data found in integrated_forecast_data table');
        setData([]);
        return;
      }

      const transformedData = integratedData.map(item => ({
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
      }));

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching integrated data:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب البيانات المتكاملة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentTab, getProductHierarchyState, getLocationState]);

  const handleIntegration = async () => {
    if (isIntegrating) return;
    
    setIsIntegrating(true);
    try {
      const { data: historicalFiles, error: historicalError } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'historical_sales')
        .order('created_at', { ascending: false })
        .limit(1);

      if (historicalError) throw historicalError;
      
      if (!historicalFiles?.length) {
        throw new Error('يرجى تحميل بيانات المبيعات التاريخية أولاً.');
      }

      const { error } = await supabase.rpc('integrate_forecast_data');
      if (error) throw error;
      
      toast({
        title: "نجاح",
        description: "تم دمج البيانات بنجاح.",
      });
      
      await fetchData();
    } catch (error: any) {
      console.error('Integration error:', error);
      toast({
        title: "فشل الدمج",
        description: error.message || "فشل في دمج البيانات. يرجى التأكد من تحميل بيانات المبيعات التاريخية.",
        variant: "destructive",
      });
    } finally {
      setIsIntegrating(false);
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isIntegrating,
    fetchData,
    handleIntegration
  };
}
