-- ============================================
-- FINAL FIX: Clean and populate actual_lead_time
-- ============================================

-- Step 1: Clean ALL orphaned and test data from actual_lead_time
DELETE FROM actual_lead_time 
WHERE product_id NOT IN (SELECT product_id FROM product_master)
   OR product_id LIKE 'P00%'
   OR location_id LIKE 'L_%';

-- Step 2: Insert lead times for ALL real product-location pairs
INSERT INTO actual_lead_time (product_id, location_id, actual_lead_time_days, updated_at)
SELECT DISTINCT 
  plp.product_id,
  plp.location_id,
  CASE 
    -- Fresh finished products: 2 days
    WHEN pm.product_id IN ('BIG_MAC', 'QTR_POUNDER', 'MCMUFFIN_EGG') THEN 2
    -- Frozen finished products: 3 days
    WHEN pm.product_id IN ('FRIES_LARGE', 'MCNUGGETS_10') THEN 3
    -- Dry goods/beverages: 7 days
    WHEN pm.product_id IN ('COKE_MEDIUM') THEN 7
    -- Raw materials: 5 days (for ingredients)
    WHEN pm.category IN ('Raw Material', 'Ingredient') THEN 5
    -- Default for everything else
    ELSE 7
  END as lead_time,
  NOW()
FROM product_location_pairs plp
INNER JOIN product_master pm ON plp.product_id = pm.product_id
ON CONFLICT (product_id, location_id)
DO UPDATE SET 
  actual_lead_time_days = EXCLUDED.actual_lead_time_days,
  updated_at = NOW();

-- Step 3: Clean orphaned on_hand_inventory records (ingredients without product-location pairs)
DELETE FROM on_hand_inventory
WHERE NOT EXISTS (
  SELECT 1 FROM product_location_pairs plp
  WHERE plp.product_id = on_hand_inventory.product_id
    AND plp.location_id = on_hand_inventory.location_id
);

-- Step 4: Verify counts
DO $$
DECLARE
  v_lead_time_count INTEGER;
  v_pairs_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_lead_time_count FROM actual_lead_time;
  SELECT COUNT(*) INTO v_pairs_count FROM product_location_pairs;
  
  RAISE NOTICE 'Lead time records: %, Product-location pairs: %', v_lead_time_count, v_pairs_count;
  
  IF v_lead_time_count < v_pairs_count THEN
    RAISE WARNING 'Missing lead time records! Expected: %, Got: %', v_pairs_count, v_lead_time_count;
  END IF;
END $$;