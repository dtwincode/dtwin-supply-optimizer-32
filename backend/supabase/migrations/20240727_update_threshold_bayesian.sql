
-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.update_threshold_bayesian();

-- Create updated function using performance_tracking table instead of inventory_performance_metrics
CREATE OR REPLACE FUNCTION public.update_threshold_bayesian()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update demand_variability_threshold based on stockout_count and overstock_count
  -- and decoupling_threshold based on service_level from performance_tracking
  UPDATE public.threshold_config
  SET 
    demand_variability_threshold = 
      CASE 
        WHEN EXISTS (SELECT 1 FROM performance_tracking LIMIT 1) THEN
          (demand_variability_threshold + 
          COALESCE((SELECT 0.6 + (SUM(stockout_count) * 0.01) - (SUM(overstock_count) * 0.005) 
                   FROM performance_tracking) / 
                  (SELECT COUNT(*) FROM performance_tracking), 0.6))
          / 2
        ELSE demand_variability_threshold
      END,
    decoupling_threshold = 
      CASE 
        WHEN EXISTS (SELECT 1 FROM performance_tracking LIMIT 1) THEN
          (decoupling_threshold + 
          COALESCE((SELECT 0.75 + (AVG(CASE WHEN service_level < 95 THEN 0.1 ELSE 0 END)) - 
                            (AVG(CASE WHEN service_level > 98 THEN 0.05 ELSE 0 END))
                   FROM performance_tracking), 0.75))
          / 2
        ELSE decoupling_threshold
      END,
    first_time_adjusted = true,
    updated_at = NOW();
END;
$$;

-- Grant execution privileges
GRANT EXECUTE ON FUNCTION public.update_threshold_bayesian() TO postgres, anon, authenticated, service_role;

-- Add comment explaining the function
COMMENT ON FUNCTION public.update_threshold_bayesian() IS 'Updates threshold values using Bayesian-inspired approach based on performance_tracking data';
