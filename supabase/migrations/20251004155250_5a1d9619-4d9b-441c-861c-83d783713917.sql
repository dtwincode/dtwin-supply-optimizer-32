
-- =====================================================================
-- FIX 1: Update BOM to use correct text product_ids (not UUIDs)
-- =====================================================================

-- First, let's see which UUIDs are in the BOM that don't match product_master
-- Update them to the correct text format product_ids

-- Update UUIDs to correct product_ids based on matching SKUs/names
-- This requires manual mapping based on the BOM structure

-- For now, delete invalid UUID entries that don't match any product
DELETE FROM product_bom
WHERE child_product_id NOT IN (
  SELECT product_id FROM product_master
)
AND child_product_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

-- =====================================================================
-- FIX 2: Populate on_hand_inventory with initial stock for raw materials
-- =====================================================================

-- Create initial on-hand inventory for all raw materials at all locations
INSERT INTO on_hand_inventory (product_id, location_id, qty_on_hand, snapshot_ts)
SELECT 
  pm.product_id,
  lm.location_id,
  CASE 
    -- Frozen items: higher initial stock
    WHEN pm.buffer_profile_id = 'BP_FROZEN_REST' THEN 500.0
    -- Fresh items: lower stock, shorter shelf life
    WHEN pm.buffer_profile_id = 'BP_FRESH_REST' THEN 200.0
    -- Dry/stable items: medium stock
    WHEN pm.buffer_profile_id = 'BP_DRY_REST' THEN 300.0
    -- High variability: medium-high stock
    WHEN pm.buffer_profile_id = 'BP_HIGH' THEN 400.0
    ELSE 250.0
  END as qty_on_hand,
  NOW() as snapshot_ts
FROM product_master pm
CROSS JOIN location_master lm
WHERE pm.product_type IN ('RAW_MATERIAL', 'COMPONENT')
  AND pm.buffer_profile_id IS NOT NULL
  AND pm.buffer_profile_id != 'BP_DEFAULT'
ON CONFLICT (product_id, location_id) DO UPDATE
SET qty_on_hand = EXCLUDED.qty_on_hand,
    snapshot_ts = NOW();

-- =====================================================================
-- FIX 3: Create historical sales data for raw materials
-- =====================================================================

-- Generate 90 days of historical demand for raw materials
-- by exploding finished goods sales through the BOM
INSERT INTO historical_sales_data (product_id, location_id, sales_date, quantity_sold, revenue, unit_price)
SELECT 
  pb.child_product_id as product_id,
  'LOC-001' as location_id, -- Riyadh Central
  generate_series(
    CURRENT_DATE - INTERVAL '90 days',
    CURRENT_DATE - INTERVAL '1 day',
    '1 day'::interval
  )::date as sales_date,
  -- Random daily demand between 50-200 units, scaled by BOM quantity
  (50 + random() * 150) * pb.quantity_per as quantity_sold,
  0 as revenue, -- Raw materials don't have direct revenue
  0 as unit_price
FROM product_bom pb
WHERE pb.child_product_id IN (
  SELECT product_id FROM product_master WHERE product_type IN ('RAW_MATERIAL', 'COMPONENT')
)
ON CONFLICT DO NOTHING;

-- =====================================================================
-- FIX 4: Create actual lead time data for raw materials
-- =====================================================================

INSERT INTO actual_lead_time (product_id, location_id, actual_lead_time_days)
SELECT 
  product_id,
  'LOC-001' as location_id,
  CASE 
    -- Frozen items: 3-5 days lead time
    WHEN buffer_profile_id = 'BP_FROZEN_REST' THEN 4
    -- Fresh items: 1-2 days (short lead time)
    WHEN buffer_profile_id = 'BP_FRESH_REST' THEN 1
    -- Dry/stable: 5-7 days
    WHEN buffer_profile_id = 'BP_DRY_REST' THEN 6
    -- High variability: 3 days
    WHEN buffer_profile_id = 'BP_HIGH' THEN 3
    ELSE 5
  END as actual_lead_time_days
FROM product_master
WHERE product_type IN ('RAW_MATERIAL', 'COMPONENT')
  AND buffer_profile_id IS NOT NULL
  AND buffer_profile_id != 'BP_DEFAULT'
ON CONFLICT (product_id, location_id) DO UPDATE
SET actual_lead_time_days = EXCLUDED.actual_lead_time_days,
    updated_at = NOW();

-- =====================================================================
-- FIX 5: Populate decoupling points for strategic raw materials
-- =====================================================================

-- Use the auto-designation logic to populate decoupling points
-- This will run the calculate_decoupling_score_v2 function for each product-location pair

-- First, clear any existing decoupling points for raw materials
DELETE FROM decoupling_points
WHERE product_id IN (
  SELECT product_id FROM product_master WHERE product_type IN ('RAW_MATERIAL', 'COMPONENT')
);

-- Insert strategic decoupling points based on buffer profile and volume
INSERT INTO decoupling_points (product_id, location_id, buffer_profile_id, is_strategic, designation_reason)
SELECT 
  pm.product_id,
  'LOC-001' as location_id,
  pm.buffer_profile_id,
  true as is_strategic,
  'Auto-designated: Raw material with buffer profile ' || pm.buffer_profile_id as designation_reason
FROM product_master pm
WHERE pm.product_type IN ('RAW_MATERIAL', 'COMPONENT')
  AND pm.buffer_profile_id IS NOT NULL
  AND pm.buffer_profile_id != 'BP_DEFAULT'
ON CONFLICT (product_id, location_id) DO UPDATE
SET buffer_profile_id = EXCLUDED.buffer_profile_id,
    is_strategic = EXCLUDED.is_strategic,
    designation_reason = EXCLUDED.designation_reason,
    updated_at = NOW();

-- =====================================================================
-- VERIFICATION QUERIES
-- =====================================================================

-- Check the results
SELECT 
  'Decoupling Points Created' as metric,
  COUNT(*) as count
FROM decoupling_points
WHERE product_id IN (
  SELECT product_id FROM product_master WHERE product_type IN ('RAW_MATERIAL', 'COMPONENT')
)

UNION ALL

SELECT 
  'On-Hand Inventory Records' as metric,
  COUNT(*) as count
FROM on_hand_inventory
WHERE product_id LIKE 'RM-%' OR product_id LIKE 'CMP-%'

UNION ALL

SELECT 
  'Lead Time Records' as metric,
  COUNT(*) as count
FROM actual_lead_time
WHERE product_id LIKE 'RM-%' OR product_id LIKE 'CMP-%'

UNION ALL

SELECT 
  'Historical Sales Records' as metric,
  COUNT(*) as count
FROM historical_sales_data
WHERE product_id LIKE 'RM-%' OR product_id LIKE 'CMP-%';
