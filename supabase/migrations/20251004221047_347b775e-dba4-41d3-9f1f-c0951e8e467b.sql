-- Generate 90 days of realistic historical sales data for Burgerizzr finished goods
-- This will create approximately 300,000+ records (35 products × 101 locations × 90 days)

DO $$
DECLARE
  v_product RECORD;
  v_location RECORD;
  v_date DATE;
  v_days_ago INTEGER;
  v_base_qty INTEGER;
  v_quantity INTEGER;
  v_price NUMERIC;
  v_day_multiplier NUMERIC;
  v_random_factor NUMERIC;
  v_location_multiplier NUMERIC;
BEGIN
  -- Clear existing data
  DELETE FROM historical_sales_data;
  
  -- Loop through each finished good product
  FOR v_product IN 
    SELECT p.product_id, p.sku, p.name, p.category, p.subcategory,
           COALESCE(pr.price, 15.00) as price
    FROM product_master p
    LEFT JOIN LATERAL (
      SELECT price 
      FROM "product_pricing-master" 
      WHERE product_id = p.product_id 
      ORDER BY effective_date DESC 
      LIMIT 1
    ) pr ON true
    WHERE p.product_type = 'FINISHED_GOOD'
  LOOP
    -- Determine base quantity by category
    v_base_qty := CASE 
      WHEN v_product.category = 'BURGERS' THEN 50
      WHEN v_product.category = 'SIDES' THEN 40
      WHEN v_product.category = 'BEVERAGES' THEN 60
      WHEN v_product.category = 'DESSERTS' THEN 30
      ELSE 35
    END;
    
    -- Loop through each location
    FOR v_location IN 
      SELECT location_id, region, 
             COALESCE(daily_sales_volume, 1000) as daily_vol,
             COALESCE(seating_capacity, 50) as seats,
             COALESCE(drive_thru, false) as has_drive_thru
      FROM location_master
    LOOP
      -- Location multiplier based on characteristics
      v_location_multiplier := 1.0;
      v_location_multiplier := v_location_multiplier * (v_location.daily_vol / 1000.0);
      v_location_multiplier := v_location_multiplier * (v_location.seats / 50.0);
      IF v_location.has_drive_thru THEN
        v_location_multiplier := v_location_multiplier * 1.3;
      END IF;
      
      -- Regional adjustment
      v_location_multiplier := v_location_multiplier * CASE
        WHEN v_location.region = 'Central' THEN 1.2
        WHEN v_location.region = 'Eastern' THEN 1.1
        WHEN v_location.region = 'Western' THEN 1.0
        WHEN v_location.region = 'Northern' THEN 0.9
        WHEN v_location.region = 'Southern' THEN 0.95
        ELSE 1.0
      END;
      
      -- Generate 90 days of data
      FOR v_days_ago IN 0..89 LOOP
        v_date := CURRENT_DATE - v_days_ago;
        
        -- Day of week multiplier (1=Monday, 7=Sunday)
        v_day_multiplier := CASE EXTRACT(DOW FROM v_date)
          WHEN 0 THEN 1.4  -- Sunday (high)
          WHEN 1 THEN 0.8  -- Monday (low)
          WHEN 2 THEN 0.85 -- Tuesday
          WHEN 3 THEN 0.9  -- Wednesday
          WHEN 4 THEN 1.0  -- Thursday
          WHEN 5 THEN 1.3  -- Friday (high)
          WHEN 6 THEN 1.35 -- Saturday (high)
        END;
        
        -- Random variation (±20%)
        v_random_factor := 0.8 + (random() * 0.4);
        
        -- Calculate final quantity
        v_quantity := GREATEST(0, ROUND(
          v_base_qty * v_location_multiplier * v_day_multiplier * v_random_factor
        ));
        
        -- Skip if quantity is 0 (to make data more realistic)
        IF v_quantity > 0 THEN
          -- Insert sales record
          INSERT INTO historical_sales_data (
            sales_id,
            product_id,
            location_id,
            sales_date,
            quantity_sold,
            unit_price,
            revenue,
            transaction_type
          ) VALUES (
            gen_random_uuid()::text,
            v_product.product_id,
            v_location.location_id,
            v_date,
            v_quantity,
            v_product.price,
            v_quantity * v_product.price,
            'SALE'
          );
        END IF;
      END LOOP; -- days
    END LOOP; -- locations
  END LOOP; -- products
  
  RAISE NOTICE 'Historical sales data generation complete';
END $$;

-- Verify data was created
SELECT 
  COUNT(*) as total_records,
  MIN(sales_date) as earliest_date,
  MAX(sales_date) as latest_date,
  SUM(quantity_sold) as total_quantity,
  ROUND(SUM(revenue)::numeric, 2) as total_revenue
FROM historical_sales_data;