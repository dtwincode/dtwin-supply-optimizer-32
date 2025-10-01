-- Drop dependent views first with CASCADE
DROP VIEW IF EXISTS inventory_net_flow_view CASCADE;
DROP VIEW IF EXISTS inventory_ddmrp_buffers_view CASCADE;

-- Recreate the inventory_ddmrp_buffers_view with buffer profile from product_master
CREATE VIEW inventory_ddmrp_buffers_view AS
SELECT
  pm.product_id,
  pm.sku,
  pm.name as product_name,
  pm.category,
  pm.subcategory,
  lm.location_id,
  
  -- Buffer profile from product_master
  COALESCE(pm.buffer_profile_id, 'BP_DEFAULT') as buffer_profile_id,
  bp.name as buffer_profile_name,
  
  -- ADU from adu_90d_view
  COALESCE(adu.adu_adj, 15.0) as adu,
  
  -- DLT from master_lead_time or default
  COALESCE(mlt.standard_lead_time_days, 7) as dlt,
  
  -- Buffer profile parameters
  bp.lt_factor,
  bp.variability_factor,
  bp.order_cycle_days,
  bp.min_order_qty,
  bp.rounding_multiple,
  
  -- Calculate buffer zones
  (COALESCE(mlt.standard_lead_time_days, 7) * COALESCE(adu.adu_adj, 15.0) * bp.lt_factor) +
  (bp.order_cycle_days * COALESCE(adu.adu_adj, 15.0) * bp.variability_factor) as red_zone,
  
  (COALESCE(mlt.standard_lead_time_days, 7) * COALESCE(adu.adu_adj, 15.0) * bp.lt_factor) +
  (bp.order_cycle_days * COALESCE(adu.adu_adj, 15.0) * bp.variability_factor) as yellow_zone,
  
  COALESCE(mlt.standard_lead_time_days, 7) * COALESCE(adu.adu_adj, 15.0) * bp.lt_factor as green_zone,
  
  -- Top of Red (TOR)
  (COALESCE(mlt.standard_lead_time_days, 7) * COALESCE(adu.adu_adj, 15.0) * bp.lt_factor) +
  (bp.order_cycle_days * COALESCE(adu.adu_adj, 15.0) * bp.variability_factor) as tor,
  
  -- Top of Yellow (TOY)
  2 * ((COALESCE(mlt.standard_lead_time_days, 7) * COALESCE(adu.adu_adj, 15.0) * bp.lt_factor) +
  (bp.order_cycle_days * COALESCE(adu.adu_adj, 15.0) * bp.variability_factor)) as toy,
  
  -- Top of Green (TOG)
  (2 * ((COALESCE(mlt.standard_lead_time_days, 7) * COALESCE(adu.adu_adj, 15.0) * bp.lt_factor) +
  (bp.order_cycle_days * COALESCE(adu.adu_adj, 15.0) * bp.variability_factor))) +
  (COALESCE(mlt.standard_lead_time_days, 7) * COALESCE(adu.adu_adj, 15.0) * bp.lt_factor) as tog

FROM product_master pm
CROSS JOIN location_master lm
LEFT JOIN adu_90d_view adu ON pm.product_id = adu.product_id AND lm.location_id = adu.location_id
LEFT JOIN master_lead_time mlt ON pm.product_id = mlt.product_id AND lm.location_id = mlt.location_id
LEFT JOIN buffer_profile_master bp ON COALESCE(pm.buffer_profile_id, 'BP_DEFAULT') = bp.buffer_profile_id;

-- Recreate inventory_net_flow_view
CREATE VIEW inventory_net_flow_view AS
SELECT
  b.product_id,
  b.location_id,
  COALESCE(oh.qty_on_hand, 0) as on_hand,
  COALESCE(oo.qty_on_order, 0) as on_order,
  COALESCE(qd.qty_qualified_demand, 0) as qualified_demand,
  COALESCE(oh.qty_on_hand, 0) + COALESCE(oo.qty_on_order, 0) - COALESCE(qd.qty_qualified_demand, 0) as nfp
FROM inventory_ddmrp_buffers_view b
LEFT JOIN onhand_latest_view oh ON b.product_id = oh.product_id AND b.location_id = oh.location_id
LEFT JOIN onorder_view oo ON b.product_id = oo.product_id AND b.location_id = oo.location_id
LEFT JOIN (
  SELECT product_id, location_id, SUM(qty) as qty_qualified_demand
  FROM open_so
  WHERE status = 'CONFIRMED'
  GROUP BY product_id, location_id
) qd ON b.product_id = qd.product_id AND b.location_id = qd.location_id;