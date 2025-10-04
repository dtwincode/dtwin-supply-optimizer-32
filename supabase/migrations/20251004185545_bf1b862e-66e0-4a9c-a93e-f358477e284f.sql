-- Add additional configuration values that were previously hardcoded
INSERT INTO public.sales_pattern_config (config_type, config_key, multiplier) VALUES
  ('location_calc', 'seating_capacity_normalizer', 60),     -- Normalize seating capacity around this value
  ('location_calc', 'drive_thru_boost', 1.2),               -- 20% boost for drive-thru locations
  ('quantity_calc', 'random_variation_min', 0.75),          -- Min random variation (75%)
  ('quantity_calc', 'random_variation_range', 0.5),         -- Range of variation (0.75 to 1.25)
  ('quantity_calc', 'minimum_quantity_threshold', 3),       -- Skip sales below this quantity
  ('price_calc', 'default_fallback_price', 20.0),           -- Fallback price if no price data
  ('price_calc', 'price_variation_min', 0.9),               -- Min price variation (90%)
  ('price_calc', 'price_variation_range', 0.2)              -- Range of price variation (0.9 to 1.1)
ON CONFLICT (config_type, config_key) DO UPDATE 
SET multiplier = EXCLUDED.multiplier;