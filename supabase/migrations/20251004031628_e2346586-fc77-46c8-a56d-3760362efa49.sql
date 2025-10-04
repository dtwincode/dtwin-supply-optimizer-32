-- Update shelf life, storage temps, and prep times for Burgerizzr products

-- Bestsellers/Limited Offers - Complex combos with hot items
UPDATE product_master SET 
  shelf_life_days = 0, -- Fresh daily, assembled to order
  storage_temp_min = 60, -- Hot holding temperature
  storage_temp_max = 65,
  preparation_time_minutes = 12
WHERE sku LIKE 'BST-%';

-- Gathering Boxes - Large combo boxes
UPDATE product_master SET 
  shelf_life_days = 0,
  storage_temp_min = 60,
  storage_temp_max = 65,
  preparation_time_minutes = 15 -- More items to assemble
WHERE sku LIKE 'GBX-%';

-- Solo Boxes - Individual combos
UPDATE product_master SET 
  shelf_life_days = 0,
  storage_temp_min = 60,
  storage_temp_max = 65,
  preparation_time_minutes = 10
WHERE sku LIKE 'SBX-%';

-- Beef Burgers - Grilled beef items
UPDATE product_master SET 
  shelf_life_days = 0,
  storage_temp_min = 60,
  storage_temp_max = 65,
  preparation_time_minutes = 8
WHERE sku LIKE 'BEF-%';

-- Chicken Burgers - Grilled/fried chicken
UPDATE product_master SET 
  shelf_life_days = 0,
  storage_temp_min = 60,
  storage_temp_max = 65,
  preparation_time_minutes = 9
WHERE sku LIKE 'CHK-%';

-- Sandwiches/Wraps
UPDATE product_master SET 
  shelf_life_days = 0,
  storage_temp_min = 60,
  storage_temp_max = 65,
  preparation_time_minutes = 7
WHERE sku LIKE 'SND-%';

-- Fries - Hot sides
UPDATE product_master SET 
  shelf_life_days = 0,
  storage_temp_min = 60,
  storage_temp_max = 65,
  preparation_time_minutes = 4
WHERE sku IN ('SID-001', 'SID-002');

-- Chicken Strips, Nuggets, Wingers - Fried items
UPDATE product_master SET 
  shelf_life_days = 0,
  storage_temp_min = 60,
  storage_temp_max = 65,
  preparation_time_minutes = 6
WHERE sku IN ('SID-003', 'SID-004', 'SID-005');

-- Sauces - Refrigerated condiments
UPDATE product_master SET 
  shelf_life_days = 3, -- Opened sauce containers
  storage_temp_min = 2, -- Refrigerated
  storage_temp_max = 4,
  preparation_time_minutes = 1
WHERE sku LIKE 'SAU-%';

-- Drinks - Cold beverages
UPDATE product_master SET 
  shelf_life_days = 1, -- Fountain drinks fresh daily
  storage_temp_min = 2, -- Cold storage
  storage_temp_max = 8,
  preparation_time_minutes = 2
WHERE sku LIKE 'DRK-%';