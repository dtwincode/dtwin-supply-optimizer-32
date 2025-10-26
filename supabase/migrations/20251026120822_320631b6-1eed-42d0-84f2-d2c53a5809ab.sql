-- Fix vendor_master contact information security: Restrict to admins only
-- Remove planner read access to prevent contact information theft

-- Drop existing policies
DROP POLICY IF EXISTS "Admins have full access to vendor_master" ON vendor_master;
DROP POLICY IF EXISTS "Planners can view vendor_master" ON vendor_master;

-- Admin users ONLY: Full access to vendor contact data
-- No other roles should have access to sensitive contact information
CREATE POLICY "Only admins can access vendor_master"
ON vendor_master
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update audit comment to reflect stricter access control
COMMENT ON TABLE vendor_master IS 
'Contains highly sensitive supplier contact information including contact_person, contact_email, and phone_number. Access restricted ONLY to admin role to prevent competitors from poaching suppliers or conducting phishing attacks. Planners and viewers have NO access to protect vendor relationships and supply chain security.';