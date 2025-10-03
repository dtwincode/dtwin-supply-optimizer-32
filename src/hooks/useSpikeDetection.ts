import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SpikeParameters {
  id: string;
  product_id: string;
  location_id: string;
  spike_horizon_factor: number;
  spike_threshold_factor: number;
  created_at: string;
  updated_at: string;
}

export interface OrderQualification {
  product_id: string;
  sku: string;
  product_name: string;
  location_id: string;
  region: string;
  order_qty: number;
  qualified_qty: number;
  unqualified_qty: number;
  is_spike: boolean;
  spike_threshold_qty: number;
  spike_horizon_days: number;
  adu_at_qualification: number;
  qualification_reason: string;
  qualified_at: string;
  confirmed_date: string;
  days_until_due: number;
}

export const useSpikeDetection = () => {
  const queryClient = useQueryClient();

  // Fetch all spike parameters
  const { data: spikeParameters, isLoading: isLoadingParams } = useQuery({
    queryKey: ["spike-parameters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spike_parameters" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as SpikeParameters[];
    },
  });

  // Fetch spike detection dashboard
  const { data: spikeDetections, isLoading: isLoadingDetections } = useQuery({
    queryKey: ["spike-detection-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spike_detection_dashboard" as any)
        .select("*")
        .order("qualified_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as unknown as OrderQualification[];
    },
  });

  // Update spike parameters
  const updateSpikeParams = useMutation({
    mutationFn: async (params: Partial<SpikeParameters> & { product_id: string; location_id: string }) => {
      const { data, error } = await supabase
        .from("spike_parameters" as any)
        .upsert(params)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spike-parameters"] });
      toast.success("Spike parameters updated");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update spike parameters: ${error.message}`);
    },
  });

  // Run qualification for all open orders
  const qualifyAllOrders = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("qualify_all_open_orders" as any);

      if (error) throw error;
      return data;
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ["spike-detection-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-planning-view"] });
      const summary = Array.isArray(result) && result.length > 0 ? result[0] : {};
      toast.success(
        `Qualified ${summary?.total_orders || 0} orders, detected ${summary?.spike_orders || 0} spikes`
      );
    },
    onError: (error: Error) => {
      toast.error(`Failed to qualify orders: ${error.message}`);
    },
  });

  return {
    spikeParameters,
    spikeDetections,
    isLoadingParams,
    isLoadingDetections,
    updateSpikeParams,
    qualifyAllOrders,
  };
};
