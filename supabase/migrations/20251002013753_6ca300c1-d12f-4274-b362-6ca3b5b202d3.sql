-- Create supplier-related tables
CREATE TABLE IF NOT EXISTS supplier_contracts (
  contract_id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  contract_start_date DATE NOT NULL,
  contract_end_date DATE,
  unit_cost NUMERIC NOT NULL,
  minimum_order_qty NUMERIC DEFAULT 0,
  lead_time_days INTEGER NOT NULL,
  payment_terms TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS supplier_product_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  is_primary_supplier BOOLEAN DEFAULT false,
  reliability_score NUMERIC DEFAULT 0.85,
  average_lead_time_days INTEGER,
  last_delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(supplier_id, product_id)
);

CREATE TABLE IF NOT EXISTS supplier_lead_time_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  order_date DATE NOT NULL,
  promised_delivery_date DATE NOT NULL,
  actual_delivery_date DATE,
  promised_lead_time_days INTEGER,
  actual_lead_time_days INTEGER,
  on_time BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cost-related tables
CREATE TABLE IF NOT EXISTS inventory_carrying_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id TEXT NOT NULL,
  product_category TEXT NOT NULL,
  storage_cost_per_unit_per_day NUMERIC NOT NULL,
  insurance_rate_annual NUMERIC DEFAULT 0.02,
  obsolescence_rate_annual NUMERIC DEFAULT 0.05,
  opportunity_cost_rate_annual NUMERIC DEFAULT 0.10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warehouse_cost_structure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id TEXT NOT NULL UNIQUE,
  rent_per_sqm_monthly NUMERIC,
  utilities_cost_monthly NUMERIC,
  labor_cost_monthly NUMERIC,
  total_storage_sqm NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_cost_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL UNIQUE,
  material_cost NUMERIC DEFAULT 0,
  labor_cost NUMERIC DEFAULT 0,
  overhead_cost NUMERIC DEFAULT 0,
  total_unit_cost NUMERIC GENERATED ALWAYS AS (material_cost + labor_cost + overhead_cost) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_time_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  procurement_time_days INTEGER DEFAULT 0,
  manufacturing_time_days INTEGER DEFAULT 0,
  shipping_time_days INTEGER DEFAULT 0,
  total_lead_time_days INTEGER GENERATED ALWAYS AS (procurement_time_days + manufacturing_time_days + shipping_time_days) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, location_id)
);

-- Enable RLS
ALTER TABLE supplier_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_product_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_lead_time_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_carrying_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_cost_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_cost_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_time_components ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow authenticated access to supplier_contracts" ON supplier_contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated access to supplier_product_mapping" ON supplier_product_mapping FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated access to supplier_lead_time_history" ON supplier_lead_time_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated access to inventory_carrying_costs" ON inventory_carrying_costs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated access to warehouse_cost_structure" ON warehouse_cost_structure FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated access to product_cost_components" ON product_cost_components FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated access to lead_time_components" ON lead_time_components FOR ALL USING (true) WITH CHECK (true);