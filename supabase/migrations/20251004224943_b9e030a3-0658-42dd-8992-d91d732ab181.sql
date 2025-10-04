
-- =====================================================
-- FULL REBUILD: component_demand_view + inventory_ddmrp_buffers_view
-- Order matters: Create component_demand_view first, then buffer view
-- =====================================================

-- Step 1: Recreate component_demand_view materialized view
DROP MATERIALIZED VIEW IF EXISTS component_demand_view CASCADE;

CREATE MATERIALIZED VIEW component_demand_view AS
WITH component_sales AS (
  SELECT 
    pb.child_product_id as component_product_id,
    pm_comp.sku as component_sku,
    pm_comp.name as component_name,
    pm_comp.category as component_category,
    hsd.location_id,
    SUM(hsd.quantity_sold * pb.quantity_per) as total_component_qty,
    COUNT(DISTINCT pb.parent_product_id) as num_finished_goods_using,
    ARRAY_AGG(DISTINCT pm_parent.name) as used_in_finished_goods
  FROM product_bom pb
  JOIN historical_sales_data hsd ON hsd.product_id = pb.parent_product_id
  JOIN product_master pm_comp ON pm_comp.product_id = pb.child_product_id
  LEFT JOIN product_master pm_parent ON pm_parent.product_id = pb.parent_product_id
  WHERE hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY 
    pb.child_product_id,
    pm_comp.sku,
    pm_comp.name,
    pm_comp.category,
    hsd.location_id
),
component_stats AS (
  SELECT
    component_product_id,
    component_sku,
    component_name,
    component_category,
    location_id,
    total_component_qty,
    total_component_qty / 90.0 as component_adu,
    num_finished_goods_using,
    used_in_finished_goods,
    STDDEV(daily_qty) as std_dev,
    AVG(daily_qty) as mean_demand
  FROM (
    SELECT 
      cs.*,
      COALESCE(SUM(hsd.quantity_sold * pb.quantity_per), 0) as daily_qty
    FROM component_sales cs
    LEFT JOIN product_bom pb ON pb.child_product_id = cs.component_product_id
    LEFT JOIN historical_sales_data hsd 
      ON hsd.product_id = pb.parent_product_id 
      AND hsd.location_id = cs.location_id
      AND hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY 
      cs.component_product_id,
      cs.component_sku,
      cs.component_name,
      cs.component_category,
      cs.location_id,
      cs.total_component_qty,
      cs.num_finished_goods_using,
      cs.used_in_finished_goods,
      hsd.sales_date
  ) daily_data
  GROUP BY
    component_product_id,
    component_sku,
    component_name,
    component_category,
    location_id,
    total_component_qty,
    num_finished_goods_using,
    used_in_finished_goods
)
SELECT 
  cs.*,
  CASE 
    WHEN cs.mean_demand > 0 
    THEN ROUND((cs.std_dev / NULLIF(cs.mean_demand, 0))::numeric, 4)
    ELSE 0
  END as demand_cv,
  CASE 
    WHEN (cs.std_dev / NULLIF(cs.mean_demand, 0)) > 0.5 
    THEN true 
    ELSE false 
  END as high_variability,
  ohi.qty_on_hand as on_hand,
  COALESCE(ohi.qty_on_hand, 0) + COALESCE(opo.qty_on_order, 0) - COALESCE(oso.qty_allocated, 0) as nfp,
  NULL::numeric as tor,
  NULL::numeric as toy,
  NULL::numeric as tog,
  'GREEN'::text as buffer_status
FROM component_stats cs
LEFT JOIN (
  SELECT product_id, location_id, qty_on_hand 
  FROM on_hand_inventory 
  WHERE snapshot_ts = (SELECT MAX(snapshot_ts) FROM on_hand_inventory)
) ohi ON cs.component_product_id = ohi.product_id AND cs.location_id = ohi.location_id
LEFT JOIN (
  SELECT product_id, location_id, SUM(ordered_qty - received_qty) as qty_on_order
  FROM open_pos
  WHERE status = 'OPEN'
  GROUP BY product_id, location_id
) opo ON cs.component_product_id = opo.product_id AND cs.location_id = opo.location_id
LEFT JOIN (
  SELECT product_id, location_id, SUM(qty) as qty_allocated
  FROM open_so
  WHERE status = 'CONFIRMED'
  GROUP BY product_id, location_id
) oso ON cs.component_product_id = oso.product_id AND cs.location_id = oso.location_id;

