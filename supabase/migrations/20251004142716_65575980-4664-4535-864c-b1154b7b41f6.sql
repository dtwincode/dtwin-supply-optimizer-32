-- Remove duplicate Distribution Centers and their hierarchy entries
-- Step 1: Delete hierarchy references
DELETE FROM location_hierarchy
WHERE location_id IN ('DC-001', 'DC-002', 'DC-003', 'DC-004', 'DC-005')
OR parent_location_id IN ('DC-001', 'DC-002', 'DC-003', 'DC-004', 'DC-005');

-- Step 2: Delete the locations
DELETE FROM location_master
WHERE location_type = 'Distribution Center'
AND location_id IN ('DC-001', 'DC-002', 'DC-003', 'DC-004', 'DC-005');