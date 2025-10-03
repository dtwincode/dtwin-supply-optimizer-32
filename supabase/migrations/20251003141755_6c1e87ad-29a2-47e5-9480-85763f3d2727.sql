-- Fix RLS Disabled in Public vulnerability
-- Enable RLS on tables that control inventory planning calculations

-- 1. buffer_config - Controls global buffer calculation parameters
ALTER TABLE public.buffer_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read buffer_config"
  ON public.buffer_config
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to update buffer_config"
  ON public.buffer_config
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 2. buffer_profile_override - Product-specific buffer adjustments
ALTER TABLE public.buffer_profile_override ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to buffer_profile_override"
  ON public.buffer_profile_override
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 3. service_level_override - Critical: Controls service level calculations
ALTER TABLE public.service_level_override ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users full access to service_level_override"
  ON public.service_level_override
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);