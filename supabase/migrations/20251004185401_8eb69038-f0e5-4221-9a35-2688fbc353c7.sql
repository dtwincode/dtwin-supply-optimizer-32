-- Create table for sales pattern configurations
CREATE TABLE IF NOT EXISTS public.sales_pattern_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_type TEXT NOT NULL, -- 'day_of_week', 'seasonal', 'category', 'regional', 'base_volume'
  config_key TEXT NOT NULL, -- e.g., 'sunday', 'january', 'Beef Burgers', 'Makkah'
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(config_type, config_key)
);

-- Enable RLS
ALTER TABLE public.sales_pattern_config ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow authenticated full access to sales_pattern_config"
ON public.sales_pattern_config
FOR ALL
USING (true)
WITH CHECK (true);

-- Insert day of week multipliers (0=Sunday, 6=Saturday)
INSERT INTO public.sales_pattern_config (config_type, config_key, multiplier) VALUES
  ('day_of_week', '0', 1.0),   -- Sunday
  ('day_of_week', '1', 0.85),  -- Monday
  ('day_of_week', '2', 0.9),   -- Tuesday
  ('day_of_week', '3', 0.95),  -- Wednesday
  ('day_of_week', '4', 1.1),   -- Thursday
  ('day_of_week', '5', 1.3),   -- Friday
  ('day_of_week', '6', 1.2);   -- Saturday

-- Insert seasonal multipliers (0=January, 11=December)
INSERT INTO public.sales_pattern_config (config_type, config_key, multiplier) VALUES
  ('seasonal', '0', 0.9),   -- January
  ('seasonal', '1', 0.95),  -- February
  ('seasonal', '2', 1.0),   -- March
  ('seasonal', '3', 1.05),  -- April
  ('seasonal', '4', 0.7),   -- May (Ramadan dip)
  ('seasonal', '5', 1.2),   -- June (Eid surge)
  ('seasonal', '6', 1.3),   -- July (Summer peak)
  ('seasonal', '7', 1.25),  -- August
  ('seasonal', '8', 1.1),   -- September
  ('seasonal', '9', 1.0),   -- October
  ('seasonal', '10', 0.95), -- November
  ('seasonal', '11', 0.9);  -- December

-- Insert category popularity multipliers
INSERT INTO public.sales_pattern_config (config_type, config_key, multiplier) VALUES
  ('category', 'Beef Burgers', 1.0),
  ('category', 'Chicken Burgers', 0.95),
  ('category', 'Sandwiches/Wraps', 0.8),
  ('category', 'Sides & Appetizers', 1.2),
  ('category', 'Bestsellers/Limited Offers', 0.9),
  ('category', 'Gathering Boxes', 0.4),
  ('category', 'Sauces', 0.6),
  ('category', 'Other', 0.7);

-- Insert regional multipliers
INSERT INTO public.sales_pattern_config (config_type, config_key, multiplier) VALUES
  ('regional', 'Makkah', 1.5),
  ('regional', 'Riyadh', 1.3),
  ('regional', 'Jeddah', 1.4),
  ('regional', 'default', 1.0);

-- Insert base volume configuration
INSERT INTO public.sales_pattern_config (config_type, config_key, multiplier) VALUES
  ('base_volume', 'default', 30);

-- Create index for faster lookups
CREATE INDEX idx_sales_pattern_config_type_key ON public.sales_pattern_config(config_type, config_key);

-- Add trigger for updated_at
CREATE TRIGGER update_sales_pattern_config_updated_at
  BEFORE UPDATE ON public.sales_pattern_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();