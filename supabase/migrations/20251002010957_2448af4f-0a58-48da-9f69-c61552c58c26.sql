-- Update the scoring function to use all 6 criteria with weights from config table
CREATE OR REPLACE FUNCTION calculate_decoupling_score_v2(
  p_product_id text,
  p_location_id text,
  p_scenario_name text DEFAULT 'default'
) RETURNS jsonb AS $$
DECLARE
  v_weights RECORD;
  v_variability_score numeric := 0;
  v_criticality_score numeric := 0;
  v_holding_cost_score numeric := 0;
  v_supplier_reliability_score numeric := 0;
  v_lead_time_score numeric := 0;
  v_volume_score numeric := 0;
  v_total_score numeric := 0;
  v_result jsonb;
  v_variability text;
  v_criticality text;
  v_lead_time_days integer;
  v_price numeric;
  v_supplier_id text;
  v_reliability numeric;
  v_volume numeric;
  v_max_price numeric;
  v_max_lead_time integer;
  v_max_volume numeric;
BEGIN
  -- Get weights for scenario
  SELECT * INTO v_weights
  FROM decoupling_weights_config
  WHERE scenario_name = p_scenario_name AND is_active = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    -- Use default weights if no active scenario
    SELECT * INTO v_weights
    FROM decoupling_weights_config
    WHERE scenario_name = 'default'
    LIMIT 1;
  END IF;
  
  -- Get product classification data
  SELECT variability_level, criticality
  INTO v_variability, v_criticality
  FROM product_classification
  WHERE product_id = p_product_id AND location_id = p_location_id;
  
  -- 1. Variability Score (weighted by config)
  v_variability_score := CASE 
    WHEN LOWER(v_variability) = 'high' THEN 1.0
    WHEN LOWER(v_variability) = 'medium' THEN 0.6
    WHEN LOWER(v_variability) = 'low' THEN 0.2
    ELSE 0.5
  END;
  
  -- 2. Criticality Score (weighted by config)
  v_criticality_score := CASE 
    WHEN LOWER(v_criticality) = 'high' THEN 1.0
    WHEN LOWER(v_criticality) = 'medium' THEN 0.6
    WHEN LOWER(v_criticality) = 'low' THEN 0.2
    ELSE 0.5
  END;
  
  -- 3. Holding Cost Score (based on price percentile)
  SELECT price INTO v_price
  FROM "product_pricing-master"
  WHERE product_id = p_product_id
  ORDER BY effective_date DESC
  LIMIT 1;
  
  SELECT MAX(price) INTO v_max_price
  FROM "product_pricing-master";
  
  v_holding_cost_score := COALESCE(v_price / NULLIF(v_max_price, 0), 0.5);
  
  -- 4. Supplier Reliability Score
  SELECT supplier_id INTO v_supplier_id
  FROM product_master
  WHERE product_id = p_product_id;
  
  SELECT reliability_score INTO v_reliability
  FROM supplier_performance
  WHERE supplier_id = v_supplier_id;
  
  -- Lower reliability = higher need for decoupling (inverse)
  v_supplier_reliability_score := 1.0 - COALESCE(v_reliability, 0.85);
  
  -- 5. Lead Time Score
  SELECT actual_lead_time_days INTO v_lead_time_days
  FROM actual_lead_time
  WHERE product_id = p_product_id AND location_id = p_location_id;
  
  SELECT MAX(actual_lead_time_days) INTO v_max_lead_time
  FROM actual_lead_time;
  
  v_lead_time_score := COALESCE(v_lead_time_days::numeric / NULLIF(v_max_lead_time, 0), 0.5);
  
  -- 6. Volume Score (90-day average)
  SELECT SUM(quantity_sold) / 90.0 INTO v_volume
  FROM historical_sales_data
  WHERE product_id = p_product_id 
    AND location_id = p_location_id
    AND sales_date >= CURRENT_DATE - INTERVAL '90 days';
  
  SELECT MAX(avg_volume) INTO v_max_volume
  FROM (
    SELECT product_id, location_id, SUM(quantity_sold) / 90.0 as avg_volume
    FROM historical_sales_data
    WHERE sales_date >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY product_id, location_id
  ) vol;
  
  v_volume_score := COALESCE(v_volume / NULLIF(v_max_volume, 0), 0.5);
  
  -- Calculate weighted total score using weights from config
  v_total_score := (
    COALESCE(v_weights.variability_weight, 0.25) * v_variability_score +
    COALESCE(v_weights.criticality_weight, 0.25) * v_criticality_score +
    COALESCE(v_weights.holding_cost_weight, 0.20) * v_holding_cost_score +
    COALESCE(v_weights.supplier_reliability_weight, 0.10) * v_supplier_reliability_score +
    COALESCE(v_weights.lead_time_weight, 0.10) * v_lead_time_score +
    COALESCE(v_weights.volume_weight, 0.10) * v_volume_score
  );
  
  -- Build detailed result
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
    END,
    'breakdown', jsonb_build_object(
      'variability', jsonb_build_object(
        'raw_value', v_variability,
        'score', ROUND(v_variability_score, 4),
        'weight', v_weights.variability_weight,
        'contribution', ROUND(v_weights.variability_weight * v_variability_score, 4)
      ),
      'criticality', jsonb_build_object(
        'raw_value', v_criticality,
        'score', ROUND(v_criticality_score, 4),
        'weight', v_weights.criticality_weight,
        'contribution', ROUND(v_weights.criticality_weight * v_criticality_score, 4)
      ),
      'holding_cost', jsonb_build_object(
        'raw_value', v_price,
        'score', ROUND(v_holding_cost_score, 4),
        'weight', v_weights.holding_cost_weight,
        'contribution', ROUND(v_weights.holding_cost_weight * v_holding_cost_score, 4)
      ),
      'supplier_reliability', jsonb_build_object(
        'raw_value', v_reliability,
        'score', ROUND(v_supplier_reliability_score, 4),
        'weight', v_weights.supplier_reliability_weight,
        'contribution', ROUND(v_weights.supplier_reliability_weight * v_supplier_reliability_score, 4)
      ),
      'lead_time', jsonb_build_object(
        'raw_value', v_lead_time_days,
        'score', ROUND(v_lead_time_score, 4),
        'weight', v_weights.lead_time_weight,
        'contribution', ROUND(v_weights.lead_time_weight * v_lead_time_score, 4)
      ),
      'volume', jsonb_build_object(
        'raw_value', v_volume,
        'score', ROUND(v_volume_score, 4),
        'weight', v_weights.volume_weight,
        'contribution', ROUND(v_weights.volume_weight * v_volume_score, 4)
      )
    )
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;