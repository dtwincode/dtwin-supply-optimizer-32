-- First, delete buffer recalculation history for invalid locations
DELETE FROM buffer_recalculation_history
WHERE location_id NOT IN (
  SELECT location_id FROM location_master
);

-- Then delete decoupling points with invalid locations
DELETE FROM decoupling_points
WHERE location_id NOT IN (
  SELECT location_id FROM location_master
);

-- Clean up alignment violations for invalid locations
DELETE FROM alignment_violations
WHERE location_id NOT IN (
  SELECT location_id FROM location_master
  UNION ALL
  SELECT 'Multiple'
);