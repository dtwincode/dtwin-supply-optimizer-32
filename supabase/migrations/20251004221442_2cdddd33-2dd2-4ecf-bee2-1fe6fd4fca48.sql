-- Create component_demand_view: Explodes finished goods sales to component demand
-- Following DDMRP Chapter 9 leading practice for decoupled explosion

CREATE OR REPLACE VIEW component_demand_view AS
WITH exploded_demand AS (
  SELECT 
    bom.child_product_id as component_product_id,
    hsd.location_id,
    hsd.sales_date,
    -- Explode: Finished Good Qty × BOM quantity_per = Component Demand
    (hsd.quantity_sold * bom.quantity_per) as component_qty_required,
    pm_child.sku as component_sku,
    pm_child.name as component_name,
    pm_child.category as component_category,
    pm_parent.product_id as finished_good_id,
    pm_parent.sku as finished_good_sku,
    pm_parent.name as finished_good_name
  FROM historical_sales_data hsd
  -- Join to BOM to get components
  INNER JOIN product_bom bom ON hsd.product_id = bom.parent_product_id
  -- Get component details
  INNER JOIN product_master pm_child ON bom.child_product_id = pm_child.product_id
  -- Get finished good details
  INNER JOIN product_master pm_parent ON hsd.product_id = pm_parent.product_id
  WHERE 
    pm_parent.product_type = 'FINISHED_GOOD'
    AND pm_child.product_type IN ('RAW_MATERIAL', 'PACKAGING')
    AND hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
),
component_adu_90d AS (
  SELECT
    component_product_id,
    location_id,
    component_sku,
    component_name,
    component_category,
    -- Calculate Component ADU over 90 days
    ROUND(SUM(component_qty_required) / 90.0, 4) as component_adu,
    SUM(component_qty_required) as total_demand_90d,
    COUNT(DISTINCT sales_date) as days_with_demand,
    COUNT(DISTINCT finished_good_id) as num_finished_goods_using,
    -- Aggregate finished goods that use this component
    array_agg(DISTINCT finished_good_name ORDER BY finished_good_name) as used_in_finished_goods
  FROM exploded_demand
  GROUP BY 
    component_product_id,
    location_id,
    component_sku,
    component_name,
    component_category
)
SELECT 
  cadu.*,
  -- Calculate demand variability (CV)
  CASE 
    WHEN cadu.component_adu > 0 THEN
      ROUND(
        STDDEV(ed.component_qty_required) / NULLIF(AVG(ed.component_qty_required), 0),
        4
      )
    ELSE 0
  END as demand_cv,
  -- Flag high variability components
  CASE 
    WHEN STDDEV(ed.component_qty_required) / NULLIF(AVG(ed.component_qty_required), 0) > 0.5 
    THEN true ELSE false 
  END as high_variability
FROM component_adu_90d cadu
LEFT JOIN exploded_demand ed 
  ON cadu.component_product_id = ed.component_product_id
  AND cadu.location_id = ed.location_id
GROUP BY 
  cadu.component_product_id,
  cadu.location_id,
  cadu.component_sku,
  cadu.component_name,
  cadu.component_category,
  cadu.component_adu,
  cadu.total_demand_90d,
  cadu.days_with_demand,
  cadu.num_finished_goods_using,
  cadu.used_in_finished_goods;

-- Create function to explode finished goods demand (for testing/debugging)
CREATE OR REPLACE FUNCTION explode_finished_goods_demand(
  p_product_id TEXT DEFAULT NULL,
  p_location_id TEXT DEFAULT NULL
)
RETURNS TABLE(
  component_product_id TEXT,
  component_sku TEXT,
  component_name TEXT,
  location_id TEXT,
  component_adu NUMERIC,
  total_demand_90d NUMERIC,
  num_finished_goods_using BIGINT,
  used_in_finished_goods TEXT[],
  demand_cv NUMERIC,
  high_variability BOOLEAN
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    cdv.component_product_id,
    cdv.component_sku,
    cdv.component_name,
    cdv.location_id,
    cdv.component_adu,
    cdv.total_demand_90d,
    cdv.num_finished_goods_using,
    cdv.used_in_finished_goods,
    cdv.demand_cv,
    cdv.high_variability
  FROM component_demand_view cdv
  WHERE 
    (p_product_id IS NULL OR cdv.component_product_id = p_product_id)
    AND (p_location_id IS NULL OR cdv.location_id = p_location_id)
  ORDER BY cdv.component_adu DESC;
$$;

COMMENT ON VIEW component_demand_view IS 
'DDMRP Chapter 9: Explodes finished goods sales through BOM to calculate component-level ADU. 
This enables buffering at the component level (leading practice for make-to-order environments).';

COMMENT ON FUNCTION explode_finished_goods_demand IS
'Helper function to query exploded component demand with optional filters for product and location.';