-- Create table for tracking AI recommendations
CREATE TABLE IF NOT EXISTS public.decoupling_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  total_score NUMERIC NOT NULL,
  recommendation TEXT NOT NULL CHECK (recommendation IN ('PULL_STORE_LEVEL', 'HYBRID_DC_LEVEL', 'PUSH_UPSTREAM')),
  factor_breakdown JSONB NOT NULL,
  planner_decision TEXT CHECK (planner_decision IN ('accepted', 'rejected', 'pending')),
  decision_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  decided_at TIMESTAMP WITH TIME ZONE,
  decided_by UUID,
  UNIQUE(product_id, location_id, created_at)
);

-- Create table for manual overrides
CREATE TABLE IF NOT EXISTS public.manual_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  ai_recommendation TEXT NOT NULL,
  planner_decision TEXT NOT NULL CHECK (planner_decision IN ('accept_override', 'reject_override')),
  justification TEXT NOT NULL,
  override_type TEXT NOT NULL CHECK (override_type IN ('accept_push', 'reject_pull_hybrid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID
);

-- Create table for alignment violations tracking
CREATE TABLE IF NOT EXISTS public.alignment_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id TEXT NOT NULL,
  product_id TEXT,
  violation_type TEXT NOT NULL CHECK (violation_type IN ('empty_decouple', 'orphan_buffer')),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_action TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'ignored'))
);

-- Enable RLS
ALTER TABLE public.decoupling_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alignment_violations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for decoupling_recommendations
CREATE POLICY "Allow authenticated full access to decoupling_recommendations"
ON public.decoupling_recommendations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policies for manual_overrides
CREATE POLICY "Allow authenticated full access to manual_overrides"
ON public.manual_overrides
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policies for alignment_violations
CREATE POLICY "Allow authenticated full access to alignment_violations"
ON public.alignment_violations
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX idx_decoupling_recommendations_product_location 
  ON public.decoupling_recommendations(product_id, location_id);
CREATE INDEX idx_decoupling_recommendations_decision 
  ON public.decoupling_recommendations(planner_decision);
CREATE INDEX idx_manual_overrides_created_at 
  ON public.manual_overrides(created_at DESC);
CREATE INDEX idx_alignment_violations_status 
  ON public.alignment_violations(status) WHERE status = 'open';