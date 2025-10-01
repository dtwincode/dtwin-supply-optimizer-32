
-- Clear existing mock data
TRUNCATE TABLE public.historical_sales_data CASCADE;
TRUNCATE TABLE public.on_hand_inventory CASCADE;
TRUNCATE TABLE public.open_pos CASCADE;
TRUNCATE TABLE public.open_so CASCADE;
TRUNCATE TABLE public.master_lead_time CASCADE;
TRUNCATE TABLE public.product_location_pairs CASCADE;
TRUNCATE TABLE public.product_master CASCADE;
TRUNCATE TABLE public.location_master CASCADE;

-- Insert Products (10 products)
INSERT INTO public.product_master (product_id, sku, name, category, subcategory, product_family, planning_priority)
VALUES
  ('P001', 'SKU-001', 'Laptop Pro 15"', 'Electronics', 'Computers', 'Computing', 'HIGH'),
  ('P002', 'SKU-002', 'Wireless Mouse', 'Electronics', 'Accessories', 'Peripherals', 'MEDIUM'),
  ('P003', 'SKU-003', 'USB-C Cable', 'Electronics', 'Cables', 'Accessories', 'LOW'),
  ('P004', 'SKU-004', 'Monitor 27"', 'Electronics', 'Displays', 'Computing', 'HIGH'),
  ('P005', 'SKU-005', 'Keyboard Mechanical', 'Electronics', 'Accessories', 'Peripherals', 'MEDIUM'),
  ('P006', 'SKU-006', 'Webcam HD', 'Electronics', 'Accessories', 'Peripherals', 'MEDIUM'),
  ('P007', 'SKU-007', 'Headphones Wireless', 'Electronics', 'Audio', 'Peripherals', 'HIGH'),
  ('P008', 'SKU-008', 'External SSD 1TB', 'Electronics', 'Storage', 'Computing', 'HIGH'),
  ('P009', 'SKU-009', 'Docking Station', 'Electronics', 'Accessories', 'Computing', 'MEDIUM'),
  ('P010', 'SKU-010', 'Laptop Bag', 'Accessories', 'Bags', 'Accessories', 'LOW');

-- Insert Locations (5 locations)
INSERT INTO public.location_master (location_id, region, channel_id, location_type)
VALUES
  ('LOC001', 'Central', 'B2C', 'STORE'),
  ('LOC002', 'East', 'B2C', 'STORE'),
  ('LOC003', 'West', 'B2C', 'STORE'),
  ('LOC004', 'Central', 'B2B', 'WAREHOUSE'),
  ('LOC005', 'East', 'ONLINE', 'DC');

-- Insert Product-Location Pairs (all products at all locations = 50 pairs)
INSERT INTO public.product_location_pairs (product_id, location_id)
SELECT p.product_id, l.location_id
FROM product_master p
CROSS JOIN location_master l;

-- Insert Master Lead Times (4-10 days per product-location)
INSERT INTO public.master_lead_time (product_id, location_id, standard_lead_time_days)
SELECT 
  product_id, 
  location_id,
  (RANDOM() * 6 + 4)::INTEGER as standard_lead_time_days
FROM product_location_pairs;

-- Insert Historical Sales Data (90 days of sales history)
INSERT INTO public.historical_sales_data (product_id, location_id, sales_date, quantity_sold, unit_price, revenue, transaction_type)
SELECT 
  pl.product_id,
  pl.location_id,
  CURRENT_DATE - (gs.day_offset || ' days')::INTERVAL,
  (RANDOM() * 20 + 5)::INTEGER as quantity_sold,
  CASE pl.product_id
    WHEN 'P001' THEN 1200.00
    WHEN 'P002' THEN 25.00
    WHEN 'P003' THEN 15.00
    WHEN 'P004' THEN 350.00
    WHEN 'P005' THEN 85.00
    WHEN 'P006' THEN 65.00
    WHEN 'P007' THEN 120.00
    WHEN 'P008' THEN 180.00
    WHEN 'P009' THEN 95.00
    WHEN 'P010' THEN 45.00
  END as unit_price,
  (RANDOM() * 20 + 5)::INTEGER * CASE pl.product_id
    WHEN 'P001' THEN 1200.00
    WHEN 'P002' THEN 25.00
    WHEN 'P003' THEN 15.00
    WHEN 'P004' THEN 350.00
    WHEN 'P005' THEN 85.00
    WHEN 'P006' THEN 65.00
    WHEN 'P007' THEN 120.00
    WHEN 'P008' THEN 180.00
    WHEN 'P009' THEN 95.00
    WHEN 'P010' THEN 45.00
  END as revenue,
  'SALE'
FROM product_location_pairs pl
CROSS JOIN generate_series(0, 89) as gs(day_offset);

-- Insert Current On-Hand Inventory
INSERT INTO public.on_hand_inventory (product_id, location_id, qty_on_hand, snapshot_ts)
SELECT 
  product_id,
  location_id,
  (RANDOM() * 100 + 20)::INTEGER as qty_on_hand,
  NOW()
FROM product_location_pairs;

-- Insert Open Purchase Orders (some products have incoming stock)
INSERT INTO public.open_pos (product_id, location_id, ordered_qty, received_qty, order_date, expected_date, status)
SELECT 
  product_id,
  location_id,
  (RANDOM() * 50 + 10)::INTEGER as ordered_qty,
  0 as received_qty,
  CURRENT_DATE - (RANDOM() * 10)::INTEGER as order_date,
  CURRENT_DATE + (RANDOM() * 15 + 5)::INTEGER as expected_date,
  'OPEN'
FROM product_location_pairs
WHERE RANDOM() < 0.3; -- 30% of products have open POs

-- Insert Open Sales Orders (confirmed demand)
INSERT INTO public.open_so (product_id, location_id, qty, confirmed_date, status)
SELECT 
  product_id,
  location_id,
  (RANDOM() * 30 + 5)::INTEGER as qty,
  CURRENT_DATE as confirmed_date,
  'CONFIRMED'
FROM product_location_pairs
WHERE RANDOM() < 0.25; -- 25% of products have confirmed demand

-- Verify data consistency
DO $$
DECLARE
  product_count INTEGER;
  location_count INTEGER;
  pair_count INTEGER;
  sales_count INTEGER;
  inventory_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM product_master;
  SELECT COUNT(*) INTO location_count FROM location_master;
  SELECT COUNT(*) INTO pair_count FROM product_location_pairs;
  SELECT COUNT(*) INTO sales_count FROM historical_sales_data;
  SELECT COUNT(*) INTO inventory_count FROM on_hand_inventory;
  
  RAISE NOTICE '=== Mock Data Generation Complete ===';
  RAISE NOTICE 'Products: %', product_count;
  RAISE NOTICE 'Locations: %', location_count;
  RAISE NOTICE 'Product-Location Pairs: %', pair_count;
  RAISE NOTICE 'Historical Sales Records: %', sales_count;
  RAISE NOTICE 'Inventory Records: %', inventory_count;
  RAISE NOTICE 'Expected: % x % x 90 days = % sales records', product_count, location_count, product_count * location_count * 90;
END $$;
