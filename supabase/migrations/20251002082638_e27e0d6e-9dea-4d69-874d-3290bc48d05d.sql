-- ============================================
-- DROP NON-INVENTORY TABLES
-- ============================================
-- WARNING: This will permanently delete tables and their data
-- Make sure you have backups if needed

-- FORECASTING & PLANNING TABLES (9)
DROP TABLE IF EXISTS integrated_forecast_data CASCADE;
DROP TABLE IF EXISTS permanent_hierarchy_files CASCADE;
DROP TABLE IF EXISTS permanent_hierarchy_data CASCADE;
DROP TABLE IF EXISTS seasonality_patterns CASCADE;
DROP TABLE IF EXISTS market_events CASCADE;
DROP TABLE IF EXISTS forecast_outliers CASCADE;
DROP TABLE IF EXISTS active_models CASCADE;
DROP TABLE IF EXISTS model_testing_configs CASCADE;
DROP TABLE IF EXISTS saved_model_configs CASCADE;

-- LOGISTICS & DISTRIBUTION TABLES (2)
DROP TABLE IF EXISTS logistics_data CASCADE;
DROP TABLE IF EXISTS logistics_enhanced_orders CASCADE;

-- MARKETING TABLES (1)
DROP TABLE IF EXISTS marketing_data CASCADE;

-- DUPLICATE/LEGACY TABLES (3)
DROP TABLE IF EXISTS inventory_threshold_overrides CASCADE;
DROP TABLE IF EXISTS master_lead_time CASCADE;
DROP TABLE IF EXISTS classification_rules_history CASCADE;

-- UNUSED ANALYTICS TABLES (3)
DROP TABLE IF EXISTS lead_time_anomalies CASCADE;
DROP TABLE IF EXISTS model_version_applications CASCADE;
DROP TABLE IF EXISTS supplier_product_mapping CASCADE;

-- SYSTEM TABLES (5) - USE WITH CAUTION
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS data_validation_logs CASCADE;
DROP TABLE IF EXISTS module_settings CASCADE;
DROP TABLE IF EXISTS secrets CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Clean up any orphaned functions or views related to dropped tables
DROP VIEW IF EXISTS storage_requirements_view CASCADE;
DROP VIEW IF EXISTS supplier_contract_lead_time_view CASCADE;
DROP FUNCTION IF EXISTS integrate_forecast_data(jsonb) CASCADE;