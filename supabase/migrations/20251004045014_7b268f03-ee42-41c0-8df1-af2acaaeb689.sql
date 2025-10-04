-- Step 2: Create BOM relationships with correct product IDs
-- Using actual product IDs from the database

INSERT INTO product_bom (parent_product_id, child_product_id, quantity_per, bom_level, operation_sequence) VALUES
-- Classic Beef Burger (BEF-001: c5dedca6-8139-4479-847f-262c2f98c744)
('c5dedca6-8139-4479-847f-262c2f98c744', 'RM-BEEF-PATTY', 1, 1, 1),
('c5dedca6-8139-4479-847f-262c2f98c744', 'RM-BUN-REGULAR', 1, 1, 2),
('c5dedca6-8139-4479-847f-262c2f98c744', 'RM-CHEESE-SLICE', 1, 1, 3),
('c5dedca6-8139-4479-847f-262c2f98c744', 'RM-LETTUCE', 0.02, 1, 4),
('c5dedca6-8139-4479-847f-262c2f98c744', 'RM-TOMATO', 0.03, 1, 5),
('c5dedca6-8139-4479-847f-262c2f98c744', 'RM-ONION', 0.01, 1, 6),
('c5dedca6-8139-4479-847f-262c2f98c744', 'CMP-BURGERIZZR-SAUCE', 0.03, 1, 7),

-- Meltizzr Beef Burger (BEF-002: 33a076f3-5bd6-43fc-acd2-b8719e2129ab)
('33a076f3-5bd6-43fc-acd2-b8719e2129ab', 'RM-BEEF-PATTY', 1, 1, 1),
('33a076f3-5bd6-43fc-acd2-b8719e2129ab', 'RM-BUN-REGULAR', 1, 1, 2),
('33a076f3-5bd6-43fc-acd2-b8719e2129ab', 'RM-CHEESE-MELT', 0.05, 1, 3),
('33a076f3-5bd6-43fc-acd2-b8719e2129ab', 'RM-LETTUCE', 0.02, 1, 4),
('33a076f3-5bd6-43fc-acd2-b8719e2129ab', 'RM-TOMATO', 0.03, 1, 5),
('33a076f3-5bd6-43fc-acd2-b8719e2129ab', 'CMP-BURGERIZZR-SAUCE', 0.03, 1, 6),

-- Classic Beef Keto (BEF-003: e9ce8d25-2a54-40d8-a255-2d123c3d5ffa)
('e9ce8d25-2a54-40d8-a255-2d123c3d5ffa', 'RM-BEEF-PATTY', 1, 1, 1),
('e9ce8d25-2a54-40d8-a255-2d123c3d5ffa', 'RM-BUN-KETO', 1, 1, 2),
('e9ce8d25-2a54-40d8-a255-2d123c3d5ffa', 'RM-CHEESE-SLICE', 1, 1, 3),
('e9ce8d25-2a54-40d8-a255-2d123c3d5ffa', 'RM-LETTUCE', 0.02, 1, 4),
('e9ce8d25-2a54-40d8-a255-2d123c3d5ffa', 'CMP-BURGERIZZR-SAUCE', 0.02, 1, 5),

-- Classic Chicken Burger (CHK-001: ae3fe32c-9fa0-42c7-abf7-47f5e458ebc1)
('ae3fe32c-9fa0-42c7-abf7-47f5e458ebc1', 'RM-CHICKEN-GRILLED', 1, 1, 1),
('ae3fe32c-9fa0-42c7-abf7-47f5e458ebc1', 'RM-BUN-REGULAR', 1, 1, 2),
('ae3fe32c-9fa0-42c7-abf7-47f5e458ebc1', 'RM-CHEESE-SLICE', 1, 1, 3),
('ae3fe32c-9fa0-42c7-abf7-47f5e458ebc1', 'RM-LETTUCE', 0.02, 1, 4),
('ae3fe32c-9fa0-42c7-abf7-47f5e458ebc1', 'RM-TOMATO', 0.03, 1, 5),
('ae3fe32c-9fa0-42c7-abf7-47f5e458ebc1', 'CMP-MAYO', 0.03, 1, 6),

-- Classic Fried Burger (CHK-002: c870155d-3778-44f7-971f-bddbf5ba71fb)
('c870155d-3778-44f7-971f-bddbf5ba71fb', 'RM-CHICKEN-FRIED', 1, 1, 1),
('c870155d-3778-44f7-971f-bddbf5ba71fb', 'RM-BUN-REGULAR', 1, 1, 2),
('c870155d-3778-44f7-971f-bddbf5ba71fb', 'RM-CHEESE-SLICE', 1, 1, 3),
('c870155d-3778-44f7-971f-bddbf5ba71fb', 'RM-LETTUCE', 0.02, 1, 4),
('c870155d-3778-44f7-971f-bddbf5ba71fb', 'CMP-MAYO', 0.03, 1, 5),

