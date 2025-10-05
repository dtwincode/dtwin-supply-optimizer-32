
-- Create a trigger function to auto-populate demand_history_analysis
CREATE OR REPLACE FUNCTION public.refresh_demand_history_analysis()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Only refresh for the affected product-location pair
  DELETE FROM public.demand_history_analysis
  WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
    AND location_id = COALESCE(NEW.location_id, OLD.location_id);
  
  -- Recalculate for this product-location pair
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
  WHERE hsd.product_id = COALESCE(NEW.product_id, OLD.product_id)
    AND hsd.location_id = COALESCE(NEW.location_id, OLD.location_id)
    AND hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY hsd.product_id, hsd.location_id, pm.sku
  HAVING COUNT(*) >= 30;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on historical_sales_data
DROP TRIGGER IF EXISTS trigger_refresh_demand_analysis ON public.historical_sales_data;
CREATE TRIGGER trigger_refresh_demand_analysis
AFTER INSERT OR UPDATE OR DELETE ON public.historical_sales_data
FOR EACH ROW
EXECUTE FUNCTION public.refresh_demand_history_analysis();

-- Do initial population for all existing data
SELECT public.populate_demand_history_analysis();
