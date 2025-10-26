-- Fix buffer_breach_alerts security: Restrict access to authorized inventory managers only
-- Remove overly permissive policies and replace with role-based access control

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow authenticated users to insert breach alerts" ON buffer_breach_alerts;
DROP POLICY IF EXISTS "Allow authenticated users to read breach alerts" ON buffer_breach_alerts;
DROP POLICY IF EXISTS "Allow authenticated users to update breach alerts" ON buffer_breach_alerts;

-- Admin users: Full access to breach alerts (can manage alerts and acknowledge)
CREATE POLICY "Admins have full access to buffer_breach_alerts"
ON buffer_breach_alerts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Planners: Full access to breach alerts (need to view, acknowledge, and manage inventory issues)
CREATE POLICY "Planners have full access to buffer_breach_alerts"
ON buffer_breach_alerts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'planner'))
WITH CHECK (public.has_role(auth.uid(), 'planner'));

-- Viewers: NO ACCESS to sensitive inventory breach data
-- This prevents unauthorized users from seeing supply chain weaknesses

-- Add audit comment
COMMENT ON TABLE buffer_breach_alerts IS 
'Contains sensitive inventory breach alerts showing stockouts, shortages, and recommended orders. Access restricted to admin and planner roles only. Viewers and public have no access to prevent competitors from exploiting supply chain weaknesses.';