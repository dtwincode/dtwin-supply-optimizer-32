
-- Drop the existing slow view
DROP VIEW IF EXISTS public.inventory_ddmrp_buffers_view CASCADE;

-- Create optimized view with proper DDMRP calculations
CREATE OR REPLACE VIEW public.inventory_ddmrp_buffers_view AS
SELECT
  pl.product_id,
  pl.location_id,
  pm.sku,
  pm.name as product_name,
  pm.category,
  pm.subcategory,
  
  -- Buffer Profile Info
  bpm.buffer_profile_id,
  bpm.name as buffer_profile_name,
  
  -- Core DDMRP Inputs
  COALESCE(adu.adu_adj, 0) as adu,
  COALESCE(mlt.standard_lead_time_days, 0) as dlt,
  
  -- Buffer Profile Factors
  COALESCE(bpm.lt_factor, 1.0) as lt_factor,
  COALESCE(bpm.variability_factor, 0.25) as variability_factor,
  COALESCE(bpm.order_cycle_days, 7) as order_cycle_days,
  COALESCE(bpm.min_order_qty, 0) as min_order_qty,
  COALESCE(bpm.rounding_multiple, 1) as rounding_multiple,
  
  -- DDMRP Buffer Zone Calculations
  -- Red Zone = ADU × DLT × LT_Factor
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(mlt.standard_lead_time_days, 0) * 
    COALESCE(bpm.lt_factor, 1.0),
    2
  ) as red_zone,
  
  -- Yellow Zone = ADU × Order Cycle Days
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(bpm.order_cycle_days, 7),
    2
  ) as yellow_zone,
  
  -- Green Zone = Max(Red Zone × Variability Factor, MOQ)
  ROUND(
    GREATEST(
      (COALESCE(adu.adu_adj, 0) * COALESCE(mlt.standard_lead_time_days, 0) * COALESCE(bpm.lt_factor, 1.0)) * COALESCE(bpm.variability_factor, 0.25),
      COALESCE(bpm.min_order_qty, 0)
    ),
    2
  ) as green_zone,
  
  -- Buffer Thresholds
  -- TOR (Top of Red) = Red Zone
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(mlt.standard_lead_time_days, 0) * 
    COALESCE(bpm.lt_factor, 1.0),
    2
  ) as tor,
  
  -- TOY (Top of Yellow) = Red + Yellow
  ROUND(
    (COALESCE(adu.adu_adj, 0) * COALESCE(mlt.standard_lead_time_days, 0) * COALESCE(bpm.lt_factor, 1.0)) +
    (COALESCE(adu.adu_adj, 0) * COALESCE(bpm.order_cycle_days, 7)),
    2
  ) as toy,
  
  -- TOG (Top of Green) = Red + Yellow + Green
  ROUND(
    (COALESCE(adu.adu_adj, 0) * COALESCE(mlt.standard_lead_time_days, 0) * COALESCE(bpm.lt_factor, 1.0)) +
    (COALESCE(adu.adu_adj, 0) * COALESCE(bpm.order_cycle_days, 7)) +
    GREATEST(
      (COALESCE(adu.adu_adj, 0) * COALESCE(mlt.standard_lead_time_days, 0) * COALESCE(bpm.lt_factor, 1.0)) * COALESCE(bpm.variability_factor, 0.25),
      COALESCE(bpm.min_order_qty, 0)
    ),
    2
  ) as tog

FROM public.product_location_pairs pl

-- Join with product master for product details
LEFT JOIN public.product_master pm ON pl.product_id = pm.product_id

-- Join with pre-calculated ADU view (much faster than correlated subquery)
LEFT JOIN public.adu_90d_view adu 
  ON pl.product_id = adu.product_id 
  AND pl.location_id = adu.location_id

-- Join with master lead time
LEFT JOIN public.master_lead_time mlt 
  ON pl.product_id = mlt.product_id 
  AND pl.location_id = mlt.location_id

-- Join with buffer profile master (default to BP_DEFAULT)
LEFT JOIN public.buffer_profile_master bpm 
  ON bpm.buffer_profile_id = COALESCE(
    (SELECT buffer_profile_id FROM buffer_profile_override bpo 
     WHERE bpo.product_id = pl.product_id AND bpo.location_id = pl.location_id),
    'BP_DEFAULT'
  );

-- Add comment
COMMENT ON VIEW public.inventory_ddmrp_buffers_view IS 
'Optimized DDMRP buffer calculation view with proper zone calculations based on ADU, DLT, and buffer profile factors';
