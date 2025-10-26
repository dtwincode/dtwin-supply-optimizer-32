-- Create table to store which models are enabled for evaluation
CREATE TABLE IF NOT EXISTS forecast_model_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN DEFAULT true,
  model_category TEXT NOT NULL, -- 'TRADITIONAL' or 'AI_POWERED'
  complexity TEXT NOT NULL, -- 'LOW', 'MEDIUM', 'HIGH'
  description TEXT,
  use_case TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE forecast_model_config ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access to forecast_model_config"
ON forecast_model_config
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert default model configurations
INSERT INTO forecast_model_config (model_name, model_category, complexity, description, use_case, is_enabled) VALUES
('SMA_7', 'TRADITIONAL', 'LOW', '7-period Simple Moving Average', 'Short-term stable demand', true),
('SMA_14', 'TRADITIONAL', 'LOW', '14-period Simple Moving Average', 'Medium-term stable demand', true),
('SMA_30', 'TRADITIONAL', 'LOW', '30-period Simple Moving Average', 'Long-term stable demand', true),
('WMA_7', 'TRADITIONAL', 'LOW', '7-period Weighted Moving Average', 'Recent-weighted short-term', true),
('WMA_14', 'TRADITIONAL', 'LOW', '14-period Weighted Moving Average', 'Recent-weighted medium-term', true),
('SES_0.1', 'TRADITIONAL', 'MEDIUM', 'Single Exponential Smoothing (α=0.1)', 'Slow-changing patterns', true),
('SES_0.3', 'TRADITIONAL', 'MEDIUM', 'Single Exponential Smoothing (α=0.3)', 'Moderate demand changes', true),
('SES_0.5', 'TRADITIONAL', 'MEDIUM', 'Single Exponential Smoothing (α=0.5)', 'Fast-changing patterns', true),
('DES', 'TRADITIONAL', 'MEDIUM', 'Double Exponential Smoothing (Holt)', 'Demand with linear trend', true),
('TES_7', 'TRADITIONAL', 'HIGH', 'Triple Exponential Smoothing (Holt-Winters)', 'Weekly seasonality patterns', true),
('LinearTrend', 'TRADITIONAL', 'LOW', 'Linear Regression Trend', 'Simple trending demand', true),
('Croston', 'TRADITIONAL', 'MEDIUM', 'Croston Method', 'Intermittent/sporadic demand', true),
('ARIMA', 'AI_POWERED', 'HIGH', 'AutoRegressive Integrated Moving Average', 'Complex patterns with autocorrelation', true),
('SARIMA', 'AI_POWERED', 'HIGH', 'Seasonal ARIMA (weekly)', 'Seasonal patterns with trend', true),
('Prophet', 'AI_POWERED', 'HIGH', 'Facebook Prophet', 'Multiple seasonality + holidays', true)
ON CONFLICT (model_name) DO NOTHING;

COMMENT ON TABLE forecast_model_config IS 'Configuration for which forecasting models are enabled for evaluation';