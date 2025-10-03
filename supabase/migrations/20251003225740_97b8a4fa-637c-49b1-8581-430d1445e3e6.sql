-- =====================================================
-- AUTOMATED BUFFER RECALCULATION SYSTEM
-- Implements scheduled buffer updates with DAF/LTAF
-- =====================================================

-- 1. Buffer Recalculation Schedule Configuration
CREATE TABLE IF NOT EXISTS buffer_recalculation_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_name TEXT NOT NULL,
  cron_expression TEXT NOT NULL, -- e.g., '0 2 * * *' for daily at 2 AM
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Buffer Recalculation History (Audit Trail)
CREATE TABLE IF NOT EXISTS buffer_recalculation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  recalc_ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Previous values
  old_red_zone NUMERIC,
  old_yellow_zone NUMERIC,
  old_green_zone NUMERIC,
  old_adu NUMERIC,
  old_dlt INTEGER,
  
  -- New values
  new_red_zone NUMERIC NOT NULL,
  new_yellow_zone NUMERIC NOT NULL,
  new_green_zone NUMERIC NOT NULL,
  new_adu NUMERIC NOT NULL,
  new_dlt INTEGER NOT NULL,
  
  -- Factors applied
  daf_applied NUMERIC DEFAULT 1.0,
  ltaf_applied NUMERIC DEFAULT 1.0,
  trend_factor NUMERIC DEFAULT 1.0,
  
  -- Change details
  change_reason TEXT,
  triggered_by TEXT DEFAULT 'AUTOMATIC',
  
  FOREIGN KEY (product_id, location_id) REFERENCES decoupling_points(product_id, location_id)
);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_buffer_history_product_location 
  ON buffer_recalculation_history(product_id, location_id);
CREATE INDEX IF NOT EXISTS idx_buffer_history_recalc_ts 
  ON buffer_recalculation_history(recalc_ts DESC);

-- 4. Function: Recalculate buffers with DAF/LTAF
CREATE OR REPLACE FUNCTION recalculate_buffers_with_adjustments(
  p_product_id TEXT DEFAULT NULL,
  p_location_id TEXT DEFAULT NULL,
  p_triggered_by TEXT DEFAULT 'MANUAL'
)
RETURNS TABLE(
  product_id TEXT,
  location_id TEXT,
  old_red NUMERIC,
  new_red NUMERIC,
  old_yellow NUMERIC,
  new_yellow NUMERIC,
  old_green NUMERIC,
  new_green NUMERIC,
  changes_applied BOOLEAN
) AS $$
DECLARE
  v_decoupling RECORD;
  v_adu NUMERIC;
  v_dlt INTEGER;
  v_daf NUMERIC;
  v_ltaf NUMERIC;
  v_trend NUMERIC;
  v_lt_factor NUMERIC;
  v_var_factor NUMERIC;
  v_order_cycle NUMERIC;
  v_moq NUMERIC;
  v_rounding NUMERIC;
  v_old_red NUMERIC;
  v_old_yellow NUMERIC;
  v_old_green NUMERIC;
  v_new_red NUMERIC;
  v_new_yellow NUMERIC;
  v_new_green NUMERIC;
