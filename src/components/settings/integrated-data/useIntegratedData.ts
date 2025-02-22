
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { IntegratedData } from "./types";
import { useLocation } from "react-router-dom";

export function useIntegratedData() {
  const [data, setData] = useState<IntegratedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isIntegrating, setIsIntegrating] = useState(false);
  
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'settings';

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

      setData(integratedData);
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
  }, []);

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
        throw new Error('يرجى تحميل بيانات المبيعات التاريخية أولاً');
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
  }, []);

  return {
    data,
    isLoading,
    isIntegrating,
    fetchData,
    handleIntegration
  };
}
