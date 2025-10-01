-- Generate realistic on-hand inventory based on historical sales
-- This will create inventory levels for all product-location pairs

WITH sales_summary AS (
  SELECT 
    product_id,
    location_id,
    AVG(qty) as avg_daily_qty,
    STDDEV(qty) as stddev_qty
  FROM daily_sales_base
  WHERE sales_date >= CURRENT_DATE - INTERVAL '90 days'
  GROUP BY product_id, location_id
),
inventory_calc AS (
  SELECT 
    plp.product_id,
    plp.location_id,
    CASE 
      WHEN ss.avg_daily_qty IS NOT NULL THEN
        -- Set inventory to 30-60 days of supply with some randomness
        GREATEST(
          ROUND(ss.avg_daily_qty * (30 + RANDOM() * 30)),
          10
        )
      ELSE
        -- For items with no sales, use random value between 50-200
        ROUND(50 + RANDOM() * 150)
    END as calculated_qty
  FROM product_location_pairs plp
  LEFT JOIN sales_summary ss USING (product_id, location_id)
)
INSERT INTO on_hand_inventory (product_id, location_id, qty_on_hand, snapshot_ts)
SELECT 
  product_id,
  location_id,
  calculated_qty,
  NOW()
FROM inventory_calc
ON CONFLICT DO NOTHING;