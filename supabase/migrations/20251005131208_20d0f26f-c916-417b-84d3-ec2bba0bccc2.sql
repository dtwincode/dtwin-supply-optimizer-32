-- Function to populate demand_history_analysis from historical_sales_data
CREATE OR REPLACE FUNCTION populate_demand_history_analysis()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Clear existing analysis
  DELETE FROM demand_history_analysis;
  
  -- Calculate demand statistics from historical_sales_data (90-day rolling)
  INSERT INTO demand_history_analysis (
    product_id,
    location_id,
    sku,
    analysis_period_start,
    analysis_period_end,
    mean_demand,
    std_dev_demand,
    cv,
    variability_score
  )
  SELECT 
    hsd.product_id,
    hsd.location_id,
    pm.sku,
    MIN(hsd.sales_date) as analysis_period_start,
    MAX(hsd.sales_date) as analysis_period_end,
    AVG(hsd.quantity_sold) as mean_demand,
    STDDEV(hsd.quantity_sold) as std_dev_demand,
    CASE 
      WHEN AVG(hsd.quantity_sold) > 0 
      THEN STDDEV(hsd.quantity_sold) / AVG(hsd.quantity_sold)
      ELSE 0
    END as cv,
    CASE 
      WHEN (STDDEV(hsd.quantity_sold) / NULLIF(AVG(hsd.quantity_sold), 0)) < 0.2 THEN 20
      WHEN (STDDEV(hsd.quantity_sold) / NULLIF(AVG(hsd.quantity_sold), 0)) < 0.5 THEN 50
      ELSE LEAST(100, 80 + ((STDDEV(hsd.quantity_sold) / NULLIF(AVG(hsd.quantity_sold), 0)) - 0.5) * 40)
    END as variability_score
  FROM historical_sales_data hsd
  LEFT JOIN product_master pm ON hsd.product_id = pm.product_id
  WHERE hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY hsd.product_id, hsd.location_id, pm.sku
  HAVING COUNT(*) >= 30; -- At least 30 days of data
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN v_count;
END;
$$;