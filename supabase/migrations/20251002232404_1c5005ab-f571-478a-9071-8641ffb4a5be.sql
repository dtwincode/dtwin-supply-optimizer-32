-- Add business logic thresholds to inventory_config
INSERT INTO public.inventory_config (config_key, config_value, description, category) VALUES
-- Service Level & Health Thresholds
('service_level_good_threshold', 95, 'Service level percentage threshold for "good" status', 'kpi_thresholds'),
('service_level_warning_threshold', 90, 'Service level percentage threshold for "warning" status', 'kpi_thresholds'),
('inventory_health_good_threshold', 70, 'Inventory health percentage threshold for "good" status', 'kpi_thresholds'),
('inventory_health_warning_threshold', 50, 'Inventory health percentage threshold for "warning" status', 'kpi_thresholds'),
('critical_items_warning_threshold', 5, 'Number of critical items threshold for "warning" status', 'kpi_thresholds'),
('fill_rate_good_threshold', 90, 'Fill rate percentage threshold for "good" status', 'kpi_thresholds'),
('fill_rate_warning_threshold', 80, 'Fill rate percentage threshold for "warning" status', 'kpi_thresholds'),
('turnover_good_threshold', 4, 'Inventory turnover threshold for "good" status (turns per year)', 'kpi_thresholds'),
('turnover_warning_threshold', 2, 'Inventory turnover threshold for "warning" status (turns per year)', 'kpi_thresholds'),

-- Lead Time & Variability Classification
('lead_time_long_threshold', 30, 'Lead time days threshold for "long" classification', 'classification'),
('lead_time_medium_threshold', 15, 'Lead time days threshold for "medium" classification', 'classification'),
('demand_variability_high_threshold', 0.6, 'Coefficient of variation threshold for "high" variability', 'classification'),
('demand_variability_medium_threshold', 0.3, 'Coefficient of variation threshold for "medium" variability', 'classification'),

-- Scoring & Strategy Thresholds
('decoupling_score_pull_threshold', 70, 'Score threshold for PULL strategy recommendation', 'scoring'),
('decoupling_score_hybrid_threshold', 40, 'Score threshold for HYBRID strategy recommendation (below this is PUSH)', 'scoring'),

-- Exception Detection Thresholds
('stockout_risk_days_threshold', 7, 'Days of supply threshold for stockout risk detection', 'exceptions'),
('slow_mover_days_threshold', 30, 'On-hand days threshold for slow mover detection', 'exceptions'),
('slow_mover_adu_threshold', 1, 'Average daily usage threshold for slow mover detection', 'exceptions'),
('excess_stock_penetration_threshold', 80, 'Buffer penetration percentage threshold for excess stock detection', 'exceptions'),

-- Calculation Constants
('demand_simulation_weeks', 12, 'Number of weeks to simulate in demand forecast charts', 'calculations'),
('demand_simulation_base', 500, 'Base value for demand simulation', 'calculations'),
('demand_simulation_range', 1000, 'Range value for demand simulation', 'calculations'),
('inventory_value_multiplier', 100, 'Multiplier for inventory value calculation', 'calculations')
ON CONFLICT (config_key) DO UPDATE SET 
  config_value = EXCLUDED.config_value,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  updated_at = now();