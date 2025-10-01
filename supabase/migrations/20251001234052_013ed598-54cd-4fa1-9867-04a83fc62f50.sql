-- =====================================================
-- Phase 2: Create DDMRP Calculation Views
-- =====================================================

-- 1. Create inventory_net_flow_view for Net Flow Position calculations
CREATE OR REPLACE VIEW inventory_net_flow_view AS
SELECT 
  pm.product_id,
  pm.sku,
  pm.name AS product_name,
  pm.category,
  pm.subcategory,
  lm.location_id,
  lm.region,
  COALESCE(oh.qty_on_hand, 0) AS on_hand,
  COALESCE(oo.qty_on_order, 0) AS on_order,
  COALESCE(os.qty_allocated, 0) AS allocated,
  -- Net Flow Position = On Hand + On Order - Allocated
  COALESCE(oh.qty_on_hand, 0) + COALESCE(oo.qty_on_order, 0) - COALESCE(os.qty_allocated, 0) AS nfp,
  -- ADU from 90-day view
  COALESCE(adu.adu_adj, 0) AS adu,
  -- DLT from master_lead_time
  COALESCE(mlt.standard_lead_time_days, 0) AS dlt,
  -- Buffer profile
  pm.buffer_profile_id,
  bpm.name AS buffer_profile_name,
  -- Calculate buffer zones (simplified - will be refined)
  ROUND(COALESCE(adu.adu_adj, 0) * COALESCE(mlt.standard_lead_time_days, 0) * bpm.lt_factor * bpm.variability_factor, 2) AS red_zone,
  ROUND(COALESCE(adu.adu_adj, 0) * COALESCE(mlt.standard_lead_time_days, 0) * bpm.lt_factor * bpm.variability_factor * 0.5, 2) AS yellow_zone,
  ROUND(COALESCE(adu.adu_adj, 0) * COALESCE(mlt.standard_lead_time_days, 0) * bpm.lt_factor * bpm.variability_factor * 2, 2) AS green_zone
FROM product_master pm
CROSS JOIN location_master lm
LEFT JOIN onhand_latest_view oh ON pm.product_id = oh.product_id AND lm.location_id = oh.location_id
LEFT JOIN onorder_view oo ON pm.product_id = oo.product_id AND lm.location_id = oo.location_id
LEFT JOIN (
  SELECT product_id, location_id, SUM(qty) AS qty_allocated
  FROM open_so
  WHERE status = 'CONFIRMED'
  GROUP BY product_id, location_id
) os ON pm.product_id = os.product_id AND lm.location_id = os.location_id
LEFT JOIN adu_90d_view adu ON pm.product_id = adu.product_id AND lm.location_id = adu.location_id
LEFT JOIN master_lead_time mlt ON pm.product_id = mlt.product_id AND lm.location_id = mlt.location_id
LEFT JOIN buffer_profile_master bpm ON pm.buffer_profile_id = bpm.buffer_profile_id
WHERE pm.product_id IS NOT NULL AND lm.location_id IS NOT NULL;

-- 2. Create inventory_planning_view for the planning interface
CREATE OR REPLACE VIEW inventory_planning_view AS
SELECT 
  nfv.product_id,
  nfv.location_id,
  nfv.sku,
  nfv.product_name,
  nfv.category,
  nfv.subcategory,
  nfv.on_hand AS current_stock_level,
  nfv.adu AS average_daily_usage,
  nfv.red_zone AS min_stock_level,
  nfv.green_zone AS max_stock_level,
  nfv.red_zone + nfv.yellow_zone AS reorder_level,
  nfv.dlt AS lead_time_days,
  COALESCE(dp.is_strategic, false) AS decoupling_point,
  -- Buffer status based on NFP
  CASE 
    WHEN nfv.nfp <= nfv.red_zone THEN 'RED'
    WHEN nfv.nfp <= (nfv.red_zone + nfv.yellow_zone) THEN 'YELLOW'
    WHEN nfv.nfp <= (nfv.red_zone + nfv.yellow_zone + nfv.green_zone) THEN 'GREEN'
    ELSE 'BLUE'
  END AS buffer_status,
  nfv.red_zone,
  nfv.yellow_zone,
  nfv.green_zone,
  nfv.buffer_profile_id,
  -- Demand variability (placeholder - to be calculated from historical data)
  0.25 AS demand_variability,
  -- Additional DDMRP fields
  nfv.on_hand,
  nfv.on_order,
  nfv.allocated AS qualified_demand,
  nfv.nfp,
  nfv.red_zone AS tor,
  nfv.red_zone + nfv.yellow_zone AS toy,
  nfv.red_zone + nfv.yellow_zone + nfv.green_zone AS tog
FROM inventory_net_flow_view nfv
LEFT JOIN decoupling_points dp ON nfv.product_id = dp.product_id AND nfv.location_id = dp.location_id
WHERE nfv.adu > 0 OR nfv.on_hand > 0;

-- 3. Grant access to views
GRANT SELECT ON inventory_net_flow_view TO authenticated;
GRANT SELECT ON inventory_net_flow_view TO anon;
GRANT SELECT ON inventory_planning_view TO authenticated;
GRANT SELECT ON inventory_planning_view TO anon;