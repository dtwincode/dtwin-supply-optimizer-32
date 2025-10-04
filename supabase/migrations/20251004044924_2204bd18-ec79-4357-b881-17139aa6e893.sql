-- Step 1: Only insert raw materials and components
-- Drop and recreate constraint to allow new product types
ALTER TABLE product_master DROP CONSTRAINT IF EXISTS product_type_check;
ALTER TABLE product_master ADD CONSTRAINT product_type_check 
CHECK (product_type IN ('FINISHED_GOOD', 'RAW_MATERIAL', 'COMPONENT'));

-- Insert raw materials and components
INSERT INTO product_master (product_id, sku, name, category, subcategory, product_type, unit_of_measure) VALUES
-- RAW MATERIALS: Proteins
('RM-BEEF-PATTY', 'RM-001', 'Beef Patty (120g)', 'Raw Materials', 'Proteins', 'RAW_MATERIAL', 'EACH'),
('RM-CHICKEN-GRILLED', 'RM-002', 'Grilled Chicken Breast (150g)', 'Raw Materials', 'Proteins', 'RAW_MATERIAL', 'EACH'),
('RM-CHICKEN-FRIED', 'RM-003', 'Fried Chicken Breast (150g)', 'Raw Materials', 'Proteins', 'RAW_MATERIAL', 'EACH'),
('RM-CHICKEN-STRIPS', 'RM-004', 'Chicken Strip Pieces (500g)', 'Raw Materials', 'Proteins', 'RAW_MATERIAL', 'KG'),
('RM-CHICKEN-NUGGET', 'RM-005', 'Chicken Nugget Pieces (500g)', 'Raw Materials', 'Proteins', 'RAW_MATERIAL', 'KG'),

-- RAW MATERIALS: Bread & Wraps
('RM-BUN-REGULAR', 'RM-010', 'Regular Burger Bun', 'Raw Materials', 'Bread', 'RAW_MATERIAL', 'EACH'),
('RM-BUN-KETO', 'RM-011', 'Keto Burger Bun', 'Raw Materials', 'Bread', 'RAW_MATERIAL', 'EACH'),
('RM-TORTILLA', 'RM-012', 'Tortilla Wrap', 'Raw Materials', 'Bread', 'RAW_MATERIAL', 'EACH'),
('RM-SHAQRA-BREAD', 'RM-013', 'Shaqra Bread', 'Raw Materials', 'Bread', 'RAW_MATERIAL', 'EACH'),

-- RAW MATERIALS: Vegetables
('RM-LETTUCE', 'RM-020', 'Fresh Lettuce (kg)', 'Raw Materials', 'Vegetables', 'RAW_MATERIAL', 'KG'),
('RM-TOMATO', 'RM-021', 'Fresh Tomato (kg)', 'Raw Materials', 'Vegetables', 'RAW_MATERIAL', 'KG'),
('RM-ONION', 'RM-022', 'Fresh Onion (kg)', 'Raw Materials', 'Vegetables', 'RAW_MATERIAL', 'KG'),
('RM-PICKLE', 'RM-023', 'Pickles (kg)', 'Raw Materials', 'Vegetables', 'RAW_MATERIAL', 'KG'),
('RM-POTATO-FRIES', 'RM-024', 'Frozen French Fries (kg)', 'Raw Materials', 'Vegetables', 'RAW_MATERIAL', 'KG'),

-- RAW MATERIALS: Cheese & Dairy
('RM-CHEESE-SLICE', 'RM-030', 'Cheese Slice', 'Raw Materials', 'Dairy', 'RAW_MATERIAL', 'EACH'),
('RM-CHEESE-MELT', 'RM-031', 'Melted Cheese (kg)', 'Raw Materials', 'Dairy', 'RAW_MATERIAL', 'KG'),

-- RAW MATERIALS: Beverages
('RM-SODA-SYRUP', 'RM-040', 'Soda Syrup (liter)', 'Raw Materials', 'Beverages', 'RAW_MATERIAL', 'LITER'),
('RM-JUICE-CONC', 'RM-041', 'Juice Concentrate (liter)', 'Raw Materials', 'Beverages', 'RAW_MATERIAL', 'LITER'),
('RM-WATER-BOTTLE', 'RM-042', 'Bottled Water', 'Raw Materials', 'Beverages', 'RAW_MATERIAL', 'EACH'),

-- COMPONENTS: Sauces
('CMP-BURGERIZZR-SAUCE', 'CMP-001', 'Burgerizzr Sauce (batch)', 'Components', 'Sauces', 'COMPONENT', 'LITER'),
('CMP-DBL-SAUCE', 'CMP-002', 'Dbl Dbl Sauce (batch)', 'Components', 'Sauces', 'COMPONENT', 'LITER'),
('CMP-HIBHER-SAUCE', 'CMP-003', 'Hibherizzr Sauce (batch)', 'Components', 'Sauces', 'COMPONENT', 'LITER'),
('CMP-BBQ-SAUCE', 'CMP-004', 'BBQ Sauce (batch)', 'Components', 'Sauces', 'COMPONENT', 'LITER'),
('CMP-MAYO', 'CMP-005', 'Mayonnaise (batch)', 'Components', 'Sauces', 'COMPONENT', 'LITER'),
('CMP-KETCHUP', 'CMP-006', 'Ketchup (batch)', 'Components', 'Sauces', 'COMPONENT', 'LITER');