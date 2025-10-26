-- Fix Function Search Path Mutable security issue (Part 1 of 2)
-- Set search_path = public for all functions to prevent potential security exploits

ALTER FUNCTION public.activate_hierarchy_mapping(p_mapping_id uuid) 
SET search_path = public;

ALTER FUNCTION public.activate_hierarchy_version(p_hierarchy_type text, p_version integer) 
SET search_path = public;

ALTER FUNCTION public.assign_buffer_profiles_by_classification() 
SET search_path = public;

ALTER FUNCTION public.auto_designate_with_scoring_v2(p_threshold numeric, p_scenario_name text) 
SET search_path = public;

ALTER FUNCTION public.auto_trigger_ltaf_on_variance() 
SET search_path = public;

ALTER FUNCTION public.calculate_8factor_weighted_score(p_product_id text, p_location_id text) 
SET search_path = public;

ALTER FUNCTION public.calculate_criticality_score(p_product_id text) 
SET search_path = public;

ALTER FUNCTION public.calculate_decoupling_score_v2(p_product_id text, p_location_id text, p_scenario_name text) 
SET search_path = public;

ALTER FUNCTION public.calculate_holding_cost_score(p_product_id text) 
SET search_path = public;

ALTER FUNCTION public.calculate_lead_time_score(p_product_id text, p_location_id text) 
SET search_path = public;

ALTER FUNCTION public.calculate_moq_rigidity_score(p_product_id text) 
SET search_path = public;

ALTER FUNCTION public.calculate_storage_intensity_score(p_product_id text) 
SET search_path = public;

ALTER FUNCTION public.calculate_supplier_reliability_score(p_supplier_id text) 
SET search_path = public;

ALTER FUNCTION public.calculate_variability_score(p_product_id text, p_location_id text) 
SET search_path = public;

ALTER FUNCTION public.calculate_volume_score(p_product_id text, p_location_id text) 
SET search_path = public;

ALTER FUNCTION public.check_decoupling_buffer_alignment() 
SET search_path = public;

ALTER FUNCTION public.cleanup_unused_hierarchy_mappings() 
SET search_path = public;

ALTER FUNCTION public.ddmrp_nightly() 
SET search_path = public;

ALTER FUNCTION public.detect_buffer_breaches() 
SET search_path = public;

ALTER FUNCTION public.detect_buffer_breaches_v2() 
SET search_path = public;

ALTER FUNCTION public.detect_lead_time_variance() 
SET search_path = public;