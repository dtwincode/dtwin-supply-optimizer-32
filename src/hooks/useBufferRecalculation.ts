import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BufferRecalculationHistory {
  id: string;
  product_id: string;
  location_id: string;
  recalc_ts: string;
  old_red_zone: number;
  old_yellow_zone: number;
  old_green_zone: number;
  old_adu: number;
  old_dlt: number;
  new_red_zone: number;
  new_yellow_zone: number;
  new_green_zone: number;
  new_adu: number;
  new_dlt: number;
  daf_applied: number;
  ltaf_applied: number;
  trend_factor: number;
  change_reason: string;
  triggered_by: string;
}

export interface RecalculationSchedule {
  id: string;
  schedule_name: string;
  cron_expression: string;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useBufferRecalculation = () => {
  const queryClient = useQueryClient();

  // Fetch recalculation history
  const { data: recalcHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["buffer-recalculation-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buffer_recalculation_history" as any)
        .select("*")
        .order("recalc_ts", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as unknown as BufferRecalculationHistory[];
    },
  });

  // Fetch schedule configuration
  const { data: schedules, isLoading: isLoadingSchedules } = useQuery({
    queryKey: ["buffer-recalculation-schedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("buffer_recalculation_schedule" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as RecalculationSchedule[];
    },
  });

  // Manual trigger recalculation
  const triggerRecalculation = useMutation({
    mutationFn: async (params?: { product_id?: string; location_id?: string }) => {
      const { data, error } = await supabase.rpc(
        "recalculate_buffers_with_adjustments" as any,
        {
          p_product_id: params?.product_id || null,
          p_location_id: params?.location_id || null,
          p_triggered_by: "MANUAL",
        }
      );

      if (error) throw error;
      return data;
    },
    onSuccess: (result: any) => {
      queryClient.invalidateQueries({ queryKey: ["buffer-recalculation-history"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-planning-view"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-ddmrp-buffers-view"] });
      
      const count = Array.isArray(result) ? result.length : 0;
      toast.success(`Successfully recalculated ${count} buffer(s)`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to recalculate buffers: ${error.message}`);
    },
  });

  // Update schedule
  const updateSchedule = useMutation({
    mutationFn: async (schedule: Partial<RecalculationSchedule> & { id: string }) => {
      const { data, error } = await supabase
        .from("buffer_recalculation_schedule" as any)
        .update(schedule)
        .eq("id", schedule.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buffer-recalculation-schedule"] });
      toast.success("Schedule updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update schedule: ${error.message}`);
    },
  });

  return {
    recalcHistory,
    schedules,
    isLoadingHistory,
    isLoadingSchedules,
    triggerRecalculation,
    updateSchedule,
  };
};
