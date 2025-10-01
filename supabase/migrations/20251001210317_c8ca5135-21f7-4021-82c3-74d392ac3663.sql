-- Fix ADU view to use actual historical data instead of last 90 days
-- This recalculates Average Daily Usage from the most recent 90 days of available data

CREATE OR REPLACE VIEW adu_90d_view AS
WITH date_range AS (
  SELECT 
    MAX(sales_date) as max_date,
    MAX(sales_date) - INTERVAL '90 days' as min_date
  FROM daily_sales_base
),
adu_calc AS (
  SELECT
    product_id,
    location_id,
    AVG(qty) as adu_adj,
    90 as window_days
  FROM daily_sales_base, date_range
  WHERE sales_date >= date_range.min_date
    AND sales_date <= date_range.max_date
  GROUP BY product_id, location_id
)
SELECT * FROM adu_calc;