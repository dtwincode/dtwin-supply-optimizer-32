-- Fix the remaining Security Definer Views by adding security_invoker option
-- This ensures views run with the privileges of the user querying them, not the view creator

-- Fix ddmrp_compliance_summary view
ALTER VIEW public.ddmrp_compliance_summary SET (security_invoker = true);

-- Fix inventory_ddmrp_buffers_view
ALTER VIEW public.inventory_ddmrp_buffers_view SET (security_invoker = true);

-- Add comments explaining the security model
COMMENT ON VIEW public.ddmrp_compliance_summary IS 
'SECURITY INVOKER view - executes with querying user privileges and enforces RLS from underlying tables';

COMMENT ON VIEW public.inventory_ddmrp_buffers_view IS 
'SECURITY INVOKER view - executes with querying user privileges and enforces RLS from underlying tables';