-- Create indexes
CREATE INDEX idx_component_demand_adu ON component_demand_view(component_adu DESC);
CREATE INDEX idx_component_demand_product ON component_demand_view(component_product_id);
CREATE INDEX idx_component_demand_location ON component_demand_view(location_id);

-- Step 2: Create inventory_ddmrp_buffers_view (depends on component_demand_view)
CREATE OR REPLACE VIEW inventory_ddmrp_buffers_view AS
SELECT
  pm.product_id,
  pm.sku,
  pm.name AS product_name,
  pm.category,
  pm.subcategory,
  lm.location_id,
  lm.region,
  lm.channel_id,
  pm.buffer_profile_id,
  bpm.name AS buffer_profile_name,
  bpm.lt_factor,
  bpm.variability_factor,
  bpm.order_cycle_days,
  bpm.min_order_qty AS moq,
  bpm.rounding_multiple,
  COALESCE(cdv.component_adu, 0) AS adu,
  COALESCE(alt.actual_lead_time_days, 7) AS dlt,
  
  -- Red Zone = ADU × DLT × LT_Factor × Variability_Factor
  GREATEST(
    ROUND((COALESCE(cdv.component_adu, 0) * COALESCE(alt.actual_lead_time_days, 7) * COALESCE(bpm.lt_factor, 1.0) * COALESCE(bpm.variability_factor, 0.5))),
    COALESCE(bpm.min_order_qty, 0)
  ) AS red_zone,
  
  -- Yellow Zone = Red Zone
  GREATEST(
    ROUND((COALESCE(cdv.component_adu, 0) * COALESCE(alt.actual_lead_time_days, 7) * COALESCE(bpm.lt_factor, 1.0) * COALESCE(bpm.variability_factor, 0.5))),
    COALESCE(bpm.min_order_qty, 0)
  ) AS yellow_zone,
  
  -- Green Zone = ADU × Order_Cycle × LT_Factor
  ROUND((COALESCE(cdv.component_adu, 0) * COALESCE(bpm.order_cycle_days, 7) * COALESCE(bpm.lt_factor, 1.0))) AS green_zone,
  
  -- TOR (Top of Red)
  GREATEST(
    ROUND((COALESCE(cdv.component_adu, 0) * COALESCE(alt.actual_lead_time_days, 7) * COALESCE(bpm.lt_factor, 1.0) * COALESCE(bpm.variability_factor, 0.5))),
    COALESCE(bpm.min_order_qty, 0)
  ) AS tor,
  
  -- TOY (Top of Yellow)
  2 * GREATEST(
    ROUND((COALESCE(cdv.component_adu, 0) * COALESCE(alt.actual_lead_time_days, 7) * COALESCE(bpm.lt_factor, 1.0) * COALESCE(bpm.variability_factor, 0.5))),
    COALESCE(bpm.min_order_qty, 0)
  ) AS toy,
  
  -- TOG (Top of Green)
  (2 * GREATEST(
    ROUND((COALESCE(cdv.component_adu, 0) * COALESCE(alt.actual_lead_time_days, 7) * COALESCE(bpm.lt_factor, 1.0) * COALESCE(bpm.variability_factor, 0.5))),
    COALESCE(bpm.min_order_qty, 0)
  )) + ROUND((COALESCE(cdv.component_adu, 0) * COALESCE(bpm.order_cycle_days, 7) * COALESCE(bpm.lt_factor, 1.0))) AS tog
  
FROM product_master pm
CROSS JOIN location_master lm
LEFT JOIN buffer_profile_master bpm ON pm.buffer_profile_id = bpm.buffer_profile_id
LEFT JOIN component_demand_view cdv ON pm.product_id = cdv.component_product_id AND lm.location_id = cdv.location_id
LEFT JOIN actual_lead_time alt ON pm.product_id = alt.product_id AND lm.location_id = alt.location_id

WHERE pm.product_type IN ('RAW_MATERIAL', 'COMPONENT')
  AND pm.buffer_profile_id IS NOT NULL
  AND pm.buffer_profile_id != 'BP_DEFAULT'
  AND cdv.component_adu > 0;

-- Step 3: Refresh the materialized view
REFRESH MATERIALIZED VIEW component_demand_view;
