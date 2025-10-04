-- Add Distribution Centers and Warehouses to location_master
INSERT INTO location_master (location_id, region, location_type, demographic_profile, restaurant_number) VALUES
-- Main Distribution Centers
('DC-001', 'Riyadh', 'Distribution Center', 'URBAN', 'Central Distribution Hub'),
('DC-002', 'Jeddah', 'Distribution Center', 'URBAN', 'Western Distribution Hub'),
('DC-003', 'Dammam', 'Distribution Center', 'URBAN', 'Eastern Distribution Hub'),
('DC-004', 'Tabuk', 'Distribution Center', 'URBAN', 'Northern Distribution Hub'),
('DC-005', 'Abha', 'Distribution Center', 'URBAN', 'Southern Distribution Hub'),

-- Regional Warehouses
('WH-001', 'Buraydah', 'Warehouse', 'URBAN', 'Qassim Regional Warehouse'),
('WH-002', 'Madinah', 'Warehouse', 'URBAN', 'Madinah Regional Warehouse'),
('WH-003', 'Makkah', 'Warehouse', 'URBAN', 'Makkah Regional Warehouse'),
('WH-004', 'Hail', 'Warehouse', 'URBAN', 'Hail Regional Warehouse'),
('WH-005', 'Al Ahsa (Hufuf)', 'Warehouse', 'URBAN', 'Al Ahsa Regional Warehouse');

-- Build location hierarchy
DELETE FROM location_hierarchy;

-- Level 1: Main Distribution Centers (no parent)
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy) VALUES
('DC-001', 'DC', 1, NULL, 'standard'),
('DC-002', 'DC', 1, NULL, 'standard'),
('DC-003', 'DC', 1, NULL, 'standard'),
('DC-004', 'DC', 1, NULL, 'standard'),
('DC-005', 'DC', 1, NULL, 'standard');

-- Level 2: Regional Warehouses (parent = DC)
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy) VALUES
('WH-001', 'WAREHOUSE', 2, 'DC-001', 'standard'),
('WH-002', 'WAREHOUSE', 2, 'DC-002', 'standard'),
('WH-003', 'WAREHOUSE', 2, 'DC-002', 'standard'),
('WH-004', 'WAREHOUSE', 2, 'DC-004', 'standard'),
('WH-005', 'WAREHOUSE', 2, 'DC-003', 'standard');

-- Level 3: Restaurant Stores
-- Central Region → DC-001
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'DC-001', 'standard'
FROM location_master
WHERE region IN ('Riyadh', 'Al-Kharj', 'Al Duwadimi', 'Al Majma''ah', 'Az Zulfi')
AND location_type = 'Restaurant';

-- Qassim Region → WH-001
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'WH-001', 'standard'
FROM location_master
WHERE region IN ('Buraydah', 'Unaizah', 'Ar Rass', 'Al Bukayriyah')
AND location_type = 'Restaurant';

-- Jeddah & Taif → DC-002
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'DC-002', 'standard'
FROM location_master
WHERE region IN ('Jeddah', 'Taif')
AND location_type = 'Restaurant';

-- Makkah → WH-003
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'WH-003', 'standard'
FROM location_master
WHERE region = 'Makkah'
AND location_type = 'Restaurant';

-- Madinah & Sufait → WH-002
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'WH-002', 'standard'
FROM location_master
WHERE region IN ('Madinah', 'Sufait')
AND location_type = 'Restaurant';

-- Eastern Region → DC-003
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'DC-003', 'standard'
FROM location_master
WHERE region IN ('Dammam', 'Al Khobar', 'Al Mubarraz')
AND location_type = 'Restaurant';

-- Al Ahsa → WH-005
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'WH-005', 'standard'
FROM location_master
WHERE region = 'Al Ahsa (Hufuf)'
AND location_type = 'Restaurant';

-- Northern Region → DC-004
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'DC-004', 'standard'
FROM location_master
WHERE region IN ('Tabuk', 'Al Qurayyat', 'Hafar Al Batin')
AND location_type = 'Restaurant';

-- Hail → WH-004
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'WH-004', 'standard'
FROM location_master
WHERE region = 'Hail'
AND location_type = 'Restaurant';

-- Southern Region → DC-005
INSERT INTO location_hierarchy (location_id, echelon_type, echelon_level, parent_location_id, buffer_strategy)
SELECT location_id, 'STORE', 3, 'DC-005', 'standard'
FROM location_master
WHERE region IN ('Abha', 'Jazan', 'Najran', 'Khamis Mushait', 'Baljurashi', 'Al Bahah', 'Almuruj')
AND location_type = 'Restaurant';