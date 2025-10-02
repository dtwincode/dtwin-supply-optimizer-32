-- Fix inventory_net_flow_view with correct column names
CREATE OR REPLACE VIEW inventory_net_flow_view AS
SELECT
  p.product_id,
  l.location_id,
  
  -- On-hand inventory
  COALESCE(oh.qty_on_hand, 0) AS on_hand,
  
  -- On-order (open POs - using correct column name)
  COALESCE(oo.qty_on_order, 0) AS on_order,
  
  -- Qualified demand (from open sales orders - using 'qty' not 'ordered_qty')
  COALESCE(so.qualified_demand, 0) AS qualified_demand,
  
  -- Net Flow Position = On-hand + On-order - Qualified Demand
  COALESCE(oh.qty_on_hand, 0) + 
  COALESCE(oo.qty_on_order, 0) - 
  COALESCE(so.qualified_demand, 0) AS nfp

FROM product_master p
CROSS JOIN location_master l
LEFT JOIN onhand_latest_view oh ON p.product_id = oh.product_id AND l.location_id = oh.location_id
LEFT JOIN onorder_view oo ON p.product_id = oo.product_id AND l.location_id = oo.location_id
LEFT JOIN (
  SELECT 
    product_id,
    location_id,
    SUM(qty) AS qualified_demand
  FROM open_so
  WHERE status IN ('OPEN', 'CONFIRMED')
  GROUP BY product_id, location_id
) so ON p.product_id = so.product_id AND l.location_id = so.location_id;

-- Create inventory_planning_view (depends on inventory_net_flow_view)
CREATE OR REPLACE VIEW inventory_planning_view AS
SELECT
  buf.product_id,
  buf.sku,
  buf.product_name,
  buf.category,
  buf.subcategory,
  buf.location_id,
  buf.region,
  buf.channel_id,
  buf.buffer_profile_id,
  buf.adu AS average_daily_usage,
  buf.dlt AS lead_time_days,
  nf.on_hand,
  nf.on_order,
  nf.qualified_demand,
  nf.nfp,
  buf.red_zone,
  buf.yellow_zone,
  buf.green_zone,
  buf.tor,
  buf.toy,
  buf.tog,
  buf.moq AS min_order_qty,
  buf.rounding_multiple,
  
  -- Buffer Status Logic
  CASE
    WHEN nf.nfp <= buf.tor THEN 'RED'
    WHEN nf.nfp <= buf.toy THEN 'YELLOW'
    WHEN nf.nfp <= buf.tog THEN 'GREEN'
    ELSE 'OVER'
  END AS buffer_status,
  
  -- Min/Max for legacy compatibility
  buf.tor AS min_stock_level,
  buf.tog AS max_stock_level,
  buf.toy AS reorder_level,
  
  -- Current stock level (on-hand)
  nf.on_hand AS current_stock_level,
  
  -- Decoupling point indicator
  COALESCE(dp.is_strategic, false) AS decoupling_point,
  
  -- Demand variability (from buffer profile)
  buf.variability_factor AS demand_variability

FROM inventory_ddmrp_buffers_view buf
LEFT JOIN inventory_net_flow_view nf USING (product_id, location_id)
LEFT JOIN decoupling_points dp ON buf.product_id = dp.product_id AND buf.location_id = dp.location_id;