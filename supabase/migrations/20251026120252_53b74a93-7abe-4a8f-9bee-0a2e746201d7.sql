-- Fix location_hierarchy security: Restrict access to sensitive network structure data
-- Remove overly permissive policy and replace with role-based access control

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated full access to location_hierarchy" ON location_hierarchy;

-- Admin users: Full access to location hierarchy (can manage network structure)
CREATE POLICY "Admins have full access to location_hierarchy"
ON location_hierarchy
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Planners: Read-only access to location hierarchy (need to understand network for planning)
CREATE POLICY "Planners can view location_hierarchy"
ON location_hierarchy
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

-- Viewers: NO ACCESS to sensitive network structure data
-- This prevents unauthorized users from mapping your distribution network

-- Add audit comment
COMMENT ON TABLE location_hierarchy IS 
'Contains sensitive supply chain network structure including warehouse relationships, echelon levels, regions, and buffer strategies. Access restricted to admin (full) and planner (read-only) roles only. Viewers and public have no access to prevent competitors from mapping distribution network and understanding supply chain architecture.';