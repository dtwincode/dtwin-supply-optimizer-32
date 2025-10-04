-- Complete BOM structure for all remaining products

-- MISSING INDIVIDUAL BURGERS
INSERT INTO product_bom (parent_product_id, child_product_id, quantity_per, bom_level, operation_sequence) VALUES
-- Classic Chicken Keto (CHK-005)
('d2b03692-5fad-4d80-a1bc-3c979d737fed', 'RM-CHICKEN-GRILLED', 1, 1, 1),
('d2b03692-5fad-4d80-a1bc-3c979d737fed', 'RM-BUN-KETO', 1, 1, 2),
('d2b03692-5fad-4d80-a1bc-3c979d737fed', 'RM-CHEESE-SLICE', 1, 1, 3),
('d2b03692-5fad-4d80-a1bc-3c979d737fed', 'RM-LETTUCE', 0.02, 1, 4),
('d2b03692-5fad-4d80-a1bc-3c979d737fed', 'CMP-MAYO', 0.02, 1, 5),

-- Meltizzr Fried Chicken Burger (CHK-004)
('fa044152-3f01-4512-b3ac-ee18d57a0217', 'RM-CHICKEN-FRIED', 1, 1, 1),
('fa044152-3f01-4512-b3ac-ee18d57a0217', 'RM-BUN-REGULAR', 1, 1, 2),
('fa044152-3f01-4512-b3ac-ee18d57a0217', 'RM-CHEESE-MELT', 0.05, 1, 3),
('fa044152-3f01-4512-b3ac-ee18d57a0217', 'RM-LETTUCE', 0.02, 1, 4),
('fa044152-3f01-4512-b3ac-ee18d57a0217', 'CMP-MAYO', 0.03, 1, 5),

-- Cali Burger (BST-009) - Specialty burger
('82c03be4-e07f-41f8-abe0-96e766cdb6e6', 'RM-BEEF-PATTY', 1, 1, 1),
('82c03be4-e07f-41f8-abe0-96e766cdb6e6', 'RM-BUN-REGULAR', 1, 1, 2),
('82c03be4-e07f-41f8-abe0-96e766cdb6e6', 'RM-CHEESE-SLICE', 2, 1, 3),
('82c03be4-e07f-41f8-abe0-96e766cdb6e6', 'RM-LETTUCE', 0.03, 1, 4),
('82c03be4-e07f-41f8-abe0-96e766cdb6e6', 'RM-TOMATO', 0.04, 1, 5),
('82c03be4-e07f-41f8-abe0-96e766cdb6e6', 'RM-ONION', 0.02, 1, 6),
('82c03be4-e07f-41f8-abe0-96e766cdb6e6', 'CMP-BURGERIZZR-SAUCE', 0.04, 1, 7),

-- Dbl Dbl X Hibherizzr (BST-005) - Double patty burger
('95d5d480-08b0-4138-ab56-b548c3dcd576', 'RM-BEEF-PATTY', 2, 1, 1),
('95d5d480-08b0-4138-ab56-b548c3dcd576', 'RM-BUN-REGULAR', 1, 1, 2),
('95d5d480-08b0-4138-ab56-b548c3dcd576', 'RM-CHEESE-SLICE', 2, 1, 3),
('95d5d480-08b0-4138-ab56-b548c3dcd576', 'RM-LETTUCE', 0.03, 1, 4),
('95d5d480-08b0-4138-ab56-b548c3dcd576', 'RM-PICKLE', 0.02, 1, 5),
('95d5d480-08b0-4138-ab56-b548c3dcd576', 'CMP-HIBHER-SAUCE', 0.05, 1, 6),
('95d5d480-08b0-4138-ab56-b548c3dcd576', 'CMP-DBL-SAUCE', 0.03, 1, 7),

-- SIDES
-- Tenderizzr (BST-003) - Chicken tenders
('32dc0172-0444-4229-a702-ad00c22b973d', 'RM-CHICKEN-STRIPS', 0.25, 1, 1),
('32dc0172-0444-4229-a702-ad00c22b973d', 'CMP-BBQ-SAUCE', 0.04, 1, 2),
('32dc0172-0444-4229-a702-ad00c22b973d', 'CMP-MAYO', 0.02, 1, 3),

