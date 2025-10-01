-- =====================================================
-- Phase 1: McDonald's DDMRP Database Foundation (Fixed)
-- =====================================================

-- 1. Create Product BOM Table for Multi-Level Product Structure
CREATE TABLE IF NOT EXISTS product_bom (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_product_id text NOT NULL REFERENCES product_master(product_id),
  child_product_id text NOT NULL REFERENCES product_master(product_id),
  quantity_per numeric NOT NULL CHECK (quantity_per > 0),
  bom_level integer NOT NULL CHECK (bom_level >= 0),
  operation_sequence integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(parent_product_id, child_product_id)
);

CREATE INDEX IF NOT EXISTS idx_bom_parent ON product_bom(parent_product_id);
CREATE INDEX IF NOT EXISTS idx_bom_child ON product_bom(child_product_id);
CREATE INDEX IF NOT EXISTS idx_bom_level ON product_bom(bom_level);

-- Enable RLS
ALTER TABLE product_bom ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated full access to product_bom" ON product_bom;
CREATE POLICY "Allow authenticated full access to product_bom"
ON product_bom FOR ALL
USING (true)
WITH CHECK (true);

-- 2. Extend Product Master with Food Service Attributes
ALTER TABLE product_master 
ADD COLUMN IF NOT EXISTS shelf_life_days integer,
ADD COLUMN IF NOT EXISTS storage_temp_min numeric,
ADD COLUMN IF NOT EXISTS storage_temp_max numeric,
ADD COLUMN IF NOT EXISTS preparation_time_minutes integer,
ADD COLUMN IF NOT EXISTS product_type text,
ADD COLUMN IF NOT EXISTS supplier_id text,
ADD COLUMN IF NOT EXISTS unit_of_measure text DEFAULT 'EACH';

-- Add constraint for product_type if column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'product_master' AND constraint_name LIKE '%product_type%'
  ) THEN
    ALTER TABLE product_master 
    ADD CONSTRAINT product_type_check 
    CHECK (product_type IN ('FINISHED_GOOD', 'INGREDIENT', 'PACKAGING', 'RAW_MATERIAL'));
  END IF;
END $$;

-- 3. Extend Location Master with Restaurant Operations Attributes
ALTER TABLE location_master 
ADD COLUMN IF NOT EXISTS restaurant_number text,
ADD COLUMN IF NOT EXISTS daily_sales_volume numeric,
ADD COLUMN IF NOT EXISTS seating_capacity integer,
ADD COLUMN IF NOT EXISTS drive_thru boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS operating_hours jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS demographic_profile text;

-- Add constraint for demographic_profile
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'location_master' AND constraint_name LIKE '%demographic_profile%'
  ) THEN
    ALTER TABLE location_master 
    ADD CONSTRAINT demographic_profile_check 
    CHECK (demographic_profile IN ('URBAN', 'SUBURBAN', 'HIGHWAY', 'RURAL'));
  END IF;
END $$;

-- 4. Add unique constraints to tables for upsert operations
ALTER TABLE on_hand_inventory 
DROP CONSTRAINT IF EXISTS on_hand_inventory_product_location_unique;

ALTER TABLE on_hand_inventory 
ADD CONSTRAINT on_hand_inventory_product_location_unique 
UNIQUE (product_id, location_id);

ALTER TABLE master_lead_time 
DROP CONSTRAINT IF EXISTS master_lead_time_product_location_unique;

ALTER TABLE master_lead_time 
ADD CONSTRAINT master_lead_time_product_location_unique 
UNIQUE (product_id, location_id);

