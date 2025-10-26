-- Fix Function Search Path Mutable security issue (Part 2 of 2)
-- Set search_path = public for remaining functions

ALTER FUNCTION public.drop_hierarchy_column(p_table_name text, p_column_name text) 
SET search_path = public;

ALTER FUNCTION public.generate_replenishment(location_id_filter text) 
SET search_path = public;

ALTER FUNCTION public.get_inventory_planning_data() 
SET search_path = public;

ALTER FUNCTION public.get_product_classifications() 
SET search_path = public;

ALTER FUNCTION public.get_threshold_config() 
SET search_path = public;

ALTER FUNCTION public.handle_updated_at() 
SET search_path = public;

ALTER FUNCTION public.integrate_forecast_data() 
SET search_path = public;

ALTER FUNCTION public.process_hierarchy_configuration(p_table_name text, p_selected_columns text[], p_mappings jsonb) 
SET search_path = public;

ALTER FUNCTION public.recalculate_buffers_with_adjustments(p_product_id text, p_location_id text, p_triggered_by text) 
SET search_path = public;

ALTER FUNCTION public.refresh_component_demand_view() 
SET search_path = public;

ALTER FUNCTION public.refresh_execution_priority_view() 
SET search_path = public;

ALTER FUNCTION public.remove_unselected_columns(p_table_name text, p_selected_columns text[]) 
SET search_path = public;

ALTER FUNCTION public.update_integrated_forecast_updated_at() 
SET search_path = public;

ALTER FUNCTION public.update_inventory_snapshot_ts() 
SET search_path = public;

ALTER FUNCTION public.update_performance_tracking() 
SET search_path = public;

ALTER FUNCTION public.update_permanent_hierarchy_updated_at() 
SET search_path = public;

ALTER FUNCTION public.update_threshold_bayesian() 
SET search_path = public;

ALTER FUNCTION public.update_updated_at_column() 
SET search_path = public;

ALTER FUNCTION public.validate_buffer_criteria(p_product_id text, p_location_id text) 
SET search_path = public;

ALTER FUNCTION public.validate_buffer_decoupling_alignment(p_product_id text, p_location_id text) 
SET search_path = public;

ALTER FUNCTION public.validate_forecast_mapping(p_historical_mapping jsonb, p_product_mapping jsonb, p_location_mapping jsonb) 
SET search_path = public;

ALTER FUNCTION public.validate_on_hand_inventory() 
SET search_path = public;

ALTER FUNCTION public.validate_open_pos() 
SET search_path = public;

ALTER FUNCTION public.validate_open_so() 
SET search_path = public;

-- Add audit comment
COMMENT ON SCHEMA public IS 
'All functions now have search_path=public to prevent search path manipulation security vulnerabilities';