-- Wingers (SID-005) - Chicken wings
('8814d9d0-1b1e-481c-afd2-55027ddb8666', 'RM-CHICKEN-STRIPS', 0.3, 1, 1),
('8814d9d0-1b1e-481c-afd2-55027ddb8666', 'CMP-BBQ-SAUCE', 0.05, 1, 2),

-- LOADED FRIES
-- Dbl Dbl Fraizerr Loaded Fries (BST-002)
('4cc665c4-7ef1-4cc3-8b40-d3b4cdc71761', 'RM-POTATO-FRIES', 0.3, 1, 1),
('4cc665c4-7ef1-4cc3-8b40-d3b4cdc71761', 'RM-BEEF-PATTY', 0.5, 1, 2),
('4cc665c4-7ef1-4cc3-8b40-d3b4cdc71761', 'RM-CHEESE-MELT', 0.08, 1, 3),
('4cc665c4-7ef1-4cc3-8b40-d3b4cdc71761', 'CMP-DBL-SAUCE', 0.06, 1, 4),
('4cc665c4-7ef1-4cc3-8b40-d3b4cdc71761', 'RM-ONION', 0.02, 1, 5),

-- COMBO BOXES (Multi-level BOMs using finished products)
-- Duo Cali Burgers (BST-008) - 2 Cali burgers
('28d1c8e7-3e4a-4149-8b81-6d1ecb30bef5', '82c03be4-e07f-41f8-abe0-96e766cdb6e6', 2, 1, 1),
('28d1c8e7-3e4a-4149-8b81-6d1ecb30bef5', '1756a1a6-7d56-4d26-b691-3f0298bd8f19', 2, 1, 2),
('28d1c8e7-3e4a-4149-8b81-6d1ecb30bef5', '3e726f6b-a6ec-47fe-a242-028a73b966c0', 2, 1, 3),

-- Duo Hibherizzr (BST-004) - 2 Dbl Dbl burgers
('92920503-0ef4-474c-9706-652a39c51fc0', '95d5d480-08b0-4138-ab56-b548c3dcd576', 2, 1, 1),
('92920503-0ef4-474c-9706-652a39c51fc0', '1756a1a6-7d56-4d26-b691-3f0298bd8f19', 2, 1, 2),
('92920503-0ef4-474c-9706-652a39c51fc0', '3e726f6b-a6ec-47fe-a242-028a73b966c0', 2, 1, 3),

-- Break Box (BST-010) - 2 burgers + 2 sides + 2 drinks
('63e6907a-3953-4eb1-bd14-18e2ac7ed489', 'c5dedca6-8139-4479-847f-262c2f98c744', 2, 1, 1),
('63e6907a-3953-4eb1-bd14-18e2ac7ed489', '1756a1a6-7d56-4d26-b691-3f0298bd8f19', 2, 1, 2),
('63e6907a-3953-4eb1-bd14-18e2ac7ed489', '574fafdb-049e-4233-a0f8-6046abf5debd', 2, 1, 3),
('63e6907a-3953-4eb1-bd14-18e2ac7ed489', '3e726f6b-a6ec-47fe-a242-028a73b966c0', 2, 1, 4),

-- Zinger Shong Box (BST-001) - Fried chicken combo
('2663c984-c948-4d98-b1f0-e1a70072e28a', 'c870155d-3778-44f7-971f-bddbf5ba71fb', 1, 1, 1),
('2663c984-c948-4d98-b1f0-e1a70072e28a', 'a8a293a7-ce8d-4a51-8f9d-4380ffb2dca4', 1, 1, 2),
('2663c984-c948-4d98-b1f0-e1a70072e28a', '1756a1a6-7d56-4d26-b691-3f0298bd8f19', 1, 1, 3),
('2663c984-c948-4d98-b1f0-e1a70072e28a', '3e726f6b-a6ec-47fe-a242-028a73b966c0', 1, 1, 4),

