-- Add more buffer profiles for variety
INSERT INTO buffer_profile_master (buffer_profile_id, name, description, lt_factor, variability_factor, order_cycle_days, min_order_qty, rounding_multiple)
VALUES
  ('BP_LOW', 'Low Variability', 'For stable demand products', 0.5, 0.15, 7, 10, 5),
  ('BP_MEDIUM', 'Medium Variability', 'For moderate demand products', 1.0, 0.5, 7, 20, 10),
  ('BP_HIGH', 'High Variability', 'For volatile demand products', 1.5, 1.0, 14, 50, 25)
ON CONFLICT (buffer_profile_id) DO NOTHING;