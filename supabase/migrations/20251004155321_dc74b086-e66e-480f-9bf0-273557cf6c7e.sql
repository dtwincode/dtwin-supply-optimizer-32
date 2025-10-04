
-- =====================================================================
-- CLEANUP: Remove remaining UUID entries from BOM and fix parent_products
-- =====================================================================

-- Remove all BOM entries with UUID format that don't match product_master
DELETE FROM product_bom
WHERE (
  child_product_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  OR parent_product_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
)
AND (
  child_product_id NOT IN (SELECT product_id FROM product_master)
  OR parent_product_id NOT IN (SELECT product_id FROM product_master)
);

-- =====================================================================
-- CLEANUP: Remove buffer profiles from finished goods
-- =====================================================================

UPDATE product_master
SET buffer_profile_id = NULL
WHERE product_type = 'FINISHED_GOOD';

-- =====================================================================
-- VERIFICATION: Show final state
-- =====================================================================

SELECT 
  'Finished Goods WITHOUT Buffer' as metric,
  COUNT(*) as count
FROM product_master
WHERE product_type = 'FINISHED_GOOD' AND buffer_profile_id IS NULL

UNION ALL

SELECT 
  'Raw Materials WITH Buffer' as metric,
  COUNT(*) as count
FROM product_master
WHERE product_type IN ('RAW_MATERIAL', 'COMPONENT') 
  AND buffer_profile_id IS NOT NULL
  AND buffer_profile_id != 'BP_DEFAULT'

UNION ALL

SELECT 
  'Valid BOM Entries' as metric,
  COUNT(*) as count
FROM product_bom
WHERE child_product_id IN (SELECT product_id FROM product_master)
  AND parent_product_id IN (SELECT product_id FROM product_master)

UNION ALL

SELECT 
  'Buffer View Records' as metric,
  COUNT(*) as count
FROM inventory_ddmrp_buffers_view

UNION ALL

SELECT 
  'Decoupling Points' as metric,
  COUNT(*) as count
FROM decoupling_points;