-- SOLO BOX
-- Dbl Dbl (SBX-001) - Single combo
('3880b6d3-77d4-400e-8ce6-d30386b61eb0', '95d5d480-08b0-4138-ab56-b548c3dcd576', 1, 1, 1),
('3880b6d3-77d4-400e-8ce6-d30386b61eb0', '1756a1a6-7d56-4d26-b691-3f0298bd8f19', 1, 1, 2),
('3880b6d3-77d4-400e-8ce6-d30386b61eb0', '3e726f6b-a6ec-47fe-a242-028a73b966c0', 1, 1, 3),

-- GATHERING BOXES (Family-sized portions)
-- Meltizzr Burgerizzr Box (GBX-001) - 4 Meltizzr burgers + 4 fries + 4 drinks
('90e9058b-7bae-49c1-a28c-ba1d6f3c1463', '33a076f3-5bd6-43fc-acd2-b8719e2129ab', 4, 1, 1),
('90e9058b-7bae-49c1-a28c-ba1d6f3c1463', '1756a1a6-7d56-4d26-b691-3f0298bd8f19', 4, 1, 2),
('90e9058b-7bae-49c1-a28c-ba1d6f3c1463', '3e726f6b-a6ec-47fe-a242-028a73b966c0', 4, 1, 3),

-- Classic Burgerizzr Box (GBX-002) - 4 Classic burgers + 4 fries + 4 drinks
('637c7b12-8594-4ac4-8626-4da3122601a1', 'c5dedca6-8139-4479-847f-262c2f98c744', 4, 1, 1),
('637c7b12-8594-4ac4-8626-4da3122601a1', '1756a1a6-7d56-4d26-b691-3f0298bd8f19', 4, 1, 2),
('637c7b12-8594-4ac4-8626-4da3122601a1', '3e726f6b-a6ec-47fe-a242-028a73b966c0', 4, 1, 3),

-- Bbq Classic Box (GBX-003) - Mixed items
('e4030241-9312-4907-b4fe-c9b04f4144f6', 'c5dedca6-8139-4479-847f-262c2f98c744', 2, 1, 1),
('e4030241-9312-4907-b4fe-c9b04f4144f6', 'ae3fe32c-9fa0-42c7-abf7-47f5e458ebc1', 2, 1, 2),
('e4030241-9312-4907-b4fe-c9b04f4144f6', '1756a1a6-7d56-4d26-b691-3f0298bd8f19', 4, 1, 3),
('e4030241-9312-4907-b4fe-c9b04f4144f6', 'a8a293a7-ce8d-4a51-8f9d-4380ffb2dca4', 2, 1, 4),
('e4030241-9312-4907-b4fe-c9b04f4144f6', '3e726f6b-a6ec-47fe-a242-028a73b966c0', 4, 1, 5),

-- SAUCES (as retail products linking to component sauces)
-- Burgerizzr Sauce (SAU-001)
('7d666c14-4e73-49e0-b2dd-1f3bee07614c', 'CMP-BURGERIZZR-SAUCE', 0.25, 1, 1),

-- Dbl Dbl Sauce (SAU-002)
('18b7154b-5933-4806-83cb-96e0cc76b009', 'CMP-DBL-SAUCE', 0.25, 1, 1),

-- Hibherizzr Sauce (SAU-003)
('22e70511-04e7-460d-b290-1a4f18993d0b', 'CMP-HIBHER-SAUCE', 0.25, 1, 1),

-- Other Sauces (SAU-004) - Mix of various sauces
('65b8db73-d4cf-40b9-a031-b706585d779f', 'CMP-BBQ-SAUCE', 0.1, 1, 1),
('65b8db73-d4cf-40b9-a031-b706585d779f', 'CMP-MAYO', 0.1, 1, 2),
('65b8db73-d4cf-40b9-a031-b706585d779f', 'CMP-KETCHUP', 0.1, 1, 3);