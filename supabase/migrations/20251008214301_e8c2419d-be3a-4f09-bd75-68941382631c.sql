-- Create buffer_breach_alerts table
CREATE TABLE IF NOT EXISTS public.buffer_breach_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  sku TEXT,
  product_name TEXT,
  breach_type TEXT NOT NULL CHECK (breach_type IN ('BELOW_TOR', 'BELOW_TOY')),
  severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM')),
  nfp NUMERIC NOT NULL,
  tor NUMERIC NOT NULL,
  toy NUMERIC,
  buffer_penetration_pct NUMERIC,
  recommended_qty NUMERIC,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_breach_alerts_product_location ON public.buffer_breach_alerts(product_id, location_id);
CREATE INDEX idx_breach_alerts_detected_at ON public.buffer_breach_alerts(detected_at DESC);
CREATE INDEX idx_breach_alerts_acknowledged ON public.buffer_breach_alerts(acknowledged) WHERE acknowledged = FALSE;
CREATE INDEX idx_breach_alerts_severity ON public.buffer_breach_alerts(severity);

-- Enable RLS
ALTER TABLE public.buffer_breach_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated users to read breach alerts"
  ON public.buffer_breach_alerts
  FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated users to update breach alerts"
  ON public.buffer_breach_alerts
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated users to insert breach alerts"
  ON public.buffer_breach_alerts
  FOR INSERT
  WITH CHECK (true);

-- Enable realtime for instant notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.buffer_breach_alerts;

-- Create function to detect and insert breaches
CREATE OR REPLACE FUNCTION public.detect_buffer_breaches_v2()
RETURNS TABLE(
  breaches_detected INTEGER,
  critical_count INTEGER,
  high_count INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_breaches_detected INTEGER := 0;
  v_critical_count INTEGER := 0;
  v_high_count INTEGER := 0;
  v_item RECORD;
BEGIN
  -- Loop through inventory items and detect breaches
  FOR v_item IN 
    SELECT 
      ipv.product_id,
      ipv.location_id,
      ipv.sku,
      ipv.product_name,
      ipv.nfp,
      ipv.tor,
      ipv.toy,
      ipv.tog,
      (ipv.nfp / NULLIF(ipv.tor, 0)) * 100 AS penetration_pct
    FROM inventory_planning_view ipv
    WHERE ipv.nfp IS NOT NULL 
      AND ipv.tor IS NOT NULL
      AND ipv.nfp <= ipv.toy -- Only items below TOY
  LOOP
    -- Check if breach already exists (within last 6 hours) and not acknowledged
    IF NOT EXISTS (
      SELECT 1 FROM public.buffer_breach_alerts
      WHERE product_id = v_item.product_id
        AND location_id = v_item.location_id
        AND acknowledged = FALSE
        AND detected_at > NOW() - INTERVAL '6 hours'
    ) THEN
      -- Determine breach type and severity
      IF v_item.nfp < v_item.tor THEN
        -- CRITICAL: Below TOR
        INSERT INTO public.buffer_breach_alerts (
          product_id, location_id, sku, product_name,
          breach_type, severity,
          nfp, tor, toy, buffer_penetration_pct,
          recommended_qty
        ) VALUES (
          v_item.product_id, v_item.location_id, v_item.sku, v_item.product_name,
          'BELOW_TOR', 'CRITICAL',
          v_item.nfp, v_item.tor, v_item.toy, v_item.penetration_pct,
          GREATEST(0, v_item.tog - v_item.nfp)
        );
        
        v_breaches_detected := v_breaches_detected + 1;
        v_critical_count := v_critical_count + 1;
        
      ELSIF v_item.nfp < v_item.toy THEN
        -- HIGH: Below TOY but above TOR
        INSERT INTO public.buffer_breach_alerts (
          product_id, location_id, sku, product_name,
          breach_type, severity,
          nfp, tor, toy, buffer_penetration_pct,
          recommended_qty
        ) VALUES (
          v_item.product_id, v_item.location_id, v_item.sku, v_item.product_name,
          'BELOW_TOY', 'HIGH',
          v_item.nfp, v_item.tor, v_item.toy, v_item.penetration_pct,
          GREATEST(0, v_item.tog - v_item.nfp)
        );
        
        v_breaches_detected := v_breaches_detected + 1;
        v_high_count := v_high_count + 1;
      END IF;
    END IF;
  END LOOP;
  
  RETURN QUERY SELECT v_breaches_detected, v_critical_count, v_high_count;
END;
$$;

COMMENT ON FUNCTION public.detect_buffer_breaches_v2() IS 'Detects buffer breaches (NFP < TOR or TOY) and creates alerts';

-- Grant execution
GRANT EXECUTE ON FUNCTION public.detect_buffer_breaches_v2() TO authenticated, anon;