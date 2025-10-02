-- ============================================
-- FIX: Buffer Calculation Showing Zero Zones
-- ============================================
-- Problem: CROSS JOIN creates ALL product-location combinations
-- but only those with sales have ADU > 0, making most buffers show 0.00
-- 
-- Solution: Only show buffers for:
--   1. Product-location pairs with actual sales data (ADU > 0)
--   2. OR pairs designated as decoupling points
-- ============================================

DROP VIEW IF EXISTS inventory_ddmrp_buffers_view CASCADE;

CREATE VIEW inventory_ddmrp_buffers_view AS
WITH valid_pairs AS (
  -- Get all product-location pairs that have actual sales data
  SELECT DISTINCT 
    product_id, 
    location_id
  FROM adu_90d_view
  WHERE adu_adj > 0
  
  UNION
  
  -- Also include decoupling points even if no sales yet
  SELECT DISTINCT
    product_id,
    location_id
  FROM decoupling_points
)
SELECT 
  p.product_id,
  p.sku,
  p.name AS product_name,
  p.category,
  p.subcategory,
  vp.location_id,
  l.region,
  l.channel_id,
  bp.buffer_profile_id,
  bp.name AS buffer_profile_name,
  bp.lt_factor,
  bp.variability_factor,
  bp.order_cycle_days,
  bp.min_order_qty AS moq,
  bp.rounding_multiple,
  
  -- ADU and DLT
  COALESCE(adu.adu_adj, 0) AS adu,
  COALESCE(alt.actual_lead_time_days, 7) AS dlt,
  
  -- DDMRP Buffer Zones (matching inventoryService.ts formulas)
  -- Red Zone = ADU × DLT × LT Factor × Variability Factor (min = MOQ)
  GREATEST(
    ROUND(
      COALESCE(adu.adu_adj, 0) * 
      COALESCE(alt.actual_lead_time_days, 7) * 
      bp.lt_factor * 
      bp.variability_factor,
      2
    ),
    bp.min_order_qty
  ) AS red_zone,
  
  -- Yellow Zone = ADU × DLT × LT Factor
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(alt.actual_lead_time_days, 7) * 
    bp.lt_factor,
    2
  ) AS yellow_zone,
  
  -- Green Zone = MAX(ADU × Order Cycle × LT Factor, Red Zone)
  GREATEST(
    ROUND(
      COALESCE(adu.adu_adj, 0) * 
      bp.order_cycle_days * 
      bp.lt_factor,
      2
    ),
    GREATEST(
      ROUND(
        COALESCE(adu.adu_adj, 0) * 
        COALESCE(alt.actual_lead_time_days, 7) * 
        bp.lt_factor * 
        bp.variability_factor,
        2
      ),
      bp.min_order_qty
    )
  ) AS green_zone,
  
  -- TOR (Top of Red) = Red Zone
  GREATEST(
    ROUND(
      COALESCE(adu.adu_adj, 0) * 
      COALESCE(alt.actual_lead_time_days, 7) * 
      bp.lt_factor * 
      bp.variability_factor,
      2
    ),
    bp.min_order_qty
  ) AS tor,
  
  -- TOY (Top of Yellow) = Red Zone + Yellow Zone
  GREATEST(
    ROUND(
      COALESCE(adu.adu_adj, 0) * 
      COALESCE(alt.actual_lead_time_days, 7) * 
      bp.lt_factor * 
      bp.variability_factor,
      2
    ),
    bp.min_order_qty
  ) + ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(alt.actual_lead_time_days, 7) * 
    bp.lt_factor,
    2
  ) AS toy,
  
  -- TOG (Top of Green) = Red + Yellow + Green
  GREATEST(
    ROUND(
      COALESCE(adu.adu_adj, 0) * 
      COALESCE(alt.actual_lead_time_days, 7) * 
      bp.lt_factor * 
      bp.variability_factor,
      2
    ),
    bp.min_order_qty
  ) + ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(alt.actual_lead_time_days, 7) * 
    bp.lt_factor,
    2
  ) + GREATEST(
    ROUND(
      COALESCE(adu.adu_adj, 0) * 
      bp.order_cycle_days * 
      bp.lt_factor,
      2
    ),
    GREATEST(
      ROUND(
        COALESCE(adu.adu_adj, 0) * 
        COALESCE(alt.actual_lead_time_days, 7) * 
        bp.lt_factor * 
        bp.variability_factor,
        2
      ),
      bp.min_order_qty
    )
  ) AS tog

FROM valid_pairs vp
INNER JOIN product_master p ON vp.product_id = p.product_id
INNER JOIN location_master l ON vp.location_id = l.location_id
LEFT JOIN buffer_profile_master bp ON p.buffer_profile_id = bp.buffer_profile_id
LEFT JOIN adu_90d_view adu ON p.product_id = adu.product_id AND vp.location_id = adu.location_id
LEFT JOIN actual_lead_time alt ON p.product_id = alt.product_id AND vp.location_id = alt.location_id;

-- Recreate inventory_planning_view (depends on inventory_ddmrp_buffers_view)
DROP VIEW IF EXISTS inventory_planning_view CASCADE;

CREATE VIEW inventory_planning_view AS
SELECT 
  b.product_id,
  b.sku,
  b.product_name,
  b.category,
  b.subcategory,
  b.location_id,
  b.region,
  b.channel_id,
  b.buffer_profile_id,
  
  b.adu AS average_daily_usage,
  b.dlt AS lead_time_days,
  
  -- Net flow position components
  COALESCE(n.on_hand, 0) AS on_hand,
  COALESCE(n.on_order, 0) AS on_order,
  COALESCE(n.qualified_demand, 0) AS qualified_demand,
  COALESCE(n.nfp, 0) AS nfp,
  
  -- Buffer zones
  b.red_zone,
  b.yellow_zone,
  b.green_zone,
  
  -- Thresholds
  b.tor,
  b.toy,
  b.tog,
  
  -- Replenishment parameters
  b.moq AS min_order_qty,
  b.rounding_multiple,
  
  -- Buffer status
  CASE 
    WHEN b.tog = 0 THEN 'UNKNOWN'
    WHEN COALESCE(n.nfp, 0) < b.tor THEN 'RED'
    WHEN COALESCE(n.nfp, 0) < b.toy THEN 'YELLOW'
    WHEN COALESCE(n.nfp, 0) <= b.tog THEN 'GREEN'
    ELSE 'BLUE'
  END AS buffer_status,
  
  -- Convenience aliases
  b.tor AS min_stock_level,
  b.tog AS max_stock_level,
  b.toy AS reorder_level,
  COALESCE(n.on_hand, 0) AS current_stock_level,
  
  -- Decoupling point flag
  EXISTS (
    SELECT 1 FROM decoupling_points dp 
    WHERE dp.product_id = b.product_id 
    AND dp.location_id = b.location_id
  ) AS decoupling_point,
  
  -- Demand variability
  COALESCE((
    SELECT cv FROM demand_history_analysis dha
    WHERE dha.product_id = b.product_id 
    AND dha.location_id = b.location_id
    ORDER BY analysis_period_end DESC
    LIMIT 1
  ), 0.5) AS demand_variability

FROM inventory_ddmrp_buffers_view b
LEFT JOIN inventory_net_flow_view n ON b.product_id = n.product_id AND b.location_id = n.location_id;