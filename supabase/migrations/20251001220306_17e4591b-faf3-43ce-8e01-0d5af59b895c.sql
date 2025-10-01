-- Drop safety stock simulation table
DROP TABLE IF EXISTS public.safety_stock_simulation CASCADE;

-- Create the missing inventory_ddmrp_buffers_view with proper DDMRP buffer zones
CREATE OR REPLACE VIEW public.inventory_ddmrp_buffers_view AS
SELECT 
  bpm.buffer_profile_id,
  bpm.name as buffer_profile_name,
  pl.product_id,
  pl.location_id,
  pm.sku,
  pm.name as product_name,
  pm.category,
  pm.subcategory,
  
  -- DDMRP Metrics
  COALESCE(
    (SELECT adu_adj FROM adu_90d_view WHERE product_id = pl.product_id AND location_id = pl.location_id LIMIT 1),
    0
  ) as adu,
  
  COALESCE(alt.actual_lead_time_days, 0) as dlt,
  
  -- Red Zone (Base Stock)
  COALESCE(
    (SELECT adu_adj FROM adu_90d_view WHERE product_id = pl.product_id AND location_id = pl.location_id LIMIT 1) * 
    COALESCE(alt.actual_lead_time_days, 0) * 
    bpm.lt_factor * 
    bpm.variability_factor,
    0
  ) as red_zone,
  
  -- Yellow Zone (50% of Red)
  COALESCE(
    (SELECT adu_adj FROM adu_90d_view WHERE product_id = pl.product_id AND location_id = pl.location_id LIMIT 1) * 
    COALESCE(alt.actual_lead_time_days, 0) * 
    bpm.lt_factor * 
    bpm.variability_factor * 0.5,
    0
  ) as yellow_zone,
  
  -- Green Zone (200% of Red)
  COALESCE(
    (SELECT adu_adj FROM adu_90d_view WHERE product_id = pl.product_id AND location_id = pl.location_id LIMIT 1) * 
    COALESCE(alt.actual_lead_time_days, 0) * 
    bpm.lt_factor * 
    bpm.variability_factor * 2.0,
    0
  ) as green_zone,
  
  -- Top of Red
  COALESCE(
    (SELECT adu_adj FROM adu_90d_view WHERE product_id = pl.product_id AND location_id = pl.location_id LIMIT 1) * 
    COALESCE(alt.actual_lead_time_days, 0) * 
    bpm.lt_factor * 
    bpm.variability_factor,
    0
  ) as tor,
  
  -- Top of Yellow (Red + Yellow)
  COALESCE(
    (SELECT adu_adj FROM adu_90d_view WHERE product_id = pl.product_id AND location_id = pl.location_id LIMIT 1) * 
    COALESCE(alt.actual_lead_time_days, 0) * 
    bpm.lt_factor * 
    bpm.variability_factor * 1.5,
    0
  ) as toy,
  
  -- Top of Green (Red + Yellow + Green)
  COALESCE(
    (SELECT adu_adj FROM adu_90d_view WHERE product_id = pl.product_id AND location_id = pl.location_id LIMIT 1) * 
    COALESCE(alt.actual_lead_time_days, 0) * 
    bpm.lt_factor * 
    bpm.variability_factor * 3.0,
    0
  ) as tog,
  
  bpm.min_order_qty,
  bpm.rounding_multiple,
  bpm.order_cycle_days
  
FROM product_location_pairs pl
LEFT JOIN buffer_profile_master bpm ON bpm.buffer_profile_id = 'BP001'
LEFT JOIN product_master pm ON pm.product_id = pl.product_id
LEFT JOIN actual_lead_time alt ON alt.product_id = pl.product_id AND alt.location_id = pl.location_id;