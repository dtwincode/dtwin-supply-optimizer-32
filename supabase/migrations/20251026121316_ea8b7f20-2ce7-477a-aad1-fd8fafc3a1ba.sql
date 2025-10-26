-- Comprehensive Security Fix: Restrict access to all sensitive business intelligence tables
-- Fix for: Product BOM, Usage Analysis, Storage Requirements, Cost Tables, MOQ Data, Menu Mapping, Buffer Compliance

-- ==============================================
-- 1. PRODUCT BOM - Manufacturing Trade Secrets
-- ==============================================
DROP POLICY IF EXISTS "Allow authenticated full access to product_bom" ON product_bom;

CREATE POLICY "Admins have full access to product_bom"
ON product_bom FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Planners can view product_bom"
ON product_bom FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

COMMENT ON TABLE product_bom IS 
'Contains highly sensitive bill of materials data including product assembly sequences, ingredient quantities, and manufacturing processes. Access restricted to admin (full) and planner (read-only) roles to prevent competitors from stealing recipes and production methods.';

-- ==============================================
-- 2. USAGE ANALYSIS - Sales Performance Intelligence
-- ==============================================
DROP POLICY IF EXISTS "Allow authenticated full access to usage_analysis" ON usage_analysis;

CREATE POLICY "Admins have full access to usage_analysis"
ON usage_analysis FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Planners can view usage_analysis"
ON usage_analysis FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

COMMENT ON TABLE usage_analysis IS 
'Contains strategic business intelligence including avg_weekly_usage, percentage_of_total_usage, and volume_score for all product-location combinations. Access restricted to prevent competitors from identifying top-performing products and locations.';

-- ==============================================
-- 3. STORAGE REQUIREMENTS - Warehouse Operations
-- ==============================================
DROP POLICY IF EXISTS "Allow authenticated full access to storage_requirements" ON storage_requirements;

CREATE POLICY "Admins have full access to storage_requirements"
ON storage_requirements FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Planners can view storage_requirements"
ON storage_requirements FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

COMMENT ON TABLE storage_requirements IS 
'Contains warehouse capacity data, storage footprint calculations (cubic_meters_per_unit, storage_footprint_per_1000_units), and operational efficiency metrics. Access restricted to protect logistics strategies and facility planning intelligence.';

-- ==============================================
-- 4. PRODUCT COST COMPONENTS - Financial Data
-- ==============================================
DROP POLICY IF EXISTS "Allow authenticated access to product_cost_components" ON product_cost_components;

CREATE POLICY "Admins have full access to product_cost_components"
ON product_cost_components FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Planners can view product_cost_components"
ON product_cost_components FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

COMMENT ON TABLE product_cost_components IS 
'Contains detailed cost breakdown: material_cost, labor_cost, overhead_cost, total_unit_cost per product. Access restricted to prevent competitors from undercutting pricing and weakening supplier negotiation position.';

-- ==============================================
-- 5. WAREHOUSE COST STRUCTURE - Facility Costs
-- ==============================================
DROP POLICY IF EXISTS "Allow authenticated access to warehouse_cost_structure" ON warehouse_cost_structure;

CREATE POLICY "Admins have full access to warehouse_cost_structure"
ON warehouse_cost_structure FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Planners can view warehouse_cost_structure"
ON warehouse_cost_structure FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

COMMENT ON TABLE warehouse_cost_structure IS 
'Contains sensitive facility cost data: rent_per_sqm_monthly, utilities_cost_monthly, labor_cost_monthly, total_storage_sqm. Access restricted to protect operational cost structure.';

-- ==============================================
-- 6. INVENTORY CARRYING COSTS - Financial Rates
-- ==============================================
DROP POLICY IF EXISTS "Allow authenticated access to inventory_carrying_costs" ON inventory_carrying_costs;

CREATE POLICY "Admins have full access to inventory_carrying_costs"
ON inventory_carrying_costs FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Planners can view inventory_carrying_costs"
ON inventory_carrying_costs FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'planner'));

COMMENT ON TABLE inventory_carrying_costs IS 
'Contains financial planning rates: storage_cost_per_unit_per_day, insurance_rate_annual, obsolescence_rate_annual, opportunity_cost_rate_annual. Access restricted to protect financial strategy.';

-- ==============================================
-- 7. MOQ DATA - Supplier Relationships
-- ==============================================
-- First check if table exists and has RLS enabled
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'moq_data') THEN
    -- Drop any existing policies
    DROP POLICY IF EXISTS "Allow authenticated full access to moq_data" ON moq_data;
    DROP POLICY IF EXISTS "Allow authenticated access to moq_data" ON moq_data;
    
    -- Enable RLS if not already enabled
    ALTER TABLE moq_data ENABLE ROW LEVEL SECURITY;
    
    -- Create new policies
    EXECUTE 'CREATE POLICY "Admins have full access to moq_data"
    ON moq_data FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), ''admin''))
    WITH CHECK (public.has_role(auth.uid(), ''admin''))';
    
    EXECUTE 'CREATE POLICY "Planners can view moq_data"
    ON moq_data FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), ''planner''))';
    
    COMMENT ON TABLE moq_data IS 
    'Contains minimum order quantities, supplier IDs, and demand coverage data. Access restricted to prevent competitors from exploiting supplier relationships and negotiating position.';
  END IF;
END $$;

-- ==============================================
-- 8. MENU MAPPING - Core Product Strategy
-- ==============================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'menu_mapping') THEN
    DROP POLICY IF EXISTS "Allow authenticated full access to menu_mapping" ON menu_mapping;
    DROP POLICY IF EXISTS "Allow authenticated access to menu_mapping" ON menu_mapping;
    
    ALTER TABLE menu_mapping ENABLE ROW LEVEL SECURITY;
    
    EXECUTE 'CREATE POLICY "Admins have full access to menu_mapping"
    ON menu_mapping FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), ''admin''))
    WITH CHECK (public.has_role(auth.uid(), ''admin''))';
    
    EXECUTE 'CREATE POLICY "Planners can view menu_mapping"
    ON menu_mapping FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), ''planner''))';
    
    COMMENT ON TABLE menu_mapping IS 
    'Contains core product identification (is_core_item) and sales_impact_percentage. Access restricted to protect product strategy and revenue optimization intelligence.';
  END IF;
END $$;

-- ==============================================
-- 9. BUFFER CRITERIA COMPLIANCE - DDMRP Strategy
-- ==============================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'buffer_criteria_compliance') THEN
    DROP POLICY IF EXISTS "Allow authenticated full access to buffer_criteria_compliance" ON buffer_criteria_compliance;
    DROP POLICY IF EXISTS "Allow authenticated access to buffer_criteria_compliance" ON buffer_criteria_compliance;
    
    ALTER TABLE buffer_criteria_compliance ENABLE ROW LEVEL SECURITY;
    
    EXECUTE 'CREATE POLICY "Admins have full access to buffer_criteria_compliance"
    ON buffer_criteria_compliance FOR ALL TO authenticated
    USING (public.has_role(auth.uid(), ''admin''))
    WITH CHECK (public.has_role(auth.uid(), ''admin''))';
    
    EXECUTE 'CREATE POLICY "Planners can view buffer_criteria_compliance"
    ON buffer_criteria_compliance FOR SELECT TO authenticated
    USING (public.has_role(auth.uid(), ''planner''))';
    
    COMMENT ON TABLE buffer_criteria_compliance IS 
    'Contains detailed DDMRP compliance scores, buffer test results, and inventory planning methodology. Access restricted to prevent competitors from reverse-engineering inventory management strategy.';
  END IF;
END $$;