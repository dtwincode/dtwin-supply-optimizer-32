
-- Clean up invalid decoupling points (locations not in location_master)
DELETE FROM decoupling_points
WHERE NOT EXISTS (
  SELECT 1 FROM location_master lm WHERE lm.location_id = decoupling_points.location_id
);

-- Clean up invalid product_location_pairs (locations not in location_master)
DELETE FROM product_location_pairs
WHERE NOT EXISTS (
  SELECT 1 FROM location_master lm WHERE lm.location_id = product_location_pairs.location_id
);

-- Close any alignment violations for invalid locations that were just cleaned
UPDATE alignment_violations
SET status = 'resolved',
    resolved_at = now(),
    resolution_action = 'Auto-cleaned: Invalid location removed from database'
WHERE violation_type = 'invalid_location'
  AND status = 'open'
  AND NOT EXISTS (
    SELECT 1 FROM decoupling_points dp 
    WHERE dp.location_id = alignment_violations.location_id 
    AND dp.product_id = alignment_violations.product_id
  );
