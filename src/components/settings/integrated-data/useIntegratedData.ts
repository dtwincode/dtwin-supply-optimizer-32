
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
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { data: integratedData, error } = await supabase
        .from('integrated_forecast_data')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      if (!integratedData || integratedData.length === 0) {
        setData([]);
        return;
      }

      // معالجة البيانات قبل عرضها في الجدول
      const transformedData = integratedData.map(item => ({
        date: item.date,
        actual_value: item.actual_value || 0,
        sku: item.sku,
        l1_main_prod: item.l1_main_prod || '',
        l2_prod_line: item.l2_prod_line || '',
        l3_prod_category: item.l3_prod_category || '',
        l4_device_make: item.l4_device_make || '',
        l5_prod_sub_category: item.l5_prod_sub_category || '',
        l6_device_model: item.l6_device_model || '',
        region: item.region || '',
        city: item.city || '',
        warehouse: item.warehouse || '',
        channel: item.channel || ''
      }));

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching integrated data:', error);
      toast({
        title: "خطأ",
        description: "فشل في جلب البيانات المتكاملة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);  // إزالة isLoading من التبعيات لمنع إعادة التحميل غير الضرورية

  const checkRequiredFiles = async () => {
    try {
      // Check for historical sales data
      const { data: historicalFiles, error: historicalError } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'historical_sales')
        .order('created_at', { ascending: false })
        .limit(1);

      if (historicalError) throw historicalError;
      if (!historicalFiles?.length) {
        throw new Error('يرجى تحميل بيانات المبيعات التاريخية أولاً');
      }

      // Check for product hierarchy data
      const { data: productFiles, error: productError } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'product_hierarchy')
        .order('created_at', { ascending: false })
        .limit(1);

      if (productError) throw productError;
      if (!productFiles?.length) {
        throw new Error('يرجى تحميل بيانات هيكل المنتجات أولاً');
      }

      // Check for location hierarchy data
      const { data: locationFiles, error: locationError } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('created_at', { ascending: false })
        .limit(1);

      if (locationError) throw locationError;
      if (!locationFiles?.length) {
        throw new Error('يرجى تحميل بيانات هيكل المواقع أولاً');
      }

      return true;
    } catch (error: any) {
      console.error('Error checking required files:', error);
      throw error;
    }
  };

  const handleIntegration = async () => {
    if (isIntegrating) return;
    
    setIsIntegrating(true);
    try {
      await checkRequiredFiles();
      
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
        description: error.message || "فشل في دمج البيانات. يرجى التأكد من تحميل جميع البيانات المطلوبة.",
        variant: "destructive",
      });
    } finally {
      setIsIntegrating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // إزالة fetchData من التبعيات لمنع التحديث المستمر

  return {
    data,
    isLoading,
    isIntegrating,
    fetchData,
    handleIntegration
  };
}