-- 5. Insert McDonald's-Specific Buffer Profiles
INSERT INTO buffer_profile_master (buffer_profile_id, name, description, lt_factor, variability_factor, order_cycle_days, min_order_qty, rounding_multiple) VALUES
('BP_FROZEN_REST', 'Frozen - Restaurant', 'Frozen items at restaurant with 2-3 day buffer', 0.3, 0.2, 2, 50, 10),
('BP_FRESH_REST', 'Fresh - Restaurant', 'Fresh items with daily delivery', 0.1, 0.4, 1, 20, 5),
('BP_DRY_REST', 'Dry Goods - Restaurant', 'Dry goods with weekly delivery', 1.0, 0.15, 7, 100, 25),
('BP_FROZEN_DC', 'Frozen - Distribution Center', 'DC frozen storage with supplier lead times', 1.5, 0.3, 7, 500, 100),
('BP_FRESH_DC', 'Fresh - Distribution Center', 'DC fresh with short supplier lead times', 0.5, 0.5, 2, 200, 50),
('BP_DRY_DC', 'Dry Goods - Distribution Center', 'DC dry storage for packaging and condiments', 2.0, 0.1, 14, 1000, 100)
ON CONFLICT (buffer_profile_id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  lt_factor = EXCLUDED.lt_factor,
  variability_factor = EXCLUDED.variability_factor,
  order_cycle_days = EXCLUDED.order_cycle_days,
  min_order_qty = EXCLUDED.min_order_qty,
  rounding_multiple = EXCLUDED.rounding_multiple;

-- 6. Insert McDonald's Products - Finished Goods
INSERT INTO product_master (product_id, sku, name, category, subcategory, product_family, product_type, shelf_life_days, preparation_time_minutes, buffer_profile_id, unit_of_measure) VALUES
('BIG_MAC', 'FG-001', 'Big Mac', 'Burgers', 'Signature', 'Sandwiches', 'FINISHED_GOOD', NULL, 4, 'BP_FRESH_REST', 'EACH'),
('QTR_POUNDER', 'FG-002', 'Quarter Pounder with Cheese', 'Burgers', 'Beef', 'Sandwiches', 'FINISHED_GOOD', NULL, 5, 'BP_FRESH_REST', 'EACH'),
('MCNUGGETS_10', 'FG-003', '10-piece Chicken McNuggets', 'Chicken', 'Nuggets', 'Chicken', 'FINISHED_GOOD', NULL, 3, 'BP_FROZEN_REST', 'EACH'),
('FRIES_LARGE', 'FG-004', 'Large French Fries', 'Sides', 'Fries', 'Sides', 'FINISHED_GOOD', NULL, 3, 'BP_FROZEN_REST', 'EACH'),
('MCMUFFIN_EGG', 'FG-005', 'Egg McMuffin', 'Breakfast', 'Sandwiches', 'Breakfast', 'FINISHED_GOOD', NULL, 3, 'BP_FRESH_REST', 'EACH'),
('COKE_MEDIUM', 'FG-006', 'Medium Coca-Cola', 'Beverages', 'Soft Drinks', 'Beverages', 'FINISHED_GOOD', NULL, 1, 'BP_DRY_REST', 'EACH')
ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  product_type = EXCLUDED.product_type,
  buffer_profile_id = EXCLUDED.buffer_profile_id;

-- 7. Insert McDonald's Products - Ingredients
INSERT INTO product_master (product_id, sku, name, category, subcategory, product_type, shelf_life_days, storage_temp_min, storage_temp_max, buffer_profile_id, unit_of_measure) VALUES
('BUN_BIG_MAC', 'IN-001', 'Big Mac Bun (3-piece)', 'Ingredients', 'Bakery', 'INGREDIENT', 5, 2, 8, 'BP_FRESH_DC', 'EACH'),
('BUN_REGULAR', 'IN-002', 'Regular Hamburger Bun', 'Ingredients', 'Bakery', 'INGREDIENT', 5, 2, 8, 'BP_FRESH_DC', 'EACH'),
('MUFFIN_ENGLISH', 'IN-003', 'English Muffin', 'Ingredients', 'Bakery', 'INGREDIENT', 7, 2, 8, 'BP_FRESH_DC', 'EACH'),
('PATTY_QUARTER', 'IN-004', 'Quarter Pound Beef Patty (Frozen)', 'Ingredients', 'Meat', 'INGREDIENT', 90, -18, -15, 'BP_FROZEN_DC', 'EACH'),
('PATTY_REGULAR', 'IN-005', 'Regular Beef Patty (Frozen)', 'Ingredients', 'Meat', 'INGREDIENT', 90, -18, -15, 'BP_FROZEN_DC', 'EACH'),
('NUGGETS_RAW', 'IN-006', 'Chicken Nuggets (Frozen Raw)', 'Ingredients', 'Chicken', 'INGREDIENT', 180, -18, -15, 'BP_FROZEN_DC', 'EACH'),
('CHEESE_AMERICAN', 'IN-007', 'American Cheese Slice', 'Ingredients', 'Dairy', 'INGREDIENT', 21, 2, 8, 'BP_FRESH_DC', 'EACH'),
('LETTUCE_SHREDDED', 'IN-008', 'Shredded Iceberg Lettuce', 'Ingredients', 'Produce', 'INGREDIENT', 3, 2, 8, 'BP_FRESH_DC', 'GRAM'),
('TOMATO_SLICED', 'IN-009', 'Sliced Tomatoes', 'Ingredients', 'Produce', 'INGREDIENT', 2, 2, 8, 'BP_FRESH_DC', 'EACH'),
('ONION_DICED', 'IN-010', 'Diced Onions', 'Ingredients', 'Produce', 'INGREDIENT', 5, 2, 8, 'BP_FRESH_DC', 'GRAM'),
('PICKLES', 'IN-011', 'Pickle Slices', 'Ingredients', 'Condiments', 'INGREDIENT', 90, 2, 8, 'BP_DRY_DC', 'GRAM'),
('SAUCE_BIG_MAC', 'IN-012', 'Big Mac Sauce', 'Ingredients', 'Sauces', 'INGREDIENT', 30, 2, 8, 'BP_FRESH_DC', 'GRAM'),
('POTATOES_FRIES', 'IN-013', 'French Fry Potatoes (Frozen)', 'Ingredients', 'Produce', 'INGREDIENT', 180, -18, -15, 'BP_FROZEN_DC', 'GRAM'),
('EGG_ROUND', 'IN-014', 'Round Folded Egg', 'Ingredients', 'Eggs', 'INGREDIENT', 14, 2, 8, 'BP_FRESH_DC', 'EACH'),
('SYRUP_COKE', 'IN-015', 'Coca-Cola Syrup', 'Ingredients', 'Beverages', 'INGREDIENT', 180, 15, 25, 'BP_DRY_DC', 'LITER')
ON CONFLICT (product_id) DO UPDATE SET
  name = EXCLUDED.name,
  product_type = EXCLUDED.product_type,
  shelf_life_days = EXCLUDED.shelf_life_days,
  storage_temp_min = EXCLUDED.storage_temp_min,
  storage_temp_max = EXCLUDED.storage_temp_max,
  buffer_profile_id = EXCLUDED.buffer_profile_id;

-- 8. Insert BOM Relationships
INSERT INTO product_bom (parent_product_id, child_product_id, quantity_per, bom_level, operation_sequence) VALUES
('BIG_MAC', 'BUN_BIG_MAC', 1, 1, 1),
('BIG_MAC', 'PATTY_REGULAR', 2, 1, 2),
('BIG_MAC', 'CHEESE_AMERICAN', 1, 1, 3),
('BIG_MAC', 'LETTUCE_SHREDDED', 20, 1, 4),
('BIG_MAC', 'ONION_DICED', 10, 1, 5),
('BIG_MAC', 'PICKLES', 15, 1, 6),
('BIG_MAC', 'SAUCE_BIG_MAC', 30, 1, 7),
('QTR_POUNDER', 'BUN_REGULAR', 1, 1, 1),
('QTR_POUNDER', 'PATTY_QUARTER', 1, 1, 2),
('QTR_POUNDER', 'CHEESE_AMERICAN', 2, 1, 3),
('QTR_POUNDER', 'ONION_DICED', 15, 1, 4),
('QTR_POUNDER', 'PICKLES', 10, 1, 5),
('MCNUGGETS_10', 'NUGGETS_RAW', 10, 1, 1),
('FRIES_LARGE', 'POTATOES_FRIES', 150, 1, 1),
('MCMUFFIN_EGG', 'MUFFIN_ENGLISH', 1, 1, 1),
('MCMUFFIN_EGG', 'EGG_ROUND', 1, 1, 2),
('MCMUFFIN_EGG', 'CHEESE_AMERICAN', 1, 1, 3),
('COKE_MEDIUM', 'SYRUP_COKE', 0.15, 1, 1)
ON CONFLICT (parent_product_id, child_product_id) DO UPDATE SET
  quantity_per = EXCLUDED.quantity_per,
  bom_level = EXCLUDED.bom_level,
  operation_sequence = EXCLUDED.operation_sequence;

-- 9. Insert McDonald's Locations - Distribution Centers
INSERT INTO location_master (location_id, region, location_type, channel_id) VALUES
('DC_MIDWEST_CHI', 'Midwest', 'DISTRIBUTION_CENTER', 'SUPPLY_CHAIN'),
('DC_SOUTHEAST_ATL', 'Southeast', 'DISTRIBUTION_CENTER', 'SUPPLY_CHAIN'),
('DC_WEST_LA', 'West', 'DISTRIBUTION_CENTER', 'SUPPLY_CHAIN')
ON CONFLICT (location_id) DO UPDATE SET
  region = EXCLUDED.region,
  location_type = EXCLUDED.location_type;

-- 10. Insert McDonald's Locations - Restaurants
INSERT INTO location_master (location_id, region, location_type, channel_id, restaurant_number, daily_sales_volume, seating_capacity, drive_thru, demographic_profile) VALUES
('REST_CHI_001', 'Midwest', 'RESTAURANT', 'QSR', '12345', 5500, 80, true, 'SUBURBAN'),
('REST_CHI_002', 'Midwest', 'RESTAURANT', 'QSR', '12346', 8200, 120, true, 'URBAN'),
('REST_CHI_003', 'Midwest', 'RESTAURANT', 'QSR', '12347', 4200, 60, true, 'SUBURBAN'),
('REST_ATL_001', 'Southeast', 'RESTAURANT', 'QSR', '23456', 6800, 100, true, 'URBAN'),
('REST_ATL_002', 'Southeast', 'RESTAURANT', 'QSR', '23457', 3200, 50, false, 'HIGHWAY'),
('REST_LA_001', 'West', 'RESTAURANT', 'QSR', '34567', 9500, 140, true, 'URBAN'),
('REST_LA_002', 'West', 'RESTAURANT', 'QSR', '34568', 5100, 70, true, 'SUBURBAN')
ON CONFLICT (location_id) DO UPDATE SET
  restaurant_number = EXCLUDED.restaurant_number,
  daily_sales_volume = EXCLUDED.daily_sales_volume,
  seating_capacity = EXCLUDED.seating_capacity,
  drive_thru = EXCLUDED.drive_thru,
  demographic_profile = EXCLUDED.demographic_profile;

-- 11. Create Sample Inventory Data (On-Hand at Restaurants)
INSERT INTO on_hand_inventory (product_id, location_id, qty_on_hand) VALUES
('PATTY_QUARTER', 'REST_CHI_001', 450),
('PATTY_REGULAR', 'REST_CHI_001', 680),
('BUN_BIG_MAC', 'REST_CHI_001', 320),
('BUN_REGULAR', 'REST_CHI_001', 550),
('CHEESE_AMERICAN', 'REST_CHI_001', 850),
('LETTUCE_SHREDDED', 'REST_CHI_001', 12000),
('NUGGETS_RAW', 'REST_CHI_001', 520),
('POTATOES_FRIES', 'REST_CHI_001', 45000),
('PATTY_QUARTER', 'REST_CHI_002', 720),
('PATTY_REGULAR', 'REST_CHI_002', 980),
('BUN_BIG_MAC', 'REST_CHI_002', 480),
('BUN_REGULAR', 'REST_CHI_002', 820),
('CHEESE_AMERICAN', 'REST_CHI_002', 1200),
('NUGGETS_RAW', 'REST_CHI_002', 780),
('POTATOES_FRIES', 'REST_CHI_002', 68000)
ON CONFLICT (product_id, location_id) 
DO UPDATE SET qty_on_hand = EXCLUDED.qty_on_hand;

-- 12. Create Sample Lead Time Data
INSERT INTO master_lead_time (product_id, location_id, standard_lead_time_days) VALUES
('PATTY_QUARTER', 'REST_CHI_001', 2),
('PATTY_REGULAR', 'REST_CHI_001', 2),
('BUN_BIG_MAC', 'REST_CHI_001', 1),
('BUN_REGULAR', 'REST_CHI_001', 1),
('CHEESE_AMERICAN', 'REST_CHI_001', 1),
('LETTUCE_SHREDDED', 'REST_CHI_001', 1),
('NUGGETS_RAW', 'REST_CHI_001', 2),
('POTATOES_FRIES', 'REST_CHI_001', 2)
ON CONFLICT (product_id, location_id) 
DO UPDATE SET standard_lead_time_days = EXCLUDED.standard_lead_time_days;

-- 13. Create Historical Sales Data for Demand Calculation (90 days)
INSERT INTO historical_sales_data (sales_id, product_id, location_id, sales_date, quantity_sold, unit_price, revenue, transaction_type) 
SELECT 
  gen_random_uuid(),
  product_id,
  location_id,
  date_series,
  CASE 
    WHEN product_id = 'BIG_MAC' THEN FLOOR(80 + RANDOM() * 40)
    WHEN product_id = 'QTR_POUNDER' THEN FLOOR(60 + RANDOM() * 30)
    WHEN product_id = 'MCNUGGETS_10' THEN FLOOR(45 + RANDOM() * 25)
    WHEN product_id = 'FRIES_LARGE' THEN FLOOR(120 + RANDOM() * 60)
    WHEN product_id = 'MCMUFFIN_EGG' THEN FLOOR(50 + RANDOM() * 30)
    ELSE FLOOR(30 + RANDOM() * 20)
  END,
  CASE 
    WHEN product_id = 'BIG_MAC' THEN 5.49
    WHEN product_id = 'QTR_POUNDER' THEN 5.99
    WHEN product_id = 'MCNUGGETS_10' THEN 6.99
    WHEN product_id = 'FRIES_LARGE' THEN 2.89
    WHEN product_id = 'MCMUFFIN_EGG' THEN 3.99
    ELSE 2.49
  END,
  CASE 
    WHEN product_id = 'BIG_MAC' THEN (80 + RANDOM() * 40) * 5.49
    WHEN product_id = 'QTR_POUNDER' THEN (60 + RANDOM() * 30) * 5.99
    WHEN product_id = 'MCNUGGETS_10' THEN (45 + RANDOM() * 25) * 6.99
    WHEN product_id = 'FRIES_LARGE' THEN (120 + RANDOM() * 60) * 2.89
    WHEN product_id = 'MCMUFFIN_EGG' THEN (50 + RANDOM() * 30) * 3.99
    ELSE (30 + RANDOM() * 20) * 2.49
  END,
  'SALE'
FROM 
  (SELECT unnest(ARRAY['BIG_MAC', 'QTR_POUNDER', 'MCNUGGETS_10', 'FRIES_LARGE', 'MCMUFFIN_EGG', 'COKE_MEDIUM']) AS product_id) AS products,
  (SELECT unnest(ARRAY['REST_CHI_001', 'REST_CHI_002', 'REST_ATL_001']) AS location_id) AS locations,
  generate_series(CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE - INTERVAL '1 day', '1 day'::interval) AS date_series
ON CONFLICT (sales_id) DO NOTHING;