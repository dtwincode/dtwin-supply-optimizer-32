-- Fix buffer recalculation function to handle NULL values properly
CREATE OR REPLACE FUNCTION public.recalculate_buffers_with_adjustments(
  p_product_id text DEFAULT NULL::text, 
  p_location_id text DEFAULT NULL::text, 
  p_triggered_by text DEFAULT 'MANUAL'::text
)
RETURNS TABLE(
  product_id text, 
  location_id text, 
  old_red numeric, 
  new_red numeric, 
  old_yellow numeric, 
  new_yellow numeric, 
  old_green numeric, 
  new_green numeric, 
  changes_applied boolean
)
LANGUAGE plpgsql
AS $function$
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
    -- Get current buffer values (use 0 as default if not found)
    SELECT COALESCE(red_zone, 0), COALESCE(yellow_zone, 0), COALESCE(green_zone, 0)
    INTO v_old_red, v_old_yellow, v_old_green
    FROM inventory_ddmrp_buffers_view
    WHERE inventory_ddmrp_buffers_view.product_id = v_decoupling.product_id
      AND inventory_ddmrp_buffers_view.location_id = v_decoupling.location_id;
    
    -- Default to 0 if not found
    v_old_red := COALESCE(v_old_red, 0);
    v_old_yellow := COALESCE(v_old_yellow, 0);
    v_old_green := COALESCE(v_old_green, 0);
    
    -- Calculate ADU (90-day adjusted) with default of 1 if no data
    SELECT COALESCE(adu_adj, 1) INTO v_adu
    FROM adu_90d_view
    WHERE adu_90d_view.product_id = v_decoupling.product_id
      AND adu_90d_view.location_id = v_decoupling.location_id;
    
    v_adu := COALESCE(v_adu, 1); -- Ensure never NULL
    
    -- Get DLT with default of 7 days
    SELECT COALESCE(actual_lead_time_days, 7) INTO v_dlt
    FROM actual_lead_time
    WHERE actual_lead_time.product_id = v_decoupling.product_id
      AND actual_lead_time.location_id = v_decoupling.location_id;
    
    v_dlt := COALESCE(v_dlt, 7); -- Ensure never NULL
    
    -- Get active DAF (default 1.0)
    SELECT COALESCE(daf, 1.0) INTO v_daf
    FROM demand_adjustment_factor
    WHERE demand_adjustment_factor.product_id = v_decoupling.product_id
      AND demand_adjustment_factor.location_id = v_decoupling.location_id
      AND CURRENT_DATE BETWEEN start_date AND end_date
    ORDER BY start_date DESC
    LIMIT 1;
    
    v_daf := COALESCE(v_daf, 1.0);
    
    -- Get active LTAF (default 1.0)
    SELECT COALESCE(ltaf, 1.0) INTO v_ltaf
    FROM lead_time_adjustment_factor
    WHERE lead_time_adjustment_factor.product_id = v_decoupling.product_id
      AND lead_time_adjustment_factor.location_id = v_decoupling.location_id
      AND CURRENT_DATE BETWEEN start_date AND end_date
    ORDER BY start_date DESC
    LIMIT 1;
    
    v_ltaf := COALESCE(v_ltaf, 1.0);
    
    -- Get trend factor (default 1.0)
    SELECT COALESCE(trend_factor, 1.0) INTO v_trend
    FROM trend_factor_view
    WHERE trend_factor_view.product_id = v_decoupling.product_id
      AND trend_factor_view.location_id = v_decoupling.location_id;
    
    v_trend := COALESCE(v_trend, 1.0);
    
    -- Get buffer profile parameters with defaults
    SELECT 
      COALESCE(lt_factor, 1.0), 
      COALESCE(variability_factor, 0.5), 
      COALESCE(order_cycle_days, 7), 
      COALESCE(min_order_qty, 0), 
      COALESCE(rounding_multiple, 1)
    INTO v_lt_factor, v_var_factor, v_order_cycle, v_moq, v_rounding
    FROM buffer_profile_master
    WHERE buffer_profile_id = v_decoupling.buffer_profile_id;
    
    -- Ensure all profile parameters have defaults
    v_lt_factor := COALESCE(v_lt_factor, 1.0);
    v_var_factor := COALESCE(v_var_factor, 0.5);
    v_order_cycle := COALESCE(v_order_cycle, 7);
    v_moq := COALESCE(v_moq, 0);
    v_rounding := COALESCE(v_rounding, 1);
    
    -- Apply adjustments to ADU and DLT
    v_adu := v_adu * v_daf * v_trend;
    v_dlt := GREATEST(1, ROUND(v_dlt * v_ltaf)); -- Ensure at least 1 day
    
    -- Calculate new buffer zones (DDMRP formulas)
    -- Red Zone = ADU * DLT * LT_Factor * Var_Factor
    v_new_red := GREATEST(0, v_adu * v_dlt * v_lt_factor * v_var_factor);
    
    -- Ensure minimum order quantity
    v_new_red := GREATEST(v_new_red, v_moq);
    
    -- Yellow Zone = Red Zone (typical DDMRP practice)
    v_new_yellow := v_new_red;
    
    -- Green Zone = ADU * Order_Cycle * LT_Factor
    v_new_green := GREATEST(0, v_adu * v_order_cycle * v_lt_factor);
    
    -- Round to rounding multiple if specified
    IF v_rounding > 0 THEN
      v_new_red := CEIL(v_new_red / v_rounding) * v_rounding;
      v_new_yellow := CEIL(v_new_yellow / v_rounding) * v_rounding;
      v_new_green := CEIL(v_new_green / v_rounding) * v_rounding;
    END IF;
    
    -- Ensure no NULL values before insert
    v_new_red := COALESCE(v_new_red, 0);
    v_new_yellow := COALESCE(v_new_yellow, 0);
    v_new_green := COALESCE(v_new_green, 0);
    
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
$function$;