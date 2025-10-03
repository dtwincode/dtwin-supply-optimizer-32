-- Fix Security Definer View vulnerability by enabling RLS on all views
-- This ensures views respect the security policies of their underlying tables

-- Enable RLS on all views
ALTER VIEW public.adu_90d_view SET (security_invoker = true);
ALTER VIEW public.daily_sales_base SET (security_invoker = true);
ALTER VIEW public.inventory_ddmrp_buffers_view SET (security_invoker = true);
ALTER VIEW public.inventory_net_flow_view SET (security_invoker = true);
ALTER VIEW public.inventory_planning_view SET (security_invoker = true);
ALTER VIEW public.onhand_latest_view SET (security_invoker = true);
ALTER VIEW public.onorder_view SET (security_invoker = true);
ALTER VIEW public.service_level_config SET (security_invoker = true);
ALTER VIEW public.trend_factor_view SET (security_invoker = true);

-- Grant SELECT access to authenticated users (since underlying tables already have policies)
GRANT SELECT ON public.adu_90d_view TO authenticated;
GRANT SELECT ON public.daily_sales_base TO authenticated;
GRANT SELECT ON public.inventory_ddmrp_buffers_view TO authenticated;
GRANT SELECT ON public.inventory_net_flow_view TO authenticated;
GRANT SELECT ON public.inventory_planning_view TO authenticated;
GRANT SELECT ON public.onhand_latest_view TO authenticated;
GRANT SELECT ON public.onorder_view TO authenticated;
GRANT SELECT ON public.service_level_config TO authenticated;
GRANT SELECT ON public.trend_factor_view TO authenticated;