BEGIN
  -- Loop through decoupling points (filtered if parameters provided)
  FOR v_decoupling IN 
    SELECT dp.product_id, dp.location_id, dp.buffer_profile_id
    FROM decoupling_points dp
    WHERE (p_product_id IS NULL OR dp.product_id = p_product_id)
      AND (p_location_id IS NULL OR dp.location_id = p_location_id)
  LOOP
    -- Get current buffer values
    SELECT red_zone, yellow_zone, green_zone
    INTO v_old_red, v_old_yellow, v_old_green
    FROM inventory_ddmrp_buffers_view
    WHERE inventory_ddmrp_buffers_view.product_id = v_decoupling.product_id
      AND inventory_ddmrp_buffers_view.location_id = v_decoupling.location_id;
    
    -- Calculate ADU (90-day adjusted)
    SELECT COALESCE(adu_adj, 0) INTO v_adu
    FROM adu_90d_view
    WHERE adu_90d_view.product_id = v_decoupling.product_id
      AND adu_90d_view.location_id = v_decoupling.location_id;
    
    -- Get DLT
    SELECT COALESCE(actual_lead_time_days, 7) INTO v_dlt
    FROM actual_lead_time
    WHERE actual_lead_time.product_id = v_decoupling.product_id
      AND actual_lead_time.location_id = v_decoupling.location_id;
    
    -- Get active DAF (current date within range)
    SELECT COALESCE(daf, 1.0) INTO v_daf
    FROM demand_adjustment_factor
    WHERE demand_adjustment_factor.product_id = v_decoupling.product_id
      AND demand_adjustment_factor.location_id = v_decoupling.location_id
      AND CURRENT_DATE BETWEEN start_date AND end_date
    ORDER BY start_date DESC
    LIMIT 1;
    
    -- Get active LTAF
    SELECT COALESCE(ltaf, 1.0) INTO v_ltaf
    FROM lead_time_adjustment_factor
    WHERE lead_time_adjustment_factor.product_id = v_decoupling.product_id
      AND lead_time_adjustment_factor.location_id = v_decoupling.location_id
      AND CURRENT_DATE BETWEEN start_date AND end_date
    ORDER BY start_date DESC
    LIMIT 1;
    
    -- Get trend factor
    SELECT COALESCE(trend_factor, 1.0) INTO v_trend
    FROM trend_factor_view
    WHERE trend_factor_view.product_id = v_decoupling.product_id
      AND trend_factor_view.location_id = v_decoupling.location_id;
    
    -- Get buffer profile parameters
    SELECT lt_factor, variability_factor, order_cycle_days, min_order_qty, rounding_multiple
    INTO v_lt_factor, v_var_factor, v_order_cycle, v_moq, v_rounding
    FROM buffer_profile_master
    WHERE buffer_profile_id = v_decoupling.buffer_profile_id;
    
    -- Apply adjustments to ADU and DLT
    v_adu := v_adu * v_daf * v_trend;
    v_dlt := ROUND(v_dlt * v_ltaf);
    
    -- Calculate new buffer zones (DDMRP formulas)
    -- Red Zone = ADU * DLT * LT_Factor * Var_Factor
    v_new_red := v_adu * v_dlt * COALESCE(v_lt_factor, 1.0) * COALESCE(v_var_factor, 0.5);
    
    -- Ensure minimum order quantity
    IF v_new_red < COALESCE(v_moq, 0) THEN
      v_new_red := COALESCE(v_moq, 0);
    END IF;
    
    -- Yellow Zone = Red Zone (typical DDMRP practice)
    v_new_yellow := v_new_red;
    
    -- Green Zone = ADU * Order_Cycle * LT_Factor
    v_new_green := v_adu * COALESCE(v_order_cycle, 7) * COALESCE(v_lt_factor, 1.0);
    
    -- Round to rounding multiple if specified
    IF COALESCE(v_rounding, 0) > 0 THEN
      v_new_red := CEIL(v_new_red / v_rounding) * v_rounding;
      v_new_yellow := CEIL(v_new_yellow / v_rounding) * v_rounding;
      v_new_green := CEIL(v_new_green / v_rounding) * v_rounding;
    END IF;
    
    -- Insert into history
    INSERT INTO buffer_recalculation_history (
      product_id, location_id,
      old_red_zone, old_yellow_zone, old_green_zone, old_adu, old_dlt,
      new_red_zone, new_yellow_zone, new_green_zone, new_adu, new_dlt,
      daf_applied, ltaf_applied, trend_factor,
      change_reason, triggered_by
    ) VALUES (
      v_decoupling.product_id, v_decoupling.location_id,
      v_old_red, v_old_yellow, v_old_green, 
      v_adu / COALESCE(NULLIF(v_daf * v_trend, 0), 1), -- Original ADU before adjustments
      ROUND(v_dlt / COALESCE(NULLIF(v_ltaf, 0), 1)), -- Original DLT before adjustments
      v_new_red, v_new_yellow, v_new_green, v_adu, v_dlt,
      v_daf, v_ltaf, v_trend,
      'Automatic buffer recalculation with DAF/LTAF/Trend',
      p_triggered_by
    );
    
    -- Return the changes
    RETURN QUERY SELECT 
      v_decoupling.product_id,
      v_decoupling.location_id,
      v_old_red,
      v_new_red,
      v_old_yellow,
      v_new_yellow,
      v_old_green,
      v_new_green,
      TRUE; -- changes_applied
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. RLS Policies
ALTER TABLE buffer_recalculation_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffer_recalculation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access to buffer_recalculation_schedule"
  ON buffer_recalculation_schedule FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to buffer_recalculation_history"
  ON buffer_recalculation_history FOR ALL USING (true) WITH CHECK (true);

-- 6. Insert default schedule (daily at 2 AM)
INSERT INTO buffer_recalculation_schedule (schedule_name, cron_expression, is_active)
VALUES ('Daily Buffer Recalculation', '0 2 * * *', true)
ON CONFLICT DO NOTHING;