-- Create buffer_status_summary view for DDMRP Planner Workbench
CREATE OR REPLACE VIEW buffer_status_summary AS
SELECT
  COUNT(*) FILTER (WHERE buffer_status = 'RED') as red_count,
  COUNT(*) FILTER (WHERE buffer_status = 'YELLOW') as yellow_count,
  COUNT(*) FILTER (WHERE buffer_status = 'GREEN') as green_count,
  COUNT(*) FILTER (WHERE buffer_status = 'BLUE') as blue_count,
  COUNT(*) as total_count
FROM inventory_planning_view;

-- Create execution_priority_view for enhanced execution dashboard
CREATE OR REPLACE VIEW execution_priority_view AS
SELECT
  ipv.product_id,
  ipv.location_id,
  ipv.sku,
  ipv.product_name,
  ipv.category,
  ipv.nfp,
  ipv.on_hand,
  ipv.on_order,
  ipv.qualified_demand,
  ipv.red_zone,
  ipv.yellow_zone,
  ipv.green_zone,
  ipv.tor,
  ipv.toy,
  ipv.tog,
  ipv.lead_time_days,
  -- Calculate buffer penetration percentage
  CASE 
    WHEN (ipv.tor + ipv.yellow_zone + ipv.green_zone) > 0 
    THEN ROUND((ipv.nfp::numeric / NULLIF(ipv.tor + ipv.yellow_zone + ipv.green_zone, 0)) * 100, 2)
    ELSE 0
  END as buffer_penetration_pct,
  -- Determine execution priority based on buffer penetration
  CASE
    WHEN ipv.nfp <= ipv.tor THEN 'CRITICAL'
    WHEN ipv.nfp <= ipv.toy THEN 'HIGH'
    WHEN ipv.nfp <= ipv.tog THEN 'MEDIUM'
    ELSE 'LOW'
  END as execution_priority,
  -- Color coding for visual priority
  CASE
    WHEN ipv.nfp < ipv.tor * 0.5 THEN 'DEEP_RED'
    WHEN ipv.nfp <= ipv.tor THEN 'RED'
    WHEN ipv.nfp <= ipv.toy THEN 'YELLOW'
    ELSE 'GREEN'
  END as priority_color,
  -- Projected on-hand (current + on order)
  ipv.on_hand + ipv.on_order as projected_on_hand,
  -- Alert flags
  ipv.nfp <= ipv.tor as critical_alert,
  ipv.on_hand < ipv.red_zone as current_oh_alert,
  (ipv.on_hand + ipv.on_order) < ipv.tor as projected_oh_alert
FROM inventory_planning_view ipv
WHERE ipv.decoupling_point = true
ORDER BY buffer_penetration_pct ASC;