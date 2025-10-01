-- Drop and recreate decoupling_points table with proper structure
DROP TABLE IF EXISTS decoupling_points CASCADE;

CREATE TABLE public.decoupling_points (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  location_id text NOT NULL,
  buffer_profile_id text NOT NULL DEFAULT 'BP_DEFAULT',
  is_strategic boolean NOT NULL DEFAULT true,
  designation_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(product_id, location_id)
);

-- Add RLS policies
ALTER TABLE public.decoupling_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access to decoupling_points"
ON public.decoupling_points
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_decoupling_points_product ON public.decoupling_points(product_id);
CREATE INDEX idx_decoupling_points_location ON public.decoupling_points(location_id);
CREATE INDEX idx_decoupling_points_strategic ON public.decoupling_points(is_strategic) WHERE is_strategic = true;

-- Add trigger for updated_at
CREATE TRIGGER set_decoupling_points_updated_at
  BEFORE UPDATE ON public.decoupling_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Recreate inventory_ddmrp_buffers_view to ONLY show buffers at decoupling points
DROP VIEW IF EXISTS inventory_ddmrp_buffers_view CASCADE;

CREATE OR REPLACE VIEW inventory_ddmrp_buffers_view AS
SELECT 
  pm.product_id,
  pm.sku,
  pm.name AS product_name,
  pm.category,
  pm.subcategory,
  dp.location_id,
  dp.buffer_profile_id,
  bpm.name AS buffer_profile_name,
  bpm.lt_factor,
  bpm.variability_factor,
  bpm.order_cycle_days,
  bpm.min_order_qty,
  bpm.rounding_multiple,
  
  -- ADU from 90-day view
  COALESCE(adu.adu_adj, 0) AS adu,
  
  -- DLT from master_lead_time
  COALESCE(mlt.standard_lead_time_days, 7) AS dlt,
  
  -- Red Zone = ADU × DLT × LT_factor × variability_factor
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(mlt.standard_lead_time_days, 7) * 
    bpm.lt_factor * 
    bpm.variability_factor
  , 2) AS red_zone,
  
  -- Yellow Zone = ADU × order_cycle_days
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    bpm.order_cycle_days
  , 2) AS yellow_zone,
  
  -- Green Zone = Red Zone (simplified; can be more complex)
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(mlt.standard_lead_time_days, 7) * 
    bpm.lt_factor * 
    bpm.variability_factor
  , 2) AS green_zone,
  
  -- TOR (Top of Red)
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(mlt.standard_lead_time_days, 7) * 
    bpm.lt_factor * 
    bpm.variability_factor
  , 2) AS tor,
  
  -- TOY (Top of Yellow) = TOR + Yellow
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(mlt.standard_lead_time_days, 7) * 
    bpm.lt_factor * 
    bpm.variability_factor
    +
    COALESCE(adu.adu_adj, 0) * 
    bpm.order_cycle_days
  , 2) AS toy,
  
  -- TOG (Top of Green) = TOY + Green
  ROUND(
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(mlt.standard_lead_time_days, 7) * 
    bpm.lt_factor * 
    bpm.variability_factor
    +
    COALESCE(adu.adu_adj, 0) * 
    bpm.order_cycle_days
    +
    COALESCE(adu.adu_adj, 0) * 
    COALESCE(mlt.standard_lead_time_days, 7) * 
    bpm.lt_factor * 
    bpm.variability_factor
  , 2) AS tog

FROM public.decoupling_points dp
INNER JOIN public.product_master pm ON dp.product_id = pm.product_id
INNER JOIN public.buffer_profile_master bpm ON dp.buffer_profile_id = bpm.buffer_profile_id
LEFT JOIN public.adu_90d_view adu ON dp.product_id = adu.product_id AND dp.location_id = adu.location_id
LEFT JOIN public.master_lead_time mlt ON dp.product_id = mlt.product_id AND dp.location_id = mlt.location_id
WHERE dp.is_strategic = true;

-- Add some sample decoupling points for testing
INSERT INTO public.decoupling_points (product_id, location_id, buffer_profile_id, designation_reason)
SELECT DISTINCT 
  pm.product_id,
  lm.location_id,
  COALESCE(pm.buffer_profile_id, 'BP_DEFAULT'),
  'Initial strategic designation'
FROM public.product_master pm
CROSS JOIN public.location_master lm
WHERE pm.planning_priority = 'HIGH'
LIMIT 20
ON CONFLICT (product_id, location_id) DO NOTHING;