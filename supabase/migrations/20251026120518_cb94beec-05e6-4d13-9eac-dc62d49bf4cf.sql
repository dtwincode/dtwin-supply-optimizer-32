-- Fix demand_history_analysis security: Restrict access to sensitive sales pattern data
-- Remove overly permissive policy and replace with role-based access control

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated full access to demand_history_analysis" ON demand_history_analysis;

-- Admin users: Full access to demand analysis (can manage and analyze demand patterns)
CREATE POLICY "Admins have full access to demand_history_analysis"
ON demand_history_analysis
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Planners: Read-only access to demand analysis (need this data for demand planning and forecasting)
CREATE POLICY "Planners can view demand_history_analysis"
ON demand_history_analysis
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

-- Viewers: NO ACCESS to sensitive demand and sales pattern data
-- This prevents unauthorized users from stealing business intelligence

-- Add audit comment
COMMENT ON TABLE demand_history_analysis IS 
'Contains sensitive sales patterns and demand analytics including mean demand, standard deviation, coefficient of variation, and variability scores by product and location. Access restricted to admin (full) and planner (read-only) roles only. Viewers and public have no access to prevent competitors from using this data to undercut pricing, target best-performing locations, or identify weaknesses.';