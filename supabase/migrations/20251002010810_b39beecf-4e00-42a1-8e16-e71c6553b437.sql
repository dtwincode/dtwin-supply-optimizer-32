-- Fix the scoring function to handle case-insensitive matching
CREATE OR REPLACE FUNCTION calculate_decoupling_score_v2(
  p_product_id text,
  p_location_id text,
  p_scenario_name text DEFAULT 'default'
) RETURNS jsonb AS $$
DECLARE
  v_variability_score numeric := 0;
  v_criticality_score numeric := 0;
  v_total_score numeric := 0;
  v_result jsonb;
  v_variability text;
  v_criticality text;
BEGIN
  -- Get product classification data
  SELECT variability_level, criticality
  INTO v_variability, v_criticality
  FROM product_classification
  WHERE product_id = p_product_id AND location_id = p_location_id;
  
  -- Calculate variability score (0-1) - case insensitive
  v_variability_score := CASE 
    WHEN LOWER(v_variability) = 'high' THEN 1.0
    WHEN LOWER(v_variability) = 'medium' THEN 0.6
    WHEN LOWER(v_variability) = 'low' THEN 0.2
    ELSE 0.5
  END;
  
  -- Calculate criticality score (0-1) - case insensitive
  v_criticality_score := CASE 
    WHEN LOWER(v_criticality) = 'high' THEN 1.0
    WHEN LOWER(v_criticality) = 'medium' THEN 0.6
    WHEN LOWER(v_criticality) = 'low' THEN 0.2
    ELSE 0.5
  END;
  
  -- Simple weighted average (50% variability, 50% criticality)
  v_total_score := (v_variability_score * 0.5) + (v_criticality_score * 0.5);
  
  -- Build result
  v_result := jsonb_build_object(
    'product_id', p_product_id,
    'location_id', p_location_id,
    'total_score', ROUND(v_total_score, 4),
    'variability', v_variability,
    'variability_score', v_variability_score,
    'criticality', v_criticality,
    'criticality_score', v_criticality_score,
    'recommendation', CASE
      WHEN v_total_score >= 0.75 THEN 'auto_designate'
      WHEN v_total_score >= 0.50 THEN 'review_required'
      ELSE 'auto_reject'
    END
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;