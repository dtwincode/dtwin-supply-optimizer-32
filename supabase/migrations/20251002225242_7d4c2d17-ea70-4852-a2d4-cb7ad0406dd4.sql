-- Phase 1: Governance Validation Function
CREATE OR REPLACE FUNCTION public.validate_buffer_decoupling_alignment(
  p_product_id text,
  p_location_id text
)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_has_decoupling boolean;
  v_has_buffer boolean;
  v_result jsonb;
  v_issues text[] := '{}';
  v_recommendations text[] := '{}';
BEGIN
  -- Check if decoupling point exists
  SELECT EXISTS (
    SELECT 1 FROM decoupling_points
    WHERE product_id = p_product_id AND location_id = p_location_id
  ) INTO v_has_decoupling;
  
  -- Check if buffer profile is assigned (via product_master or direct override)
  SELECT EXISTS (
    SELECT 1 FROM product_master pm
    WHERE pm.product_id = p_product_id 
    AND pm.buffer_profile_id IS NOT NULL
    AND pm.buffer_profile_id != 'BP_DEFAULT'
  ) INTO v_has_buffer;
  
  -- Validate alignment
  IF v_has_decoupling AND NOT v_has_buffer THEN
    v_issues := array_append(v_issues, 'empty_decouple');
    v_recommendations := array_append(v_recommendations, 'Add buffer profile to complete decoupling setup');
  ELSIF v_has_buffer AND NOT v_has_decoupling THEN
    v_issues := array_append(v_issues, 'orphan_buffer');
    v_recommendations := array_append(v_recommendations, 'Promote location to decoupling point OR remove buffer profile');
  END IF;
  
  v_result := jsonb_build_object(
    'aligned', (array_length(v_issues, 1) IS NULL),
    'has_decoupling', v_has_decoupling,
    'has_buffer', v_has_buffer,
    'issues', v_issues,
    'recommendations', v_recommendations
  );
  
  RETURN v_result;
END;
$$;

-- Validation trigger function for decoupling_points
CREATE OR REPLACE FUNCTION public.check_decoupling_buffer_alignment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_has_buffer boolean;
BEGIN
  -- Check if product has a valid buffer profile
  SELECT EXISTS (
    SELECT 1 FROM product_master
    WHERE product_id = NEW.product_id
    AND buffer_profile_id IS NOT NULL
    AND buffer_profile_id != 'BP_DEFAULT'
  ) INTO v_has_buffer;
  
  IF NOT v_has_buffer THEN
    RAISE WARNING 'Decoupling point created without buffer profile for product % at location %. Consider assigning a buffer profile.', 
      NEW.product_id, NEW.location_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on decoupling_points
DROP TRIGGER IF EXISTS validate_decoupling_alignment ON public.decoupling_points;
CREATE TRIGGER validate_decoupling_alignment
  AFTER INSERT OR UPDATE ON public.decoupling_points
  FOR EACH ROW
  EXECUTE FUNCTION public.check_decoupling_buffer_alignment();

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.validate_buffer_decoupling_alignment(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_decoupling_buffer_alignment() TO authenticated;