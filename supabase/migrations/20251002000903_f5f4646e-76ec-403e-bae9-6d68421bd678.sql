-- Delete old decoupling points that reference deleted products
DELETE FROM decoupling_points 
WHERE product_id NOT IN (SELECT product_id FROM product_master);

-- Add decoupling points for McDonald's menu items at all restaurant locations
INSERT INTO decoupling_points (product_id, location_id, buffer_profile_id, is_strategic, designation_reason)
SELECT 
  p.product_id,
  l.location_id,
  p.buffer_profile_id,
  true,
  'Strategic menu item - high demand'
FROM product_master p
CROSS JOIN location_master l
WHERE p.category IN ('Burgers', 'Chicken', 'Fish', 'Sides')
  AND l.location_type = 'RESTAURANT'
ON CONFLICT (product_id, location_id) DO UPDATE
SET buffer_profile_id = EXCLUDED.buffer_profile_id,
    designation_reason = EXCLUDED.designation_reason;