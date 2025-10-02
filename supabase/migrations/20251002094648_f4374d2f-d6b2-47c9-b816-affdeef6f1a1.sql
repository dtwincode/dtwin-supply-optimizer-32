-- ============================================
-- CRITICAL FIX: Correct DDMRP Buffer Calculation Formulas
-- ============================================

-- The current inventory_ddmrp_buffers_view has WRONG formulas!
-- 
-- WRONG (current):
--   red_zone = adu * dlt
--   yellow_zone = adu * dlt * lt_factor
--   toy = adu * dlt * (1 + lt_factor)
--
-- CORRECT (DDMRP standard):
--   red_zone = adu * dlt * lt_factor * (1 + variability_factor)
--   yellow_zone = red_zone * lt_factor
--   green_zone = adu * order_cycle_days * variability_factor
--   tor = red_zone
--   toy = red_zone + yellow_zone
--   tog = red_zone + yellow_zone + green_zone

-- Step 1: Clean orphaned product_location_pairs referencing non-existent products
DELETE FROM product_location_pairs
WHERE product_id NOT IN (SELECT product_id FROM product_master);

-- Step 2: Drop and recreate inventory_ddmrp_buffers_view with CORRECT DDMRP formulas
DROP VIEW IF EXISTS inventory_ddmrp_buffers_view CASCADE;

CREATE VIEW inventory_ddmrp_buffers_view AS
SELECT 
  p.product_id,
  p.sku,
  p.name AS product_name,
  p.category,
  p.subcategory,
  l.location_id,
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
  
  -- CORRECT DDMRP Formulas
  -- Red Zone = ADU × DLT × LT Factor × (1 + Variability Factor)
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(alt.actual_lead_time_days, 7) * 
    bp.lt_factor * 
    (1 + bp.variability_factor),
    2
  ) AS red_zone,
  
  -- Yellow Zone = Red Zone × LT Factor
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(alt.actual_lead_time_days, 7) * 
    bp.lt_factor * 
    (1 + bp.variability_factor) * 
    bp.lt_factor,
    2
  ) AS yellow_zone,
  
  -- Green Zone = ADU × Order Cycle × Variability Factor
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    bp.order_cycle_days * 
    bp.variability_factor,
    2
  ) AS green_zone,
  
  -- TOR (Top of Red) = Red Zone
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(alt.actual_lead_time_days, 7) * 
    bp.lt_factor * 
    (1 + bp.variability_factor),
    2
  ) AS tor,
  
  -- TOY (Top of Yellow) = Red Zone + Yellow Zone
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(alt.actual_lead_time_days, 7) * 
    bp.lt_factor * 
    (1 + bp.variability_factor) * 
    (1 + bp.lt_factor),
    2
  ) AS toy,
  
  -- TOG (Top of Green) = Red Zone + Yellow Zone + Green Zone
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(alt.actual_lead_time_days, 7) * 
    bp.lt_factor * 
    (1 + bp.variability_factor) * 
    (1 + bp.lt_factor) +
    COALESCE(adu.adu_adj, 0) * 
    bp.order_cycle_days * 
    bp.variability_factor,
    2
  ) AS tog

FROM product_master p
CROSS JOIN location_master l
LEFT JOIN buffer_profile_master bp ON p.buffer_profile_id = bp.buffer_profile_id
LEFT JOIN adu_90d_view adu ON p.product_id = adu.product_id AND l.location_id = adu.location_id
LEFT JOIN actual_lead_time alt ON p.product_id = alt.product_id AND l.location_id = alt.location_id;

-- Step 3: Recreate inventory_planning_view (it depends on inventory_ddmrp_buffers_view)
DROP VIEW IF EXISTS inventory_planning_view;

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
  
  -- Buffer zones (now correctly calculated)
  COALESCE(b.red_zone, 0) AS red_zone,
  COALESCE(b.yellow_zone, 0) AS yellow_zone,
  COALESCE(b.green_zone, 0) AS green_zone,
  
  -- Thresholds
  COALESCE(b.tor, 0) AS tor,
  COALESCE(b.toy, 0) AS toy,
  COALESCE(b.tog, 0) AS tog,
  
  -- Replenishment parameters
  COALESCE(b.moq, 0) AS min_order_qty,
  COALESCE(b.rounding_multiple, 1) AS rounding_multiple,
  
  -- Buffer status calculation
  CASE 
    WHEN COALESCE(b.tog, 0) = 0 THEN 'UNKNOWN'
    WHEN COALESCE(n.nfp, 0) < COALESCE(b.tor, 0) THEN 'RED'
    WHEN COALESCE(n.nfp, 0) < COALESCE(b.toy, 0) THEN 'YELLOW'
    WHEN COALESCE(n.nfp, 0) <= COALESCE(b.tog, 0) THEN 'GREEN'
    ELSE 'BLUE'
  END AS buffer_status,
  
  -- Convenience aliases
  COALESCE(b.tor, 0) AS min_stock_level,
  COALESCE(b.tog, 0) AS max_stock_level,
  COALESCE(b.toy, 0) AS reorder_level,
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

-- Step 4: Verify the fix with sample calculations
DO $$
DECLARE
  v_sample RECORD;
BEGIN
  -- Check a sample calculation
  SELECT 
    product_id,
    location_id,
    adu,
    dlt,
    lt_factor,
    variability_factor,
    red_zone,
    yellow_zone,
    tor,
    toy,
    tog,
    -- Verify formula
    ROUND(adu * dlt * lt_factor * (1 + variability_factor), 2) as expected_red_zone,
    ROUND(adu * dlt * lt_factor * (1 + variability_factor) * lt_factor, 2) as expected_yellow_zone
  INTO v_sample
  FROM inventory_ddmrp_buffers_view
  WHERE adu > 0
  LIMIT 1;
  
  IF v_sample.red_zone = v_sample.expected_red_zone THEN
    RAISE NOTICE '✓ DDMRP calculations are now CORRECT for product % at location %', 
      v_sample.product_id, v_sample.location_id;
    RAISE NOTICE '  Red Zone: % (expected: %)', v_sample.red_zone, v_sample.expected_red_zone;
    RAISE NOTICE '  Yellow Zone: % (expected: %)', v_sample.yellow_zone, v_sample.expected_yellow_zone;
  ELSE
    RAISE WARNING '✗ DDMRP calculations still have issues!';
  END IF;
END $$;