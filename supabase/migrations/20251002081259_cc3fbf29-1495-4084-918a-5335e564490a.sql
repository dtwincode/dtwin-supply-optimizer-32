-- =====================================================
-- 8-FACTOR RESTAURANT SUPPLY CHAIN DECOUPLING MODEL
-- =====================================================

-- =====================================================
-- STEP 1: Create Missing Tables
-- =====================================================

-- 1. Demand History Analysis (Variability Factor)
CREATE TABLE IF NOT EXISTS public.demand_history_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  analysis_period_start DATE NOT NULL,
  analysis_period_end DATE NOT NULL,
  mean_demand NUMERIC NOT NULL DEFAULT 0,
  std_dev_demand NUMERIC NOT NULL DEFAULT 0,
  cv NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN mean_demand > 0 THEN std_dev_demand / mean_demand 
      ELSE 0 
    END
  ) STORED,
  variability_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, location_id, analysis_period_end)
);

-- 2. Menu Mapping (Criticality Factor)
CREATE TABLE IF NOT EXISTS public.menu_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  product_id TEXT NOT NULL,
  menu_items_count INTEGER NOT NULL DEFAULT 0,
  sales_impact_percentage NUMERIC NOT NULL DEFAULT 0,
  is_core_item BOOLEAN NOT NULL DEFAULT false,
  criticality_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

-- 3. Storage Requirements (Storage Intensity Factor)
CREATE TABLE IF NOT EXISTS public.storage_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  product_id TEXT NOT NULL,
  storage_type TEXT NOT NULL CHECK (storage_type IN ('FROZEN', 'CHILLED', 'DRY', 'AMBIENT')),
  units_per_carton NUMERIC NOT NULL DEFAULT 1,
  cartons_per_pallet NUMERIC NOT NULL DEFAULT 1,
  cubic_meters_per_unit NUMERIC NOT NULL DEFAULT 0,
  storage_footprint_per_1000_units NUMERIC GENERATED ALWAYS AS (
    cubic_meters_per_unit * 1000
  ) STORED,
  storage_intensity_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

-- 4. MOQ Data (MOQ Rigidity Factor)
CREATE TABLE IF NOT EXISTS public.moq_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  product_id TEXT NOT NULL,
  supplier_id TEXT,
  moq_units NUMERIC NOT NULL DEFAULT 0,
  avg_daily_demand NUMERIC NOT NULL DEFAULT 0,
  days_coverage NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN avg_daily_demand > 0 THEN moq_units / avg_daily_demand 
      ELSE 0 
    END
  ) STORED,
  moq_rigidity_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, supplier_id)
);

-- 5. Usage Analysis (Volume Factor)
CREATE TABLE IF NOT EXISTS public.usage_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL,
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  avg_weekly_usage NUMERIC NOT NULL DEFAULT 0,
  percentage_of_total_usage NUMERIC NOT NULL DEFAULT 0,
  volume_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, location_id)
);

-- =====================================================
-- STEP 2: Add Missing Columns
-- =====================================================

-- Add quality_reject_rate to supplier_performance if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'supplier_performance' 
    AND column_name = 'quality_reject_rate'
  ) THEN
    ALTER TABLE public.supplier_performance 
    ADD COLUMN quality_reject_rate NUMERIC DEFAULT 0.05;
  END IF;
END $$;

-- Add alternate_suppliers_count to supplier_performance
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'supplier_performance' 
    AND column_name = 'alternate_suppliers_count'
  ) THEN
    ALTER TABLE public.supplier_performance 
    ADD COLUMN alternate_suppliers_count INTEGER DEFAULT 1;
  END IF;
END $$;

-- =====================================================
-- STEP 3: Create Scoring Functions (0-100 scale)
-- =====================================================

