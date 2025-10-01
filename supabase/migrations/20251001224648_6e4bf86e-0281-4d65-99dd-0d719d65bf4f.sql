-- Create a function to assign buffer profiles based on classification
CREATE OR REPLACE FUNCTION assign_buffer_profiles_by_classification()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update product_master to add buffer_profile_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'product_master' 
    AND column_name = 'buffer_profile_id'
  ) THEN
    ALTER TABLE product_master ADD COLUMN buffer_profile_id text DEFAULT 'BP_DEFAULT';
  END IF;

  -- Assign buffer profiles based on product classification variability
  UPDATE product_master pm
  SET buffer_profile_id = CASE
    WHEN pc.variability_level = 'low' THEN 'BP_LOW'
    WHEN pc.variability_level = 'medium' THEN 'BP_MEDIUM'
    WHEN pc.variability_level = 'high' THEN 'BP_HIGH'
    ELSE 'BP_DEFAULT'
  END
  FROM product_classification pc
  WHERE pm.product_id = pc.product_id
    AND pc.variability_level IS NOT NULL;

  -- For products without classification, distribute them across profiles
  UPDATE product_master
  SET buffer_profile_id = CASE 
    WHEN RANDOM() < 0.33 THEN 'BP_LOW'
    WHEN RANDOM() < 0.66 THEN 'BP_MEDIUM'
    ELSE 'BP_HIGH'
  END
  WHERE buffer_profile_id = 'BP_DEFAULT';
END;
$$;

-- Execute the function
SELECT assign_buffer_profiles_by_classification();