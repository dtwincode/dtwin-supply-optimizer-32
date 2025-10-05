
-- Clean up invalid sales data (products/locations that don't exist)
DELETE FROM historical_sales_data
WHERE NOT EXISTS (
  SELECT 1 FROM product_master pm WHERE pm.product_id = historical_sales_data.product_id
)
OR NOT EXISTS (
  SELECT 1 FROM location_master lm WHERE lm.location_id = historical_sales_data.location_id
);

-- Clean up invalid usage_analysis records
DELETE FROM usage_analysis
WHERE NOT EXISTS (
  SELECT 1 FROM product_master pm WHERE pm.product_id = usage_analysis.product_id
)
OR NOT EXISTS (
  SELECT 1 FROM location_master lm WHERE lm.location_id = usage_analysis.location_id
);

-- Clean up invalid demand_history_analysis records
DELETE FROM demand_history_analysis
WHERE NOT EXISTS (
  SELECT 1 FROM product_master pm WHERE pm.product_id = demand_history_analysis.product_id
)
OR NOT EXISTS (
  SELECT 1 FROM location_master lm WHERE lm.location_id = demand_history_analysis.location_id
);

-- Refresh usage_analysis with clean data only
TRUNCATE usage_analysis;

WITH location_totals AS (
  SELECT 
    hsd.location_id,
    SUM(hsd.quantity_sold) / 7.0 as total_weekly_usage
  FROM historical_sales_data hsd
  INNER JOIN product_master pm ON hsd.product_id = pm.product_id
  INNER JOIN location_master lm ON hsd.location_id = lm.location_id
  WHERE hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY hsd.location_id
),
product_usage AS (
  SELECT 
    hsd.product_id,
    hsd.location_id,
    pm.sku,
    SUM(hsd.quantity_sold) / 7.0 as avg_weekly_usage,
    lt.total_weekly_usage
  FROM historical_sales_data hsd
  INNER JOIN product_master pm ON hsd.product_id = pm.product_id
  INNER JOIN location_master lm ON hsd.location_id = lm.location_id
  JOIN location_totals lt ON hsd.location_id = lt.location_id
  WHERE hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY hsd.product_id, hsd.location_id, pm.sku, lt.total_weekly_usage
)
INSERT INTO usage_analysis (
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
