-- Fix supplier_contracts security: Restrict access to sensitive pricing and contract data
-- Remove overly permissive policy and replace with role-based access control

-- Drop existing overly permissive policy
DROP POLICY IF EXISTS "Allow authenticated access to supplier_contracts" ON supplier_contracts;

-- Admin users: Full access to contract data (can manage contracts, pricing, and terms)
CREATE POLICY "Admins have full access to supplier_contracts"
ON supplier_contracts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Planners: Read-only access to contract data (need to see pricing for planning/sourcing decisions)
CREATE POLICY "Planners can view supplier_contracts"
ON supplier_contracts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

-- Viewers: NO ACCESS to sensitive contract and pricing information
-- This prevents unauthorized users from leaking pricing data to competitors

-- Add audit comment
COMMENT ON TABLE supplier_contracts IS 
'Contains sensitive supplier contract details including unit costs, payment terms, and lead times. Access restricted to admin (full) and planner (read-only) roles only. Viewers and public have no access to prevent competitive intelligence leaks and protect negotiation leverage.';