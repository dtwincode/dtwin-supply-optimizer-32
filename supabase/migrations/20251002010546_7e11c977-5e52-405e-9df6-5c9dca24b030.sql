-- Drop existing functions
DROP FUNCTION IF EXISTS public.auto_designate_with_scoring_v2(numeric, text);
DROP FUNCTION IF EXISTS public.calculate_decoupling_score_v2(text, text, text);

-- Create simplified scoring function
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
  
  -- Calculate variability score (0-1)
  v_variability_score := CASE 
    WHEN v_variability = 'high' THEN 1.0
    WHEN v_variability = 'medium' THEN 0.6
    WHEN v_variability = 'low' THEN 0.2
    ELSE 0.5
  END;
  
  -- Calculate criticality score (0-1)
  v_criticality_score := CASE 
    WHEN v_criticality = 'high' THEN 1.0
    WHEN v_criticality = 'medium' THEN 0.6
    WHEN v_criticality = 'low' THEN 0.2
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
    'criticality', v_criticality,
    'recommendation', CASE
      WHEN v_total_score >= 0.75 THEN 'auto_designate'
      WHEN v_total_score >= 0.50 THEN 'review_required'
      ELSE 'auto_reject'
    END
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Create auto-designate function
CREATE OR REPLACE FUNCTION auto_designate_with_scoring_v2(
  p_threshold numeric DEFAULT 0.75,
  p_scenario_name text DEFAULT 'default'
) RETURNS jsonb AS $$
DECLARE
  v_result jsonb;
  v_designated integer := 0;
  v_reviewed integer := 0;
  v_rejected integer := 0;
  v_scoring_results jsonb := '[]'::jsonb;
  v_pair RECORD;
  v_score_result jsonb;
BEGIN
  -- Loop through product-location pairs that aren't already decoupling points
  FOR v_pair IN 
    SELECT DISTINCT p.product_id, l.location_id
    FROM product_master p
    CROSS JOIN location_master l
    WHERE NOT EXISTS (
      SELECT 1 FROM decoupling_points dp 
      WHERE dp.product_id = p.product_id 
      AND dp.location_id = l.location_id
    )
    LIMIT 100
  LOOP
    -- Calculate score
    v_score_result := calculate_decoupling_score_v2(
      v_pair.product_id, 
      v_pair.location_id, 
      p_scenario_name
    );
    
    v_scoring_results := v_scoring_results || v_score_result;
    
    -- Auto-designate if score meets threshold
    IF (v_score_result->>'total_score')::numeric >= p_threshold THEN
      INSERT INTO decoupling_points (
        product_id, 
        location_id, 
        buffer_profile_id, 
        is_strategic,
        designation_reason
      )
      SELECT 
        v_pair.product_id,
        v_pair.location_id,
        COALESCE(pm.buffer_profile_id, 'BP_DEFAULT'),
        true,
        format('Auto-designated: Score %.2f (Variability: %s, Criticality: %s)', 
          (v_score_result->>'total_score')::numeric,
          v_score_result->>'variability',
          v_score_result->>'criticality'
        )
      FROM product_master pm
      WHERE pm.product_id = v_pair.product_id
      ON CONFLICT (product_id, location_id) DO NOTHING;
      
      v_designated := v_designated + 1;
    ELSIF (v_score_result->>'total_score')::numeric >= 0.50 THEN
      v_reviewed := v_reviewed + 1;
    ELSE
      v_rejected := v_rejected + 1;
    END IF;
  END LOOP;
  
  -- Build summary
  v_result := jsonb_build_object(
    'summary', jsonb_build_object(
      'total_analyzed', v_designated + v_reviewed + v_rejected,
      'auto_designated', v_designated,
      'review_required', v_reviewed,
      'auto_rejected', v_rejected,
      'threshold_used', p_threshold,
      'scenario', p_scenario_name
    ),
    'scoring_details', v_scoring_results
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;