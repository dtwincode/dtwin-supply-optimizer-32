-- First, update existing McDonald's products with proper details
UPDATE product_master SET
  sku = 'MENU-001',
  name = 'Big Mac',
  category = 'Burgers',
  subcategory = 'Signature',
  product_type = 'FINISHED_GOOD',
  shelf_life_days = 1,
  preparation_time_minutes = 3,
  buffer_profile_id = 'BP_HIGH'
WHERE product_id = 'BIG_MAC';

UPDATE product_master SET
  sku = 'MENU-002',
  name = 'Quarter Pounder',
  category = 'Burgers',
  subcategory = 'Signature',
  product_type = 'FINISHED_GOOD',
  shelf_life_days = 1,
  preparation_time_minutes = 4,
  buffer_profile_id = 'BP_HIGH'
WHERE product_id = 'QTR_POUNDER';

-- Update ingredient products
UPDATE product_master SET
  sku = 'ING-001',
  name = 'Big Mac Bun',
  category = 'Ingredients',
  subcategory = 'Buns',
  product_type = 'RAW_MATERIAL',
  shelf_life_days = 7,
  storage_temp_min = 2,
  storage_temp_max = 8,
  buffer_profile_id = 'BP_MEDIUM'
WHERE product_id = 'BUN_BIG_MAC';

UPDATE product_master SET
  sku = 'ING-010',
  name = 'Regular Beef Patty',
  category = 'Ingredients',
  subcategory = 'Proteins',
  product_type = 'RAW_MATERIAL',
  shelf_life_days = 3,
  storage_temp_min = -2,
  storage_temp_max = 2,
  buffer_profile_id = 'BP_HIGH'
WHERE product_id = 'PATTY_REGULAR';

UPDATE product_master SET
  sku = 'ING-011',
  name = 'Quarter Pound Patty',
  category = 'Ingredients',
  subcategory = 'Proteins',
  product_type = 'RAW_MATERIAL',
  shelf_life_days = 3,
  storage_temp_min = -2,
  storage_temp_max = 2,
  buffer_profile_id = 'BP_HIGH'
WHERE product_id = 'PATTY_QUARTER';

UPDATE product_master SET
  sku = 'ING-020',
  name = 'American Cheese Slice',
  category = 'Ingredients',
  subcategory = 'Dairy',
  product_type = 'RAW_MATERIAL',
  shelf_life_days = 30,
  storage_temp_min = 2,
  storage_temp_max = 8,
  buffer_profile_id = 'BP_HIGH'
WHERE product_id = 'CHEESE_AMERICAN';

UPDATE product_master SET
  sku = 'ING-030',
  name = 'Shredded Lettuce (g)',
  category = 'Ingredients',
  subcategory = 'Vegetables',
  product_type = 'RAW_MATERIAL',
  shelf_life_days = 3,
  storage_temp_min = 2,
  storage_temp_max = 8,
  buffer_profile_id = 'BP_MEDIUM'
WHERE product_id = 'LETTUCE_SHREDDED';

UPDATE product_master SET
  sku = 'ING-031',
  name = 'Diced Onion (g)',
  category = 'Ingredients',
  subcategory = 'Vegetables',
  product_type = 'RAW_MATERIAL',
  shelf_life_days = 3,
  storage_temp_min = 2,
  storage_temp_max = 8,
  buffer_profile_id = 'BP_MEDIUM'
WHERE product_id = 'ONION_DICED';

UPDATE product_master SET
  sku = 'ING-032',
  name = 'Pickle Slices (g)',
  category = 'Ingredients',
  subcategory = 'Vegetables',
  product_type = 'RAW_MATERIAL',
  shelf_life_days = 30,
  storage_temp_min = 2,
  storage_temp_max = 8,
  buffer_profile_id = 'BP_LOW'
WHERE product_id = 'PICKLES';

UPDATE product_master SET
  sku = 'ING-040',
  name = 'Big Mac Sauce (ml)',
  category = 'Ingredients',
  subcategory = 'Sauces',
  product_type = 'RAW_MATERIAL',
  shelf_life_days = 30,
  storage_temp_min = 2,
  storage_temp_max = 8,
  buffer_profile_id = 'BP_MEDIUM'
WHERE product_id = 'SAUCE_BIG_MAC';

-- Delete old electronics products that still remain
DELETE FROM historical_sales_data WHERE product_id NOT IN (SELECT product_id FROM product_master WHERE category NOT IN ('Electronics', 'Accessories'));
DELETE FROM product_master WHERE category IN ('Electronics', 'Accessories');