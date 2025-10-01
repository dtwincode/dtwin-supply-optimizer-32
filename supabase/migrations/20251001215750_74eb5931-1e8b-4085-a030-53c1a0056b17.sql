-- Remove duplicate and unused tables for inventory module cleanup

-- Drop buffer_profiles (duplicate of buffer_profile_master)
DROP TABLE IF EXISTS public.buffer_profiles CASCADE;

-- Drop hierarchy_file_references (not used by inventory)
DROP TABLE IF EXISTS public.hierarchy_file_references CASCADE;

-- Drop purchase_orders (use replenishment_orders instead)
DROP TABLE IF EXISTS public.purchase_orders CASCADE;

-- Drop inventory_data (generic table not used)
DROP TABLE IF EXISTS public.inventory_data CASCADE;

-- Drop scenarios (forecasting scenarios)
DROP TABLE IF EXISTS public.scenarios CASCADE;