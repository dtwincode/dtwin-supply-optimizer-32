-- Enable RLS on tables that don't have it yet (skip those that already have it)
ALTER TABLE location_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_location_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_sales_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE master_lead_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE actual_lead_time ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_classification ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for location_master
CREATE POLICY "Allow authenticated full access to location_master"
ON location_master
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for product_master
CREATE POLICY "Allow authenticated full access to product_master"
ON product_master
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for product_location_pairs
CREATE POLICY "Allow authenticated full access to product_location_pairs"
ON product_location_pairs
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for historical_sales_data
CREATE POLICY "Allow authenticated full access to historical_sales_data"
ON historical_sales_data
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for vendor_master
CREATE POLICY "Allow authenticated full access to vendor_master"
ON vendor_master
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for channel_master
CREATE POLICY "Allow authenticated full access to channel_master"
ON channel_master
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for master_lead_time
CREATE POLICY "Allow authenticated full access to master_lead_time"
ON master_lead_time
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for actual_lead_time
CREATE POLICY "Allow authenticated full access to actual_lead_time"
ON actual_lead_time
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policies for product_classification
CREATE POLICY "Allow authenticated full access to product_classification"
ON product_classification
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create RLS policy for product_pricing-master (note the hyphen in table name)
ALTER TABLE "product_pricing-master" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full access to product_pricing_master"
ON "product_pricing-master"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);