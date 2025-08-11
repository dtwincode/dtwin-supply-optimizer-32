
insert into module_settings (module, settings) 
values (
  'forecasting',
  jsonb_build_object(
    'documentation', jsonb_build_object(
      'overview', 'The Forecasting Module helps predict future demand based on historical data and various external factors.',
      'sections', jsonb_build_array(
        jsonb_build_object(
          'title', 'Getting Started',
          'content', 'To begin using the forecasting module:
1. Upload your historical data using the Data Upload button
2. Select your preferred forecasting model from the dropdown
3. Configure the date range for your forecast
4. Apply filters to focus on specific regions, products, or channels'
        ),
        jsonb_build_object(
          'title', 'Available Models',
          'content', '- Moving Average: Best for stable demand patterns
- Exponential Smoothing: Handles trends and seasonality
- ARIMA: Advanced statistical forecasting
- Machine Learning (LSTM): For complex patterns with multiple variables'
        ),
        jsonb_build_object(
          'title', 'Key Features',
          'content', '- Automatic model selection with "Find Best Model"
- Confidence intervals visualization
- What-if scenario analysis
- External factors integration (weather, market events)
- Price elasticity analysis
- Model version control'
        ),
        jsonb_build_object(
          'title', 'Data Requirements',
          'content', 'Required columns for forecast data:
- Date/Week
- Actual values
- Region
- City
- Channel
- Category
- SKU'
        ),
        jsonb_build_object(
          'title', 'Best Practices',
          'content', '1. Regularly update historical data
2. Review and adjust outliers
3. Consider seasonal patterns
4. Document market events
5. Validate forecasts against actuals
6. Use appropriate time horizons for different products'
        ),
        jsonb_build_object(
          'title', 'Analysis Tools',
          'content', '- Pattern Analysis: Decompose time series
- Forecast Validation: Statistical tests
- Cross Validation: Model accuracy
- External Factors: Weather and events impact
- Price Analysis: Demand elasticity'
        ),
        jsonb_build_object(
          'title', 'Exporting Results',
          'content', 'Export options available:
- CSV format with all forecast details
- Charts and visualizations
- Model performance metrics
- Scenario comparisons'
        )
      )
    )
  )
) 
on conflict (module) 
do update set 
  settings = module_settings.settings || excluded.settings,
  updated_at = now();
