-- Populate product_pricing-master with Burgerizzr menu prices

-- Insert pricing for all products with effective date as today
INSERT INTO "product_pricing-master" (product_id, price, effective_date, currency)
VALUES
  -- Bestsellers/Limited Offers
  ((SELECT product_id FROM product_master WHERE sku = 'BST-001'), 39.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BST-002'), 26.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BST-003'), 43.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BST-004'), 79.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BST-005'), 49.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BST-006'), 47.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BST-007'), 45.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BST-008'), 77.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BST-009'), 41.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BST-010'), 45.0, CURRENT_DATE, 'SAR'),
  
  -- Gathering Boxes
  ((SELECT product_id FROM product_master WHERE sku = 'GBX-001'), 109.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'GBX-002'), 169.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'GBX-003'), 109.0, CURRENT_DATE, 'SAR'),
  
  -- Solo Boxes
  ((SELECT product_id FROM product_master WHERE sku = 'SBX-001'), 49.0, CURRENT_DATE, 'SAR'),
  
  -- Beef Burgers
  ((SELECT product_id FROM product_master WHERE sku = 'BEF-001'), 30.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BEF-002'), 25.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'BEF-003'), 30.0, CURRENT_DATE, 'SAR'),
  
  -- Chicken Burgers
  ((SELECT product_id FROM product_master WHERE sku = 'CHK-001'), 30.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'CHK-002'), 31.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'CHK-003'), 25.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'CHK-004'), 26.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'CHK-005'), 30.0, CURRENT_DATE, 'SAR'),
  
  -- Sandwiches/Wraps
  ((SELECT product_id FROM product_master WHERE sku = 'SND-001'), 31.0, CURRENT_DATE, 'SAR'),
  
  -- Sides & Appetizers
  ((SELECT product_id FROM product_master WHERE sku = 'SID-001'), 14.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'SID-002'), 11.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'SID-003'), 10.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'SID-004'), 12.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'SID-005'), 17.0, CURRENT_DATE, 'SAR'),
  
  -- Sauces
  ((SELECT product_id FROM product_master WHERE sku = 'SAU-001'), 4.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'SAU-002'), 4.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'SAU-003'), 4.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'SAU-004'), 4.0, CURRENT_DATE, 'SAR'),
  
  -- Drinks
  ((SELECT product_id FROM product_master WHERE sku = 'DRK-001'), 10.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'DRK-002'), 4.0, CURRENT_DATE, 'SAR'),
  ((SELECT product_id FROM product_master WHERE sku = 'DRK-003'), 2.0, CURRENT_DATE, 'SAR')
ON CONFLICT (pricing_id) DO NOTHING;