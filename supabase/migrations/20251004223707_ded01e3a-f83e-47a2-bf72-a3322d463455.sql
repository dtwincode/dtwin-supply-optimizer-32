-- Fix component_demand_view: Correct CV calculation and add buffer status
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
    -- Calculate daily demand for CV calculation
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
  nfv.on_hand,
  nfv.nfp,
  bv.tor,
  bv.toy,
  bv.tog,
  CASE
    WHEN nfv.nfp IS NULL THEN NULL
    WHEN nfv.nfp <= bv.tor THEN 'RED'
    WHEN nfv.nfp <= bv.toy THEN 'YELLOW'
    ELSE 'GREEN'
  END as buffer_status
FROM component_stats cs
LEFT JOIN inventory_net_flow_view nfv 
  ON cs.component_product_id = nfv.product_id 
  AND cs.location_id = nfv.location_id
LEFT JOIN inventory_ddmrp_buffers_view bv
  ON cs.component_product_id = bv.product_id 
  AND cs.location_id = bv.location_id;

-- Create indexes for performance
CREATE INDEX idx_component_demand_adu ON component_demand_view(component_adu DESC);
CREATE INDEX idx_component_demand_product ON component_demand_view(component_product_id);
CREATE INDEX idx_component_demand_location ON component_demand_view(location_id);
CREATE INDEX idx_component_demand_category ON component_demand_view(component_category);
CREATE INDEX idx_component_demand_cv ON component_demand_view(demand_cv);

-- Grant access
GRANT SELECT ON component_demand_view TO authenticated;
GRANT SELECT ON component_demand_view TO anon;

-- Refresh the view
REFRESH MATERIALIZED VIEW component_demand_view;