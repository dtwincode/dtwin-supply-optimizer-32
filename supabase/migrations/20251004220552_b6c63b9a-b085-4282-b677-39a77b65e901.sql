-- Generate realistic historical sales data for finished goods (90 days)
-- This will enable component demand calculation via BOM explosion

DO $$
DECLARE
  v_product RECORD;
  v_location RECORD;
  v_date DATE;
  v_start_date DATE := CURRENT_DATE - INTERVAL '90 days';
  v_end_date DATE := CURRENT_DATE;
  v_quantity INTEGER;
  v_price NUMERIC;
  v_revenue NUMERIC;
  v_day_of_week INTEGER;
  v_month INTEGER;
  v_day_mult NUMERIC;
  v_season_mult NUMERIC;
  v_location_mult NUMERIC;
  v_category_mult NUMERIC;
  v_base_volume NUMERIC := 30;
  v_random_var NUMERIC;
  v_count INTEGER := 0;
BEGIN
  -- Clear existing finished goods sales data
  DELETE FROM historical_sales_data 
  WHERE product_id IN (SELECT product_id FROM product_master WHERE product_type = 'FINISHED_GOOD');
  
  RAISE NOTICE 'Generating historical sales data for finished goods (90 days)...';
  
  -- Loop through each date
  FOR v_date IN 
    SELECT generate_series(v_start_date, v_end_date, '1 day'::interval)::date
  LOOP
    v_day_of_week := EXTRACT(DOW FROM v_date);
    v_month := EXTRACT(MONTH FROM v_date);
    
    -- Day of week multipliers (Weekend patterns)
    v_day_mult := CASE v_day_of_week
      WHEN 5 THEN 1.3  -- Friday: 30% higher
      WHEN 6 THEN 1.2  -- Saturday: 20% higher
      WHEN 0 THEN 1.15 -- Sunday: 15% higher
      ELSE 1.0
    END;
    
    -- Seasonal multipliers
    v_season_mult := CASE 
      WHEN v_month IN (6,7,8) THEN 1.2  -- Summer peak
      WHEN v_month IN (12,1) THEN 1.1   -- Holiday season
      ELSE 1.0
    END;
    
    -- Loop through each location
    FOR v_location IN 
      SELECT location_id, region, seating_capacity, drive_thru
      FROM location_master
      WHERE location_type = 'STORE'
    LOOP
      -- Location multiplier based on characteristics
      v_location_mult := 1.0;
      
      IF v_location.seating_capacity IS NOT NULL THEN
        v_location_mult := v_location.seating_capacity / 60.0;
      END IF;
      
      IF v_location.drive_thru THEN
        v_location_mult := v_location_mult * 1.2;
      END IF;
      
      -- Regional adjustments
      IF v_location.region ILIKE '%Makkah%' OR v_location.region ILIKE '%Mecca%' THEN
        v_location_mult := v_location_mult * 1.8;
      ELSIF v_location.region ILIKE '%Riyadh%' THEN
        v_location_mult := v_location_mult * 1.3;
      ELSIF v_location.region ILIKE '%Jeddah%' THEN
        v_location_mult := v_location_mult * 1.2;
      END IF;
      
      -- Loop through each finished goods product
      FOR v_product IN 
        SELECT p.product_id, p.sku, p.name, p.category,
               COALESCE(pr.price, 20.0) as unit_price
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
        -- Category popularity multiplier
        v_category_mult := CASE 
          WHEN v_product.category ILIKE '%Fries%' OR v_product.category ILIKE '%Sides%' THEN 1.5
          WHEN v_product.category ILIKE '%Burger%' THEN 1.3
          WHEN v_product.category ILIKE '%Beverage%' OR v_product.category ILIKE '%Drink%' THEN 1.2
          WHEN v_product.category ILIKE '%Dessert%' THEN 0.8
          WHEN v_product.category ILIKE '%Premium%' THEN 0.6
          ELSE 1.0
        END;
        
        -- Random variation (±25%)
        v_random_var := 0.75 + (random() * 0.5);
        
        -- Calculate quantity
        v_quantity := ROUND(
          v_base_volume * 
          v_category_mult * 
          v_location_mult * 
          v_day_mult * 
          v_season_mult * 
          v_random_var
        );
        
        -- Skip if quantity too low
        CONTINUE WHEN v_quantity < 3;
        
        -- Get price with variation
        v_price := v_product.unit_price * (0.9 + random() * 0.2);
        v_revenue := v_quantity * v_price;
        
        -- Insert record
        INSERT INTO historical_sales_data (
          product_id, location_id, sales_date,
          quantity_sold, unit_price, revenue,
          transaction_type
        ) VALUES (
          v_product.product_id,
          v_location.location_id,
          v_date,
          v_quantity,
          ROUND(v_price, 2),
          ROUND(v_revenue, 2),
          'SALE'
        );
        
        v_count := v_count + 1;
        
        -- Progress feedback every 1000 records
        IF v_count % 1000 = 0 THEN
          RAISE NOTICE 'Generated % records...', v_count;
        END IF;
      END LOOP;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Successfully generated % historical sales records for finished goods (90 days)', v_count;
END $$;