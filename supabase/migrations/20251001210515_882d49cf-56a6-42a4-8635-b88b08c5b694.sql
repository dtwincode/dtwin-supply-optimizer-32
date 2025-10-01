-- Drop and recreate the DDMRP buffers view
DROP VIEW IF EXISTS inventory_ddmrp_buffers_view CASCADE;

CREATE VIEW inventory_ddmrp_buffers_view AS
SELECT
  a.product_id,
  a.location_id,
  bp.buffer_profile_id,
  -- Core values
  lt.actual_lead_time_days as dlt,
  a.adu_adj,
  bp.variability_factor as variability,
  bp.lt_factor,
  bp.variability_factor as variability_factor,
  bp.order_cycle_days,
  bp.min_order_qty,
  bp.rounding_multiple,
  -- Red zone calculation
  ROUND(lt.actual_lead_time_days * a.adu_adj * bp.lt_factor * 0.5) as red_base,
  ROUND(lt.actual_lead_time_days * a.adu_adj * bp.variability_factor) as red_safety,
  ROUND((lt.actual_lead_time_days * a.adu_adj * bp.lt_factor * 0.5) + 
        (lt.actual_lead_time_days * a.adu_adj * bp.variability_factor)) as red_zone,
  -- Yellow zone calculation  
  ROUND(lt.actual_lead_time_days * a.adu_adj * bp.variability_factor) as yellow_zone,
  -- Green zone calculation
  ROUND(bp.order_cycle_days * a.adu_adj) as green_zone,
  -- Top of zones (TOR, TOY, TOG)
  ROUND((lt.actual_lead_time_days * a.adu_adj * bp.lt_factor * 0.5) + 
        (lt.actual_lead_time_days * a.adu_adj * bp.variability_factor)) as tor,
  ROUND((lt.actual_lead_time_days * a.adu_adj * bp.lt_factor * 0.5) + 
        (lt.actual_lead_time_days * a.adu_adj * bp.variability_factor) * 2) as toy,
  ROUND((lt.actual_lead_time_days * a.adu_adj * bp.lt_factor * 0.5) + 
        (lt.actual_lead_time_days * a.adu_adj * bp.variability_factor) * 2 +
        (bp.order_cycle_days * a.adu_adj)) as tog
FROM adu_90d_view a
JOIN buffer_profile_selected bps ON a.product_id = bps.product_id AND a.location_id = bps.location_id
JOIN buffer_profile_master bp ON bps.buffer_profile_id = bp.buffer_profile_id
JOIN actual_lead_time lt ON a.product_id = lt.product_id AND a.location_id = lt.location_id;