-- Function 1: Calculate Variability Score (CV-based)
CREATE OR REPLACE FUNCTION public.calculate_variability_score(p_product_id TEXT, p_location_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  v_cv NUMERIC;
  v_score NUMERIC;
BEGIN
  -- Get CV from demand_history_analysis
  SELECT cv INTO v_cv
  FROM public.demand_history_analysis
  WHERE product_id = p_product_id 
    AND location_id = p_location_id
  ORDER BY analysis_period_end DESC
  LIMIT 1;
  
  -- Map CV to score: <0.2=20, 0.2-0.5=50, >0.5=80-100
  v_score := CASE
    WHEN v_cv IS NULL THEN 50 -- Default medium if no data
    WHEN v_cv < 0.2 THEN 20
    WHEN v_cv < 0.5 THEN 50
    ELSE LEAST(100, 80 + (v_cv - 0.5) * 40) -- Scale up for very high CV
  END;
  
  RETURN ROUND(v_score, 2);
END;
$$ LANGUAGE plpgsql;

-- Function 2: Calculate Criticality Score (Menu-based)
CREATE OR REPLACE FUNCTION public.calculate_criticality_score(p_product_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  v_is_core BOOLEAN;
  v_sales_impact NUMERIC;
  v_score NUMERIC;
BEGIN
  SELECT is_core_item, sales_impact_percentage 
  INTO v_is_core, v_sales_impact
  FROM public.menu_mapping
  WHERE product_id = p_product_id;
  
  -- Core items + high sales impact = high score
  v_score := CASE
    WHEN v_is_core = true AND v_sales_impact > 50 THEN 90
    WHEN v_is_core = true THEN 80
    WHEN v_sales_impact > 50 THEN 70
    WHEN v_sales_impact > 20 THEN 50
    ELSE 20
  END;
  
  RETURN ROUND(v_score, 2);
END;
$$ LANGUAGE plpgsql;

-- Function 3: Calculate Holding Cost Score
CREATE OR REPLACE FUNCTION public.calculate_holding_cost_score(p_product_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  v_shelf_life INTEGER;
  v_storage_type TEXT;
  v_price NUMERIC;
  v_score NUMERIC;
BEGIN
  -- Get product data
  SELECT shelf_life_days INTO v_shelf_life
  FROM public.product_master
  WHERE product_id = p_product_id;
  
  SELECT storage_type INTO v_storage_type
  FROM public.storage_requirements
  WHERE product_id = p_product_id;
  
  SELECT price INTO v_price
  FROM public."product_pricing-master"
  WHERE product_id = p_product_id
  ORDER BY effective_date DESC
  LIMIT 1;
  
  -- Short shelf life + expensive + frozen = high score
  v_score := 50; -- Base score
  
  IF v_shelf_life < 7 THEN v_score := v_score + 30; END IF;
  IF v_shelf_life < 3 THEN v_score := v_score + 20; END IF;
  IF v_storage_type IN ('FROZEN', 'CHILLED') THEN v_score := v_score + 20; END IF;
  IF v_price > 100 THEN v_score := v_score + 15; END IF;
  
  RETURN LEAST(100, ROUND(v_score, 2));
END;
$$ LANGUAGE plpgsql;

-- Function 4: Calculate Supplier Reliability Score
CREATE OR REPLACE FUNCTION public.calculate_supplier_reliability_score(p_supplier_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  v_otif NUMERIC;
  v_reject_rate NUMERIC;
  v_alt_suppliers INTEGER;
  v_score NUMERIC;
BEGIN
  SELECT on_time_delivery_rate, quality_reject_rate, alternate_suppliers_count
  INTO v_otif, v_reject_rate, v_alt_suppliers
  FROM public.supplier_performance
  WHERE supplier_id = p_supplier_id;
  
  -- High OTIF + multiple suppliers = low risk (low score)
  -- Single source + poor OTIF = high risk (high score)
  v_score := 100 - (v_otif * 100); -- Start with inverse of OTIF
  v_score := v_score + (v_reject_rate * 100); -- Add reject penalty
  v_score := v_score - (v_alt_suppliers * 10); -- Reduce score for each alt supplier
  
  RETURN LEAST(100, GREATEST(0, ROUND(v_score, 2)));
END;
$$ LANGUAGE plpgsql;

-- Function 5: Calculate Lead Time Score
CREATE OR REPLACE FUNCTION public.calculate_lead_time_score(p_product_id TEXT, p_location_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  v_lead_time INTEGER;
  v_score NUMERIC;
BEGIN
  SELECT actual_lead_time_days INTO v_lead_time
  FROM public.actual_lead_time
  WHERE product_id = p_product_id AND location_id = p_location_id;
  
  -- Short lead time = low score, long lead time = high score
  v_score := CASE
    WHEN v_lead_time IS NULL THEN 50
    WHEN v_lead_time <= 1 THEN 20
    WHEN v_lead_time <= 3 THEN 30
    WHEN v_lead_time <= 7 THEN 50
    WHEN v_lead_time <= 14 THEN 70
    ELSE 90
  END;
  
  RETURN ROUND(v_score, 2);
END;
$$ LANGUAGE plpgsql;

-- Function 6: Calculate Volume Score
CREATE OR REPLACE FUNCTION public.calculate_volume_score(p_product_id TEXT, p_location_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  v_pct_usage NUMERIC;
  v_score NUMERIC;
BEGIN
  SELECT percentage_of_total_usage INTO v_pct_usage
  FROM public.usage_analysis
  WHERE product_id = p_product_id AND location_id = p_location_id;
  
  -- High volume = high score
  v_score := CASE
    WHEN v_pct_usage IS NULL THEN 50
    WHEN v_pct_usage >= 20 THEN 90
    WHEN v_pct_usage >= 10 THEN 70
    WHEN v_pct_usage >= 5 THEN 50
    ELSE 20
  END;
  
  RETURN ROUND(v_score, 2);
END;
$$ LANGUAGE plpgsql;

-- Function 7: Calculate Storage Intensity Score
CREATE OR REPLACE FUNCTION public.calculate_storage_intensity_score(p_product_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  v_footprint NUMERIC;
  v_storage_type TEXT;
  v_score NUMERIC;
BEGIN
  SELECT storage_footprint_per_1000_units, storage_type
  INTO v_footprint, v_storage_type
  FROM public.storage_requirements
  WHERE product_id = p_product_id;
  
  -- High footprint + special storage = high score
  v_score := 50; -- Base
  
  IF v_footprint > 10 THEN v_score := v_score + 30; END IF;
  IF v_storage_type = 'FROZEN' THEN v_score := v_score + 20; END IF;
  IF v_storage_type = 'CHILLED' THEN v_score := v_score + 10; END IF;
  
  RETURN LEAST(100, ROUND(v_score, 2));
END;
$$ LANGUAGE plpgsql;

-- Function 8: Calculate MOQ Rigidity Score
CREATE OR REPLACE FUNCTION public.calculate_moq_rigidity_score(p_product_id TEXT)
RETURNS NUMERIC AS $$
DECLARE
  v_days_coverage NUMERIC;
  v_score NUMERIC;
BEGIN
  SELECT days_coverage INTO v_days_coverage
  FROM public.moq_data
  WHERE product_id = p_product_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Many days coverage = high rigidity = high score
  v_score := CASE
    WHEN v_days_coverage IS NULL THEN 50
    WHEN v_days_coverage >= 14 THEN 90
    WHEN v_days_coverage >= 7 THEN 70
    WHEN v_days_coverage >= 5 THEN 50
    WHEN v_days_coverage >= 3 THEN 30
    ELSE 20
  END;
  
  RETURN ROUND(v_score, 2);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 4: Master 8-Factor Weighted Score Function
-- =====================================================

CREATE OR REPLACE FUNCTION public.calculate_8factor_weighted_score(
  p_product_id TEXT,
  p_location_id TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_variability_score NUMERIC;
  v_criticality_score NUMERIC;
  v_holding_cost_score NUMERIC;
  v_supplier_reliability_score NUMERIC;
  v_lead_time_score NUMERIC;
  v_volume_score NUMERIC;
  v_storage_intensity_score NUMERIC;
  v_moq_rigidity_score NUMERIC;
  v_total_score NUMERIC;
  v_supplier_id TEXT;
  v_result JSONB;
BEGIN
  -- Get supplier_id for reliability score
  SELECT supplier_id INTO v_supplier_id
  FROM public.product_master
  WHERE product_id = p_product_id;
  
  -- Calculate all 8 factor scores
  v_variability_score := calculate_variability_score(p_product_id, p_location_id);
  v_criticality_score := calculate_criticality_score(p_product_id);
  v_holding_cost_score := calculate_holding_cost_score(p_product_id);
  v_supplier_reliability_score := calculate_supplier_reliability_score(v_supplier_id);
  v_lead_time_score := calculate_lead_time_score(p_product_id, p_location_id);
  v_volume_score := calculate_volume_score(p_product_id, p_location_id);
  v_storage_intensity_score := calculate_storage_intensity_score(p_product_id);
  v_moq_rigidity_score := calculate_moq_rigidity_score(p_product_id);
  
  -- Calculate weighted total score
  v_total_score := (
    v_variability_score * 0.20 +
    v_criticality_score * 0.20 +
    v_holding_cost_score * 0.15 +
    v_supplier_reliability_score * 0.10 +
    v_lead_time_score * 0.10 +
    v_volume_score * 0.10 +
    v_storage_intensity_score * 0.075 +
    v_moq_rigidity_score * 0.075
  );
  
  -- Build detailed result
  v_result := jsonb_build_object(
    'product_id', p_product_id,
    'location_id', p_location_id,
    'total_score', ROUND(v_total_score, 2),
    'recommendation', CASE
      WHEN v_total_score >= 70 THEN 'PULL_STORE_LEVEL'
      WHEN v_total_score >= 40 THEN 'HYBRID_DC_LEVEL'
      ELSE 'PUSH_UPSTREAM'
    END,
    'breakdown', jsonb_build_object(
      'variability', jsonb_build_object(
        'score', v_variability_score,
        'weight', 0.20,
        'contribution', ROUND(v_variability_score * 0.20, 2)
      ),
      'criticality', jsonb_build_object(
        'score', v_criticality_score,
        'weight', 0.20,
        'contribution', ROUND(v_criticality_score * 0.20, 2)
      ),
      'holding_cost', jsonb_build_object(
        'score', v_holding_cost_score,
        'weight', 0.15,
        'contribution', ROUND(v_holding_cost_score * 0.15, 2)
      ),
      'supplier_reliability', jsonb_build_object(
        'score', v_supplier_reliability_score,
        'weight', 0.10,
        'contribution', ROUND(v_supplier_reliability_score * 0.10, 2)
      ),
      'lead_time', jsonb_build_object(
        'score', v_lead_time_score,
        'weight', 0.10,
        'contribution', ROUND(v_lead_time_score * 0.10, 2)
      ),
      'volume', jsonb_build_object(
        'score', v_volume_score,
        'weight', 0.10,
        'contribution', ROUND(v_volume_score * 0.10, 2)
      ),
      'storage_intensity', jsonb_build_object(
        'score', v_storage_intensity_score,
        'weight', 0.075,
        'contribution', ROUND(v_storage_intensity_score * 0.075, 2)
      ),
      'moq_rigidity', jsonb_build_object(
        'score', v_moq_rigidity_score,
        'weight', 0.075,
        'contribution', ROUND(v_moq_rigidity_score * 0.075, 2)
      )
    )
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 5: Enable RLS on New Tables
-- =====================================================

ALTER TABLE public.demand_history_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moq_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all new tables
CREATE POLICY "Allow authenticated full access to demand_history_analysis"
ON public.demand_history_analysis FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to menu_mapping"
ON public.menu_mapping FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to storage_requirements"
ON public.storage_requirements FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to moq_data"
ON public.moq_data FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to usage_analysis"
ON public.usage_analysis FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- STEP 6: Create Triggers for Updated_At
-- =====================================================

CREATE TRIGGER update_demand_history_analysis_updated_at
BEFORE UPDATE ON public.demand_history_analysis
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_menu_mapping_updated_at
BEFORE UPDATE ON public.menu_mapping
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_storage_requirements_updated_at
BEFORE UPDATE ON public.storage_requirements
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_moq_data_updated_at
BEFORE UPDATE ON public.moq_data
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_usage_analysis_updated_at
BEFORE UPDATE ON public.usage_analysis
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();