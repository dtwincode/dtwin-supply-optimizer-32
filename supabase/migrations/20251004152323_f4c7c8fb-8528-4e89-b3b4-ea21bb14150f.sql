-- Force delete all vendor data with CASCADE if needed
TRUNCATE TABLE supplier_performance CASCADE;
TRUNCATE TABLE supplier_contracts CASCADE;
UPDATE product_master SET supplier_id = NULL WHERE supplier_id IS NOT NULL;
TRUNCATE TABLE vendor_master RESTART IDENTITY CASCADE;

-- Create MOQ-based Saudi vendors
INSERT INTO vendor_master (vendor_code, vendor_name, country, region, city, contact_person, contact_email, phone_number, payment_terms, is_active) VALUES
('SAU-BEV-001', 'Al-Saqer National Beverages Co.', 'Saudi Arabia', 'Central', 'Riyadh', 'Ahmed Al-Otaibi', 'ahmed.otaibi@alsaqer.sa', '+966-11-234-5678', 'NET_30', true),
('SAU-BEV-002', 'Gulf Waters Distribution LLC', 'Saudi Arabia', 'Eastern', 'Dammam', 'Khalid Al-Ghamdi', 'khalid@gulfwaters.sa', '+966-13-345-6789', 'NET_30', true),
('SAU-FRZ-001', 'Al-Watania Poultry Co.', 'Saudi Arabia', 'Western', 'Jeddah', 'Mohammed Al-Zahrani', 'mohammed@alwatania.sa', '+966-12-456-7890', 'NET_45', true),
('SAU-FRZ-002', 'Saudi Frozen Foods Industries', 'Saudi Arabia', 'Central', 'Riyadh', 'Abdulrahman Al-Mutairi', 'ar.mutairi@saudifrozen.sa', '+966-11-567-8901', 'NET_45', true),
('SAU-FRZ-003', 'McCain Saudi Arabia', 'Saudi Arabia', 'Eastern', 'Jubail', 'Fahad Al-Dosari', 'fahad.dosari@mccain.sa', '+966-13-678-9012', 'NET_60', true),
('SAU-MEAT-001', 'Al-Watania Meat Division', 'Saudi Arabia', 'Western', 'Jeddah', 'Salem Al-Harbi', 'salem@alwataniameat.sa', '+966-12-789-0123', 'NET_21', true),
('SAU-MEAT-002', 'Tanmiah Food Co.', 'Saudi Arabia', 'Central', 'Riyadh', 'Nasser Al-Shammari', 'nasser@tanmiah.sa', '+966-11-890-1234', 'NET_21', true),
('SAU-MEAT-003', 'Al-Mazraa Farms', 'Saudi Arabia', 'Central', 'Riyadh', 'Yousef Al-Qahtani', 'yousef@almazraa.sa', '+966-11-901-2345', 'NET_14', true),
('SAU-FOOD-001', 'Almarai Food Industries', 'Saudi Arabia', 'Central', 'Riyadh', 'Bandar Al-Otaibi', 'bandar@almarai.sa', '+966-11-012-3456', 'NET_45', true),
('SAU-FOOD-002', 'Americana Foods KSA', 'Saudi Arabia', 'Eastern', 'Khobar', 'Faisal Al-Ghamdi', 'faisal@americana.sa', '+966-13-123-4567', 'NET_45', true),
('SAU-BAK-001', 'Modern Mills Co.', 'Saudi Arabia', 'Western', 'Jeddah', 'Ibrahim Al-Juhani', 'ibrahim@modernmills.sa', '+966-12-234-5678', 'NET_30', true),
('SAU-PKG-001', 'Saudi Paper Products Co.', 'Saudi Arabia', 'Central', 'Riyadh', 'Abdullah Al-Malki', 'abdullah@saudipaper.sa', '+966-11-345-6789', 'NET_30', true)
RETURNING vendor_id, vendor_code, vendor_name;