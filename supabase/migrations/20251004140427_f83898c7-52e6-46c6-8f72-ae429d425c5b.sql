-- Step 1: Populate product_location_pairs with all valid combinations
INSERT INTO product_location_pairs (product_id, location_id)
SELECT 
  pm.product_id,
  lm.location_id
FROM product_master pm
CROSS JOIN location_master lm
ON CONFLICT DO NOTHING;

-- Step 2: Establish proper location hierarchy
DO $$
DECLARE
  dc_count INTEGER;
  r RECORD;
BEGIN
  SELECT COUNT(*) INTO dc_count
  FROM location_master
  WHERE location_type IN ('DC', 'DISTRIBUTION_CENTER', 'WAREHOUSE');
  
  IF dc_count = 0 THEN
    FOR r IN (SELECT DISTINCT region FROM location_master WHERE region IS NOT NULL)
    LOOP
      -- Insert regional DC
      INSERT INTO location_master (location_id, region, location_type)
      VALUES (r.region || '_DC', r.region, 'DC')
      ON CONFLICT DO NOTHING;
      
      -- Insert hierarchy entry (use 'DC' as echelon_type)
      INSERT INTO location_hierarchy (
        location_id, 
        parent_location_id, 
        echelon_level, 
        echelon_type,
        buffer_strategy
      )
      VALUES (
        r.region || '_DC',
        NULL,
        1,
        'DC',
        'standard'
      )
      ON CONFLICT (location_id) DO NOTHING;
      
      -- Link stores to regional DC
      UPDATE location_hierarchy lh
      SET 
        parent_location_id = r.region || '_DC',
        echelon_level = 2,
        echelon_type = 'STORE'
      FROM location_master lm
      WHERE lh.location_id = lm.location_id
        AND lm.region = r.region
        AND lm.location_type NOT IN ('DC', 'DISTRIBUTION_CENTER', 'WAREHOUSE');
    END LOOP;
  ELSE
    UPDATE location_hierarchy lh
    SET 
      echelon_level = CASE 
        WHEN lm.location_type IN ('DC', 'DISTRIBUTION_CENTER', 'WAREHOUSE') THEN 1
        ELSE 2
      END,
      echelon_type = CASE 
        WHEN lm.location_type IN ('DC', 'DISTRIBUTION_CENTER', 'WAREHOUSE') THEN 'DC'
        ELSE 'STORE'
      END,
      parent_location_id = CASE 
        WHEN lm.location_type NOT IN ('DC', 'DISTRIBUTION_CENTER', 'WAREHOUSE') THEN (
          SELECT dc_lm.location_id 
          FROM location_master dc_lm
          WHERE dc_lm.location_type IN ('DC', 'DISTRIBUTION_CENTER', 'WAREHOUSE')
            AND dc_lm.region = lm.region
          LIMIT 1
        )
        ELSE NULL
      END
    FROM location_master lm
    WHERE lh.location_id = lm.location_id;
  END IF;
END $$;