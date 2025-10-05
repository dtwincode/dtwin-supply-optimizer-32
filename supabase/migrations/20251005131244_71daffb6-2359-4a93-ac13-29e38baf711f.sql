-- Fix function to exclude generated column
CREATE OR REPLACE FUNCTION populate_demand_history_analysis()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  DELETE FROM public.demand_history_analysis;
  
  -- Insert without cv (it's auto-generated)
  INSERT INTO public.demand_history_analysis (
    product_id,
    location_id,
    sku,
    analysis_period_start,
    analysis_period_end,
    mean_demand,
    std_dev_demand,
    variability_score
  )
  SELECT 
    hsd.product_id,
    hsd.location_id,
    pm.sku,
    MIN(hsd.sales_date),
    MAX(hsd.sales_date),
    AVG(hsd.quantity_sold),
    STDDEV(hsd.quantity_sold),
    CASE 
      WHEN (STDDEV(hsd.quantity_sold) / NULLIF(AVG(hsd.quantity_sold), 0)) < 0.2 THEN 20
      WHEN (STDDEV(hsd.quantity_sold) / NULLIF(AVG(hsd.quantity_sold), 0)) < 0.5 THEN 50
      ELSE LEAST(100, 80 + ((STDDEV(hsd.quantity_sold) / NULLIF(AVG(hsd.quantity_sold), 0)) - 0.5) * 40)
    END
  FROM public.historical_sales_data hsd
  LEFT JOIN public.product_master pm ON hsd.product_id = pm.product_id
  WHERE hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY hsd.product_id, hsd.location_id, pm.sku
  HAVING COUNT(*) >= 30;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;

-- Execute it
SELECT populate_demand_history_analysis() as records_created;