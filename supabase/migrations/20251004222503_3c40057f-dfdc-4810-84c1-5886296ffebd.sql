-- Drop the existing view and function
DROP VIEW IF EXISTS component_demand_view CASCADE;
DROP FUNCTION IF EXISTS explode_finished_goods_demand CASCADE;

-- Create a MATERIALIZED VIEW for better performance
CREATE MATERIALIZED VIEW component_demand_view AS
WITH sales_90d AS (
  SELECT 
    product_id,
    location_id,
    SUM(quantity_sold) as total_qty,
    AVG(quantity_sold) as avg_qty,
    STDDEV(quantity_sold) as stddev_qty,
    COUNT(DISTINCT sales_date) as days_with_sales
  FROM historical_sales_data
  WHERE sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY product_id, location_id
),
exploded_demand AS (
  SELECT 
    bom.child_product_id as component_product_id,
    s.location_id,
    SUM(s.total_qty * bom.quantity_per) as total_component_demand,
    COUNT(DISTINCT bom.parent_product_id) as num_finished_goods,
    array_agg(DISTINCT pm_parent.sku) as finished_good_skus
  FROM sales_90d s
  JOIN product_bom bom ON s.product_id = bom.parent_product_id
  JOIN product_master pm_parent ON bom.parent_product_id = pm_parent.product_id
  GROUP BY bom.child_product_id, s.location_id
)
SELECT 
  ed.component_product_id,
  pm.sku as component_sku,
  pm.name as component_name,
  pm.category as component_category,
  ed.location_id,
  (ed.total_component_demand / 90.0)::numeric(10,2) as component_adu,
  ed.total_component_demand as total_demand_90d,
  90 as window_days,
  ed.num_finished_goods as num_finished_goods_using,
  ed.finished_good_skus as used_in_finished_goods,
  NULL::numeric as days_with_demand,
  CASE 
    WHEN ed.total_component_demand > 0 AND s.stddev_qty > 0
    THEN ((s.stddev_qty * SQRT(ed.num_finished_goods::float)) / (ed.total_component_demand / 90.0))::numeric(10,3)
    ELSE 0 
  END as demand_cv,
  CASE 
    WHEN ed.total_component_demand > 0 AND s.stddev_qty > 0
    THEN ((s.stddev_qty * SQRT(ed.num_finished_goods::float)) / (ed.total_component_demand / 90.0)) > 0.5
    ELSE false 
  END as high_variability
FROM exploded_demand ed
JOIN product_master pm ON ed.component_product_id = pm.product_id
LEFT JOIN sales_90d s ON ed.component_product_id = s.product_id AND ed.location_id = s.location_id
WHERE pm.category IN ('Raw Materials', 'Components');

-- Create indexes on the materialized view for fast queries
CREATE INDEX idx_component_demand_adu ON component_demand_view(component_adu DESC);
CREATE INDEX idx_component_demand_product ON component_demand_view(component_product_id);
CREATE INDEX idx_component_demand_location ON component_demand_view(location_id);
CREATE INDEX idx_component_demand_category ON component_demand_view(component_category);

-- Create a function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_component_demand_view()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW component_demand_view;
END;
$$;

-- Initial refresh
REFRESH MATERIALIZED VIEW component_demand_view;