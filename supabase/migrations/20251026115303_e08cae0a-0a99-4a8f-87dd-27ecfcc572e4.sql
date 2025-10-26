-- Fix Security Definer issue by converting non-critical functions to SECURITY INVOKER
-- Keep SECURITY DEFINER only for functions that genuinely need it (auth, audit)

-- Convert refresh_* functions to SECURITY INVOKER
-- These are data refresh functions that should run with the caller's privileges

ALTER FUNCTION public.refresh_component_demand_view() 
SECURITY INVOKER;

ALTER FUNCTION public.refresh_demand_history_analysis() 
SECURITY INVOKER;

ALTER FUNCTION public.refresh_execution_priority_view() 
SECURITY INVOKER;

ALTER FUNCTION public.refresh_usage_analysis() 
SECURITY INVOKER;

ALTER FUNCTION public.populate_demand_history_analysis() 
SECURITY INVOKER;

-- Note: The following functions remain SECURITY DEFINER as they need elevated privileges:
-- - has_role: Used for role-based access control, needs to bypass RLS on user_roles table
-- - handle_new_user: Auth trigger that needs to create profiles
-- - log_inventory_config_change: Audit function that needs to log regardless of user permissions

-- Add comments explaining why certain functions remain SECURITY DEFINER
COMMENT ON FUNCTION public.has_role(uuid, app_role) IS 
'SECURITY DEFINER required to check user roles without triggering RLS recursion';

COMMENT ON FUNCTION public.handle_new_user() IS 
'SECURITY DEFINER required for auth trigger to create user profiles';

COMMENT ON FUNCTION public.log_inventory_config_change() IS 
'SECURITY DEFINER required for audit logging to work regardless of user permissions';