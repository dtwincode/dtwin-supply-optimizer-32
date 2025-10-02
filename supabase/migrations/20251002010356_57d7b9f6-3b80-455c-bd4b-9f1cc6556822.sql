-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS public.auto_designate_with_scoring_v2(numeric, text);
DROP FUNCTION IF EXISTS public.calculate_decoupling_score_v2(text, text, text);

-- Create supplier_performance table for reliability tracking
CREATE TABLE IF NOT EXISTS supplier_performance (
  supplier_id text PRIMARY KEY REFERENCES vendor_master(vendor_id),
  on_time_delivery_rate numeric DEFAULT 0.95 CHECK (on_time_delivery_rate >= 0 AND on_time_delivery_rate <= 1),
  quality_score numeric DEFAULT 0.90 CHECK (quality_score >= 0 AND quality_score <= 1),
  reliability_score numeric GENERATED ALWAYS AS ((on_time_delivery_rate * 0.6) + (quality_score * 0.4)) STORED,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Add holding cost rate to buffer_config
INSERT INTO buffer_config (key, value) 
VALUES ('annual_holding_cost_rate', 0.20)
ON CONFLICT (key) DO NOTHING;

-- Create decoupling weights configuration table
CREATE TABLE IF NOT EXISTS decoupling_weights_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_name text NOT NULL UNIQUE,
  variability_weight numeric DEFAULT 0.25 CHECK (variability_weight >= 0 AND variability_weight <= 1),
  criticality_weight numeric DEFAULT 0.25 CHECK (criticality_weight >= 0 AND criticality_weight <= 1),
  holding_cost_weight numeric DEFAULT 0.20 CHECK (holding_cost_weight >= 0 AND holding_cost_weight <= 1),
  supplier_reliability_weight numeric DEFAULT 0.10 CHECK (supplier_reliability_weight >= 0 AND supplier_reliability_weight <= 1),
  lead_time_weight numeric DEFAULT 0.10 CHECK (lead_time_weight >= 0 AND lead_time_weight <= 1),
  volume_weight numeric DEFAULT 0.10 CHECK (volume_weight >= 0 AND volume_weight <= 1),
  is_active boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default weight scenario
INSERT INTO decoupling_weights_config (
  scenario_name, 
  variability_weight, 
  criticality_weight, 
  holding_cost_weight, 
  supplier_reliability_weight, 
  lead_time_weight, 
  volume_weight,
  is_active
) VALUES (
  'default',
  0.25, 0.25, 0.20, 0.10, 0.10, 0.10,
  true
) ON CONFLICT (scenario_name) DO NOTHING;

-- Create function to calculate decoupling score using 6 criteria
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
  v_price_percentile numeric;
  v_lead_time_percentile numeric;
  v_volume_percentile numeric;
BEGIN
  -- Get weights for scenario
  SELECT * INTO v_weights
  FROM decoupling_weights_config
  WHERE scenario_name = p_scenario_name AND is_active = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    v_weights := ROW(
      gen_random_uuid(), 'default', 0.25, 0.25, 0.20, 0.10, 0.10, 0.10, 
      true, now(), now()
    )::decoupling_weights_config;
  END IF;
  
  -- Get product classification data
  SELECT variability_level, criticality
  INTO v_variability, v_criticality
  FROM product_classification
  WHERE product_id = p_product_id AND location_id = p_location_id;
  
  -- Get lead time
  SELECT COALESCE(actual_lead_time_days, 7)
  INTO v_lead_time_days
  FROM actual_lead_time
  WHERE product_id = p_product_id AND location_id = p_location_id;
  
  IF v_lead_time_days IS NULL THEN
    v_lead_time_days := 7;
  END IF;
  
  -- Get product price and supplier (fixed table name)
  SELECT p.price, pm.supplier_id
  INTO v_price, v_supplier_id
  FROM product_master pm
  LEFT JOIN "product_pricing-master" p ON pm.product_id = p.product_id
  WHERE pm.product_id = p_product_id
  ORDER BY p.effective_date DESC
  LIMIT 1;
  
  -- Get supplier reliability
  SELECT COALESCE(reliability_score, 0.85)
  INTO v_reliability
  FROM supplier_performance
  WHERE supplier_id = v_supplier_id;
  
  IF v_reliability IS NULL THEN
    v_reliability := 0.85;
  END IF;
  
  -- Get volume (90-day average)
  SELECT COALESCE(SUM(quantity_sold) / 90.0, 0)
  INTO v_volume
  FROM historical_sales_data
  WHERE product_id = p_product_id 
    AND location_id = p_location_id
    AND sales_date >= CURRENT_DATE - INTERVAL '90 days';
  
  -- Calculate scores
  v_variability_score := CASE 
    WHEN v_variability = 'high' THEN 1.0
    WHEN v_variability = 'medium' THEN 0.6
    WHEN v_variability = 'low' THEN 0.2
    ELSE 0.5
  END;
  
  v_criticality_score := CASE 
    WHEN v_criticality = 'high' THEN 1.0
    WHEN v_criticality = 'medium' THEN 0.6
    WHEN v_criticality = 'low' THEN 0.2
    ELSE 0.5
  END;
  
  v_holding_cost_score := COALESCE(v_price / NULLIF((SELECT MAX(price) FROM "product_pricing-master"), 0), 0.5);
  v_supplier_reliability_score := 1.0 - v_reliability;
  v_lead_time_score := COALESCE(v_lead_time_days / NULLIF((SELECT MAX(actual_lead_time_days) FROM actual_lead_time), 0), 0.5);
  v_volume_score := COALESCE(v_volume / NULLIF((SELECT MAX(SUM(quantity_sold) / 90.0) FROM historical_sales_data WHERE sales_date >= CURRENT_DATE - INTERVAL '90 days' GROUP BY product_id, location_id), 0), 0.5);
  
  -- Calculate weighted total score
  v_total_score := (
    v_weights.variability_weight * v_variability_score +
    v_weights.criticality_weight * v_criticality_score +
    v_weights.holding_cost_weight * v_holding_cost_score +
    v_weights.supplier_reliability_weight * v_supplier_reliability_score +
    v_weights.lead_time_weight * v_lead_time_score +
    v_weights.volume_weight * v_volume_score
  );
  
  v_result := jsonb_build_object(
    'product_id', p_product_id,
    'location_id', p_location_id,
    'total_score', ROUND(v_total_score, 4),
    'recommendation', CASE
      WHEN v_total_score >= 0.75 THEN 'auto_designate'
      WHEN v_total_score >= 0.50 THEN 'review_required'
      ELSE 'auto_reject'
    END
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-designate decoupling points
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
  FOR v_pair IN 
    SELECT DISTINCT p.product_id, l.location_id
    FROM product_master p
    CROSS JOIN location_master l
    WHERE NOT EXISTS (
      SELECT 1 FROM decoupling_points dp 
      WHERE dp.product_id = p.product_id 
      AND dp.location_id = l.location_id
    )
    LIMIT 50
  LOOP
    v_score_result := calculate_decoupling_score_v2(
      v_pair.product_id, 
      v_pair.location_id, 
      p_scenario_name
    );
    
    v_scoring_results := v_scoring_results || v_score_result;
    
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
        format('Auto-designated: Score %.2f', (v_score_result->>'total_score')::numeric)
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

-- Populate sample supplier performance data
INSERT INTO supplier_performance (supplier_id, on_time_delivery_rate, quality_score)
SELECT DISTINCT supplier_id, 
  0.85 + (RANDOM() * 0.15),
  0.90 + (RANDOM() * 0.10)
FROM product_master
WHERE supplier_id IS NOT NULL
ON CONFLICT (supplier_id) DO NOTHING;

-- Add RLS policies
ALTER TABLE supplier_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE decoupling_weights_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access to supplier_performance"
ON supplier_performance FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to decoupling_weights_config"
ON decoupling_weights_config FOR ALL TO authenticated USING (true) WITH CHECK (true);