
-- Recreate inventory_net_flow_view that was dropped by CASCADE
CREATE OR REPLACE VIEW public.inventory_net_flow_view AS
SELECT
  b.product_id,
  b.location_id,
  COALESCE(oh.qty_on_hand, 0) as on_hand,
  COALESCE(oo.qty_on_order, 0) as on_order,
  COALESCE(qd.qualified_demand, 0) as qualified_demand,
  (COALESCE(oh.qty_on_hand, 0) + COALESCE(oo.qty_on_order, 0) - COALESCE(qd.qualified_demand, 0)) as nfp
FROM public.inventory_ddmrp_buffers_view b
LEFT JOIN public.onhand_latest_view oh
  ON b.product_id = oh.product_id AND b.location_id = oh.location_id
LEFT JOIN public.onorder_view oo
  ON b.product_id = oo.product_id AND b.location_id = oo.location_id
LEFT JOIN (
  SELECT
    product_id,
    location_id,
    SUM(qty) as qualified_demand
  FROM public.open_so
  WHERE status = 'CONFIRMED'
  GROUP BY product_id, location_id
) qd ON b.product_id = qd.product_id AND b.location_id = qd.location_id;

COMMENT ON VIEW public.inventory_net_flow_view IS 
'Real-time Net Flow Position (NFP) calculation: On Hand + On Order - Qualified Demand';
