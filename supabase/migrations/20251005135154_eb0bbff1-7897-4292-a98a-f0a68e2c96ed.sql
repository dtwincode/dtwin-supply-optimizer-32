
-- Create trigger function to auto-populate usage_analysis from historical sales
CREATE OR REPLACE FUNCTION public.refresh_usage_analysis()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Only refresh for the affected location
  DELETE FROM public.usage_analysis
  WHERE location_id = COALESCE(NEW.location_id, OLD.location_id);
  
  -- Recalculate usage analysis for this location
  WITH location_totals AS (
    SELECT 
      location_id,
      SUM(quantity_sold) / 7.0 as total_weekly_usage
    FROM historical_sales_data
    WHERE sales_date >= CURRENT_DATE - INTERVAL '90 days'
      AND location_id = COALESCE(NEW.location_id, OLD.location_id)
    GROUP BY location_id
  ),
  product_usage AS (
    SELECT 
      hsd.product_id,
      hsd.location_id,
      pm.sku,
      SUM(hsd.quantity_sold) / 7.0 as avg_weekly_usage,
      lt.total_weekly_usage
    FROM historical_sales_data hsd
    LEFT JOIN product_master pm ON hsd.product_id = pm.product_id
    JOIN location_totals lt ON hsd.location_id = lt.location_id
    WHERE hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
      AND hsd.location_id = COALESCE(NEW.location_id, OLD.location_id)
    GROUP BY hsd.product_id, hsd.location_id, pm.sku, lt.total_weekly_usage
  )
  INSERT INTO public.usage_analysis (
    product_id,
    location_id,
    sku,
    avg_weekly_usage,
    percentage_of_total_usage,
    volume_score
  )
  SELECT 
    product_id,
    location_id,
    sku,
    avg_weekly_usage,
    CASE 
      WHEN total_weekly_usage > 0 
      THEN (avg_weekly_usage / total_weekly_usage) * 100
      ELSE 0
    END as percentage_of_total_usage,
    CASE 
      WHEN (avg_weekly_usage / NULLIF(total_weekly_usage, 0)) * 100 >= 20 THEN 90
      WHEN (avg_weekly_usage / NULLIF(total_weekly_usage, 0)) * 100 >= 10 THEN 70
      WHEN (avg_weekly_usage / NULLIF(total_weekly_usage, 0)) * 100 >= 5 THEN 50
      ELSE 20
    END as volume_score
  FROM product_usage;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on historical_sales_data for usage analysis
DROP TRIGGER IF EXISTS trigger_refresh_usage_analysis ON public.historical_sales_data;
CREATE TRIGGER trigger_refresh_usage_analysis
AFTER INSERT OR UPDATE OR DELETE ON public.historical_sales_data
FOR EACH ROW
EXECUTE FUNCTION public.refresh_usage_analysis();

-- Do initial population for all locations
WITH location_totals AS (
  SELECT 
    location_id,
    SUM(quantity_sold) / 7.0 as total_weekly_usage
  FROM historical_sales_data
  WHERE sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY location_id
),
product_usage AS (
  SELECT 
    hsd.product_id,
    hsd.location_id,
    pm.sku,
    SUM(hsd.quantity_sold) / 7.0 as avg_weekly_usage,
    lt.total_weekly_usage
  FROM historical_sales_data hsd
  LEFT JOIN product_master pm ON hsd.product_id = pm.product_id
  JOIN location_totals lt ON hsd.location_id = lt.location_id
  WHERE hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY hsd.product_id, hsd.location_id, pm.sku, lt.total_weekly_usage
)
INSERT INTO public.usage_analysis (
  product_id,
  location_id,
  sku,
  avg_weekly_usage,
  percentage_of_total_usage,
  volume_score
)
SELECT 
  product_id,
  location_id,
  sku,
  avg_weekly_usage,
  CASE 
    WHEN total_weekly_usage > 0 
    THEN (avg_weekly_usage / total_weekly_usage) * 100
    ELSE 0
  END as percentage_of_total_usage,
  CASE 
    WHEN (avg_weekly_usage / NULLIF(total_weekly_usage, 0)) * 100 >= 20 THEN 90
    WHEN (avg_weekly_usage / NULLIF(total_weekly_usage, 0)) * 100 >= 10 THEN 70
    WHEN (avg_weekly_usage / NULLIF(total_weekly_usage, 0)) * 100 >= 5 THEN 50
    ELSE 20
  END as volume_score
FROM product_usage
ON CONFLICT (product_id, location_id) 
DO UPDATE SET
  avg_weekly_usage = EXCLUDED.avg_weekly_usage,
  percentage_of_total_usage = EXCLUDED.percentage_of_total_usage,
  volume_score = EXCLUDED.volume_score,
  updated_at = now();
