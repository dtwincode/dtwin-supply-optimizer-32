-- Create execution_priority_view materialized view
-- This view calculates execution priority based on buffer penetration percentage
-- Following DDMRP principles: lower penetration = higher priority

CREATE MATERIALIZED VIEW IF NOT EXISTS public.execution_priority_view AS
SELECT 
  ipv.product_id,
  ipv.location_id,
  ipv.sku,
  ipv.product_name,
  ipv.category,
  ipv.subcategory,
  ipv.on_hand,
  ipv.on_order,
  ipv.qualified_demand,
  ipv.nfp,
  buf.tor,
  buf.toy,
  buf.tog,
  -- Calculate buffer penetration percentage
  CASE 
    WHEN buf.tor > 0 THEN (ipv.nfp / buf.tor) * 100
    ELSE 0
  END as buffer_penetration_pct,
  -- Assign execution priority based on DDMRP rules
  CASE
    WHEN ipv.nfp < buf.tor THEN 'CRITICAL'
    WHEN ipv.nfp < buf.toy THEN 'HIGH'
    WHEN ipv.nfp < buf.tog THEN 'MEDIUM'
    ELSE 'LOW'
  END as execution_priority,
  -- Calculate recommended order quantity (bring to TOG)
  GREATEST(0, buf.tog - ipv.nfp) as recommended_order_qty
FROM public.inventory_planning_view ipv
LEFT JOIN public.inventory_ddmrp_buffers_view buf 
  ON ipv.product_id = buf.product_id 
  AND ipv.location_id = buf.location_id
WHERE buf.tor IS NOT NULL 
  AND buf.toy IS NOT NULL 
  AND buf.tog IS NOT NULL
ORDER BY 
  -- Priority order: CRITICAL > HIGH > MEDIUM > LOW (repeat CASE for ORDER BY)
  CASE
    WHEN ipv.nfp < buf.tor THEN 1
    WHEN ipv.nfp < buf.toy THEN 2
    WHEN ipv.nfp < buf.tog THEN 3
    ELSE 4
  END,
  CASE 
    WHEN buf.tor > 0 THEN (ipv.nfp / buf.tor) * 100
    ELSE 0
  END ASC;

-- Create index for faster queries
CREATE UNIQUE INDEX IF NOT EXISTS execution_priority_view_pk 
  ON public.execution_priority_view(product_id, location_id);

CREATE INDEX IF NOT EXISTS execution_priority_view_priority_idx 
  ON public.execution_priority_view(execution_priority);

-- Enable RLS
ALTER MATERIALIZED VIEW public.execution_priority_view OWNER TO postgres;

-- Create refresh function
CREATE OR REPLACE FUNCTION public.refresh_execution_priority_view()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.execution_priority_view;
END;
$$;

-- Grant access to authenticated users
GRANT SELECT ON public.execution_priority_view TO authenticated;