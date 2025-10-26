-- Create table to store forecasting model selections and performance
CREATE TABLE IF NOT EXISTS forecast_model_selection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  model_name TEXT NOT NULL,
  mae NUMERIC,
  rmse NUMERIC,
  mape NUMERIC,
  smape NUMERIC,
  aic NUMERIC,
  training_samples INTEGER,
  last_evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_best_model BOOLEAN DEFAULT false,
  model_params JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, location_id, model_name)
);

-- Create index for fast lookup of best models
CREATE INDEX idx_forecast_best_model ON forecast_model_selection(product_id, location_id, is_best_model) WHERE is_best_model = true;

-- Enable RLS
ALTER TABLE forecast_model_selection ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Allow authenticated full access to forecast_model_selection"
ON forecast_model_selection
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

COMMENT ON TABLE forecast_model_selection IS 'Stores the best-fit forecasting model for each product-location pair with performance metrics';
COMMENT ON COLUMN forecast_model_selection.model_name IS 'Name of the time series model: SMA, WMA, ES, DES, TES, ARIMA, SARIMA, Prophet, LinearTrend, Croston';
COMMENT ON COLUMN forecast_model_selection.mae IS 'Mean Absolute Error';
COMMENT ON COLUMN forecast_model_selection.rmse IS 'Root Mean Squared Error';
COMMENT ON COLUMN forecast_model_selection.mape IS 'Mean Absolute Percentage Error';
COMMENT ON COLUMN forecast_model_selection.smape IS 'Symmetric Mean Absolute Percentage Error';
COMMENT ON COLUMN forecast_model_selection.aic IS 'Akaike Information Criterion';
COMMENT ON COLUMN forecast_model_selection.model_params IS 'JSON object storing model-specific parameters like alpha, beta, gamma, periods, etc.';