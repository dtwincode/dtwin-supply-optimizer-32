-- Fix vendor_master security: Restrict access to authorized procurement staff only
-- Remove overly permissive policy and replace with role-based access control

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated full access to vendor_master" ON vendor_master;

-- Admin users: Full access to vendor data (procurement management)
CREATE POLICY "Admins have full access to vendor_master"
ON vendor_master
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Planners: Read-only access to vendor data (for planning purposes)
-- They can view vendor info but cannot modify sensitive contact details
CREATE POLICY "Planners can view vendor_master"
ON vendor_master
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

-- Viewers: NO ACCESS to sensitive vendor contact information
-- This prevents unauthorized users from stealing supplier data

-- Add audit comment
COMMENT ON TABLE vendor_master IS 
'Contains sensitive supplier contact information. Access restricted to admin (full) and planner (read-only) roles only. Viewers and public have no access to prevent data theft.';