-- Meltizzr Chicken Burger (CHK-003: 29a94d8d-2367-42cb-8f94-06994cc90f46)
('29a94d8d-2367-42cb-8f94-06994cc90f46', 'RM-CHICKEN-GRILLED', 1, 1, 1),
('29a94d8d-2367-42cb-8f94-06994cc90f46', 'RM-BUN-REGULAR', 1, 1, 2),
('29a94d8d-2367-42cb-8f94-06994cc90f46', 'RM-CHEESE-MELT', 0.05, 1, 3),
('29a94d8d-2367-42cb-8f94-06994cc90f46', 'RM-LETTUCE', 0.02, 1, 4),
('29a94d8d-2367-42cb-8f94-06994cc90f46', 'CMP-MAYO', 0.03, 1, 5),

-- Curly Fries (SID-001: 7d222913-69dd-4d40-8477-fbf9a4e724e9)
('7d222913-69dd-4d40-8477-fbf9a4e724e9', 'RM-POTATO-FRIES', 0.2, 1, 1),
('7d222913-69dd-4d40-8477-fbf9a4e724e9', 'CMP-KETCHUP', 0.02, 1, 2),

-- French Fries (SID-002: 1756a1a6-7d56-4d26-b691-3f0298bd8f19)
('1756a1a6-7d56-4d26-b691-3f0298bd8f19', 'RM-POTATO-FRIES', 0.2, 1, 1),
('1756a1a6-7d56-4d26-b691-3f0298bd8f19', 'CMP-KETCHUP', 0.02, 1, 2),

-- Chicken Strips (SID-003: a8a293a7-ce8d-4a51-8f9d-4380ffb2dca4)
('a8a293a7-ce8d-4a51-8f9d-4380ffb2dca4', 'RM-CHICKEN-STRIPS', 0.18, 1, 1),
('a8a293a7-ce8d-4a51-8f9d-4380ffb2dca4', 'CMP-BBQ-SAUCE', 0.03, 1, 2),

-- Nuggets (SID-004: 574fafdb-049e-4233-a0f8-6046abf5debd)
('574fafdb-049e-4233-a0f8-6046abf5debd', 'RM-CHICKEN-NUGGET', 0.15, 1, 1),
('574fafdb-049e-4233-a0f8-6046abf5debd', 'CMP-KETCHUP', 0.02, 1, 2),

-- Soft Drinks (DRK-001: 3e726f6b-a6ec-47fe-a242-028a73b966c0)
('3e726f6b-a6ec-47fe-a242-028a73b966c0', 'RM-SODA-SYRUP', 0.5, 1, 1),

-- Juices (DRK-002: 5c7fa590-b217-45a0-8af0-c76679789608)
('5c7fa590-b217-45a0-8af0-c76679789608', 'RM-JUICE-CONC', 0.5, 1, 1),

-- Water (DRK-003: ec4a3ea9-ec2c-40e9-b7c1-6ca79e0d54d1)
('ec4a3ea9-ec2c-40e9-b7c1-6ca79e0d54d1', 'RM-WATER-BOTTLE', 1, 1, 1),

-- Classic Tortilla Sandwich (SND-001: 3746524e-3680-4301-a5af-b9835060cf3f)
('3746524e-3680-4301-a5af-b9835060cf3f', 'RM-CHICKEN-GRILLED', 1, 1, 1),
('3746524e-3680-4301-a5af-b9835060cf3f', 'RM-TORTILLA', 1, 1, 2),
('3746524e-3680-4301-a5af-b9835060cf3f', 'RM-LETTUCE', 0.02, 1, 3),
('3746524e-3680-4301-a5af-b9835060cf3f', 'RM-TOMATO', 0.02, 1, 4),
('3746524e-3680-4301-a5af-b9835060cf3f', 'CMP-MAYO', 0.03, 1, 5),

-- Hibherizzr Tortilla (BST-007: d7f99de3-c0e0-48a1-82ed-bff58600f1a3)
('d7f99de3-c0e0-48a1-82ed-bff58600f1a3', 'RM-CHICKEN-GRILLED', 1, 1, 1),
('d7f99de3-c0e0-48a1-82ed-bff58600f1a3', 'RM-TORTILLA', 1, 1, 2),
('d7f99de3-c0e0-48a1-82ed-bff58600f1a3', 'RM-LETTUCE', 0.02, 1, 3),
('d7f99de3-c0e0-48a1-82ed-bff58600f1a3', 'CMP-HIBHER-SAUCE', 0.04, 1, 4),

-- Hibherizzr Shaqra (BST-006: 90a225fa-01b0-4307-a451-33ab9a73b331)
('90a225fa-01b0-4307-a451-33ab9a73b331', 'RM-CHICKEN-GRILLED', 1, 1, 1),
('90a225fa-01b0-4307-a451-33ab9a73b331', 'RM-SHAQRA-BREAD', 1, 1, 2),
('90a225fa-01b0-4307-a451-33ab9a73b331', 'RM-LETTUCE', 0.02, 1, 3),
('90a225fa-01b0-4307-a451-33ab9a73b331', 'RM-PICKLE', 0.01, 1, 4),
('90a225fa-01b0-4307-a451-33ab9a73b331', 'CMP-HIBHER-SAUCE', 0.04, 1, 5);