-- Assign Buffer Profiles to Products Based on Category and Characteristics

-- 1. FROZEN PRODUCTS (Chicken, Beef, Fries) → BP_FROZEN_REST
UPDATE product_master
SET buffer_profile_id = 'BP_FROZEN_REST'
WHERE category IN ('Poultry', 'Beef', 'Frozen Sides')
  OR product_type = 'FROZEN'
  OR name ILIKE '%chicken%'
  OR name ILIKE '%beef%'
  OR name ILIKE '%fries%';

-- 2. FRESH PRODUCE (Lettuce, Tomatoes, Onions, Pickles) → BP_FRESH_REST
UPDATE product_master
SET buffer_profile_id = 'BP_FRESH_REST'
WHERE category IN ('Vegetables', 'Produce', 'Fresh Ingredients')
  OR product_type = 'FRESH'
  OR name ILIKE '%lettuce%'
  OR name ILIKE '%tomato%'
  OR name ILIKE '%onion%'
  OR name ILIKE '%pickle%';

-- 3. DRY/SHELF-STABLE (Buns, Sauces, Cheese, Packaging) → BP_DRY_REST
UPDATE product_master
SET buffer_profile_id = 'BP_DRY_REST'
WHERE category IN ('Bakery', 'Condiments', 'Dairy', 'Packaging', 'Supplies')
  OR product_type = 'DRY'
  OR name ILIKE '%bun%'
  OR name ILIKE '%sauce%'
  OR name ILIKE '%ketchup%'
  OR name ILIKE '%cheese%'
  OR name ILIKE '%box%'
  OR name ILIKE '%cup%'
  OR name ILIKE '%bag%';

-- 4. HIGH VARIABILITY BEVERAGES → BP_HIGH
UPDATE product_master
SET buffer_profile_id = 'BP_HIGH'
WHERE category IN ('Beverages', 'Drinks')
  OR name ILIKE '%cola%'
  OR name ILIKE '%water%'
  OR name ILIKE '%juice%'
  OR name ILIKE '%soda%';

-- 5. CORE STABLE ITEMS (if any remain) → BP_LOW
UPDATE product_master
SET buffer_profile_id = 'BP_LOW'
WHERE buffer_profile_id = 'BP_DEFAULT'
  AND category IN ('Core Menu Items', 'Essentials');

-- Summary Report: Show the distribution of buffer profiles
SELECT 
  buffer_profile_id,
  COUNT(*) as product_count,
  STRING_AGG(DISTINCT category, ', ') as categories
FROM product_master
GROUP BY buffer_profile_id
ORDER BY product_count DESC;