-- Create inventory configuration table
CREATE TABLE IF NOT EXISTS public.inventory_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT UNIQUE NOT NULL,
  config_value NUMERIC NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inventory_config ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Allow authenticated full access to inventory_config"
ON public.inventory_config
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert default configuration values
INSERT INTO public.inventory_config (config_key, config_value, description, category) VALUES
  ('recommendation_products_limit', 20, 'Number of products to load for AI recommendations', 'recommendation'),
  ('recommendation_locations_limit', 5, 'Number of locations per product for recommendations', 'recommendation'),
  ('recommendation_pairs_display_limit', 10, 'Number of product-location pairs to display', 'recommendation'),
  ('recommendation_calculation_batch_size', 10, 'Batch size for score calculations', 'recommendation'),
  ('auto_designate_threshold', 0.75, 'Default threshold for auto-designation (0-1)', 'decoupling'),
  ('buffer_heatmap_limit', 50, 'Maximum buffer cells to display in heatmap', 'analytics'),
  ('decoupling_pairs_display_limit', 50, 'Maximum pairs to display in decoupling management', 'decoupling'),
  ('breach_critical_display_limit', 3, 'Number of critical breaches to display', 'alerts'),
  ('analytics_turnover_limit', 10, 'Number of items in turnover analysis', 'analytics'),
  ('network_topology_batch_size', 100, 'Batch size for network topology loading', 'network')
ON CONFLICT (config_key) DO NOTHING;

-- Create index
CREATE INDEX idx_inventory_config_category ON public.inventory_config(category);
CREATE INDEX idx_inventory_config_key ON public.inventory_config(config_key);