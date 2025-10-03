-- Create Zone Adjustment Factor (ZAF) table
CREATE TABLE IF NOT EXISTS public.zone_adjustment_factor (
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  zaf NUMERIC NOT NULL DEFAULT 1.0 CHECK (zaf >= 0.20 AND zaf <= 3.00),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (product_id, location_id, start_date)
);

-- Create Lead Time Adjustment Factor (LTAF) table
CREATE TABLE IF NOT EXISTS public.lead_time_adjustment_factor (
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  ltaf NUMERIC NOT NULL DEFAULT 1.0 CHECK (ltaf >= 0.20 AND ltaf <= 3.00),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (product_id, location_id, start_date)
);

-- Enable RLS
ALTER TABLE public.zone_adjustment_factor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_time_adjustment_factor ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated full access to ZAF"
ON public.zone_adjustment_factor
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to LTAF"
ON public.lead_time_adjustment_factor
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Add comments
COMMENT ON TABLE public.zone_adjustment_factor IS 'DDMRP Zone Adjustment Factor - adjusts variability factor in buffer zones';
COMMENT ON TABLE public.lead_time_adjustment_factor IS 'DDMRP Lead Time Adjustment Factor - adjusts lead time factor in buffer calculations';

COMMENT ON COLUMN public.zone_adjustment_factor.zaf IS 'Zone adjustment multiplier (0.20-3.00) applied to variability factor';
COMMENT ON COLUMN public.lead_time_adjustment_factor.ltaf IS 'Lead time adjustment multiplier (0.20-3.00) applied to LT factor';