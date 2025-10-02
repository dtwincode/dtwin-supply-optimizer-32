-- ============================================================================
-- Fix: Populate product_location_pairs with actual combinations from sales data
-- ============================================================================

-- First, insert all actual product-location pairs from historical sales
INSERT INTO public.product_location_pairs (product_id, location_id)
SELECT DISTINCT 
  hsd.product_id,
  hsd.location_id
FROM historical_sales_data hsd
WHERE EXISTS (
  SELECT 1 FROM product_master pm WHERE pm.product_id = hsd.product_id
)
AND EXISTS (
  SELECT 1 FROM location_master lm WHERE lm.location_id = hsd.location_id
)
ON CONFLICT DO NOTHING;

-- Now populate on_hand_inventory for ALL product-location pairs
INSERT INTO public.on_hand_inventory (product_id, location_id, qty_on_hand, snapshot_ts)
SELECT DISTINCT
  plp.product_id,
  plp.location_id,
  COALESCE(
    -- Start with 30 days worth of ADU as initial inventory
    (SELECT SUM(quantity_sold) / 90.0 * 30
     FROM historical_sales_data hsd
     WHERE hsd.product_id = plp.product_id 
     AND hsd.location_id = plp.location_id
     AND hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'),
    50 -- Default for items with no sales history
  ) as qty_on_hand,
  NOW() as snapshot_ts
FROM product_location_pairs plp
WHERE NOT EXISTS (
  SELECT 1 FROM on_hand_inventory ohi
  WHERE ohi.product_id = plp.product_id 
  AND ohi.location_id = plp.location_id
);

-- Populate open_pos for items with sales history
INSERT INTO public.open_pos (product_id, location_id, ordered_qty, received_qty, order_date, expected_date, status)
SELECT DISTINCT
  plp.product_id,
  plp.location_id,
  COALESCE(
    -- Order quantity = 14 days of ADU
    (SELECT SUM(quantity_sold) / 90.0 * 14
     FROM historical_sales_data hsd
     WHERE hsd.product_id = plp.product_id 
     AND hsd.location_id = plp.location_id
     AND hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'),
    30
  ) as ordered_qty,
  0 as received_qty,
  CURRENT_DATE - INTERVAL '3 days' as order_date,
  CURRENT_DATE + INTERVAL '4 days' as expected_date,
  'OPEN' as status
FROM product_location_pairs plp
WHERE NOT EXISTS (
  SELECT 1 FROM open_pos op
  WHERE op.product_id = plp.product_id 
  AND op.location_id = plp.location_id
  AND op.status = 'OPEN'
)
AND EXISTS (
  SELECT 1 FROM historical_sales_data hsd
  WHERE hsd.product_id = plp.product_id 
  AND hsd.location_id = plp.location_id
  LIMIT 1
);

-- Populate open_so for items with sales history
INSERT INTO public.open_so (product_id, location_id, qty, confirmed_date, status)
SELECT DISTINCT
  plp.product_id,
  plp.location_id,
  COALESCE(
    -- Demand = 7 days of ADU
    (SELECT SUM(quantity_sold) / 90.0 * 7
     FROM historical_sales_data hsd
     WHERE hsd.product_id = plp.product_id 
     AND hsd.location_id = plp.location_id
     AND hsd.sales_date >= CURRENT_DATE - INTERVAL '90 days'),
    20
  ) as qty,
  CURRENT_DATE as confirmed_date,
  'CONFIRMED' as status
FROM product_location_pairs plp
WHERE NOT EXISTS (
  SELECT 1 FROM open_so os
  WHERE os.product_id = plp.product_id 
  AND os.location_id = plp.location_id
  AND os.status = 'CONFIRMED'
)
AND EXISTS (
  SELECT 1 FROM historical_sales_data hsd
  WHERE hsd.product_id = plp.product_id 
  AND hsd.location_id = plp.location_id
  LIMIT 1
);

-- Log summary
DO $$
DECLARE
  v_pairs INTEGER;
  v_inventory INTEGER;
  v_pos INTEGER;
  v_so INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_pairs FROM product_location_pairs;
  SELECT COUNT(*) INTO v_inventory FROM on_hand_inventory;
  SELECT COUNT(*) INTO v_pos FROM open_pos WHERE status = 'OPEN';
  SELECT COUNT(*) INTO v_so FROM open_so WHERE status = 'CONFIRMED';
  
  RAISE NOTICE 'Data Population Complete:';
  RAISE NOTICE '  - Product-Location Pairs: %', v_pairs;
  RAISE NOTICE '  - On-hand inventory records: %', v_inventory;
  RAISE NOTICE '  - Open purchase orders: %', v_pos;
  RAISE NOTICE '  - Open sales orders: %', v_so;
END $$;