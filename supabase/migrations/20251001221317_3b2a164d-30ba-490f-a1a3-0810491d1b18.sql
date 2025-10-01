-- ========================================
-- Phase 2: Drop Non-Inventory Tables
-- Clean up forecasting, logistics, analytics modules
-- Keep only DDMRP inventory core tables
-- ========================================

-- Drop forecasting module tables (26 tables)
DROP TABLE IF EXISTS forecast_models CASCADE;
DROP TABLE IF EXISTS forecast_data CASCADE;
DROP TABLE IF EXISTS forecast_accuracy CASCADE;
DROP TABLE IF EXISTS forecast_test_periods CASCADE;
DROP TABLE IF EXISTS forecast_data_quality CASCADE;
DROP TABLE IF EXISTS model_versions CASCADE;
DROP TABLE IF EXISTS model_training_history CASCADE;
DROP TABLE IF EXISTS external_factors CASCADE;
DROP TABLE IF EXISTS forecast_integration_mappings CASCADE;
DROP TABLE IF EXISTS forecast_scenarios CASCADE;
DROP TABLE IF EXISTS forecast_baseline CASCADE;
DROP TABLE IF EXISTS forecast_adjustments CASCADE;
DROP TABLE IF EXISTS forecast_performance CASCADE;
DROP TABLE IF EXISTS forecast_alerts CASCADE;
DROP TABLE IF EXISTS forecast_validation CASCADE;
DROP TABLE IF EXISTS forecast_parameters CASCADE;
DROP TABLE IF EXISTS forecast_history CASCADE;
DROP TABLE IF EXISTS forecast_overrides CASCADE;
DROP TABLE IF EXISTS forecast_collaboration CASCADE;
DROP TABLE IF EXISTS forecast_comments CASCADE;
DROP TABLE IF EXISTS forecast_approvals CASCADE;
DROP TABLE IF EXISTS forecast_audit CASCADE;
DROP TABLE IF EXISTS forecast_reporting CASCADE;
DROP TABLE IF EXISTS forecast_exports CASCADE;
DROP TABLE IF EXISTS forecast_imports CASCADE;
DROP TABLE IF EXISTS forecast_templates CASCADE;

-- Drop logistics module tables (7 tables)
DROP TABLE IF EXISTS logistics_tracking CASCADE;
DROP TABLE IF EXISTS logistics_analytics CASCADE;
DROP TABLE IF EXISTS logistics_documents CASCADE;
DROP TABLE IF EXISTS logistics_routes CASCADE;
DROP TABLE IF EXISTS logistics_carriers CASCADE;
DROP TABLE IF EXISTS logistics_shipments CASCADE;
DROP TABLE IF EXISTS logistics_costs CASCADE;

-- Drop market/weather data tables (3 tables)
DROP TABLE IF EXISTS weather_data CASCADE;
DROP TABLE IF EXISTS market_conditions CASCADE;
DROP TABLE IF EXISTS price_analysis CASCADE;

-- Drop advanced analytics tables (8 tables)
DROP TABLE IF EXISTS lead_time_predictions CASCADE;
DROP TABLE IF EXISTS prediction_accuracy_tracking CASCADE;
DROP TABLE IF EXISTS demand_distribution_profile CASCADE;
DROP TABLE IF EXISTS data_quality_metrics CASCADE;
DROP TABLE IF EXISTS ddmrp_metrics_history CASCADE;
DROP TABLE IF EXISTS threshold_update_config CASCADE;
DROP TABLE IF EXISTS order_spike_settings CASCADE;
DROP TABLE IF EXISTS replenishment_data CASCADE;

-- Note: Keep these system tables as they may be needed:
-- - profiles (user management)
-- - secrets (configuration)
-- - audit_logs (compliance)
-- - data_validation_logs (quality)
-- - module_settings (configuration)