
-- This is a Supabase SQL function that handles the integration of forecast data
CREATE OR REPLACE FUNCTION public.integrate_forecast_data(p_mapping_config jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  historical_data jsonb;
  historical_file record;
  product_data jsonb;
  product_file record;
  location_data jsonb;
  location_file record;
  mapping_record record;
  selected_columns text[];
  product_key_column text;
  location_key_column text;
  historical_product_key_column text;
  historical_location_key_column text;
  use_product_mapping boolean;
  use_location_mapping boolean;
  mapping_id uuid;
  historical_row jsonb;
  v_row jsonb;
  v_date date;
  v_actual_value numeric;
  v_sku text;
  v_metadata jsonb;
  count_inserted integer := 0;
  column_name text;
BEGIN
  -- Get mapping ID from parameters
  mapping_id := (p_mapping_config->>'id')::uuid;
  
  -- Fetch the mapping record to get selected columns
  SELECT * INTO mapping_record 
  FROM forecast_integration_mappings 
  WHERE id = mapping_id;
  
  IF mapping_record IS NULL THEN
    RETURN 'Error: Mapping configuration not found';
  END IF;
  
  -- Get configuration parameters
  use_product_mapping := COALESCE((p_mapping_config->>'use_product_mapping')::boolean, false);
  use_location_mapping := COALESCE((p_mapping_config->>'use_location_mapping')::boolean, false);
  product_key_column := p_mapping_config->>'product_key_column';
  location_key_column := p_mapping_config->>'location_key_column';
  historical_product_key_column := p_mapping_config->>'historical_product_key_column';
  historical_location_key_column := p_mapping_config->>'historical_location_key_column';
  
  -- Get selected columns
  IF mapping_record.selected_columns_array IS NOT NULL THEN
    selected_columns := mapping_record.selected_columns_array;
  ELSIF mapping_record.columns_config IS NOT NULL THEN
    selected_columns := ARRAY(SELECT jsonb_array_elements_text(mapping_record.columns_config::jsonb));
  ELSE
    RETURN 'Error: No columns selected for integration';
  END IF;
  
  -- Get the most recent historical sales file
  SELECT * INTO historical_file 
  FROM permanent_hierarchy_files 
  WHERE hierarchy_type = 'historical_sales'
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF historical_file IS NULL THEN
    RETURN 'Error: No historical sales data found';
  END IF;
  
  historical_data := historical_file.data;
  
  -- If using product mapping, get product hierarchy
  IF use_product_mapping THEN
    SELECT * INTO product_file 
    FROM permanent_hierarchy_files 
    WHERE hierarchy_type = 'product_hierarchy'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF product_file IS NULL THEN
      RETURN 'Error: Product hierarchy required but not found';
    END IF;
    
    product_data := product_file.data;
  END IF;
  
  -- If using location mapping, get location hierarchy
  IF use_location_mapping THEN
    SELECT * INTO location_file 
    FROM permanent_hierarchy_files 
    WHERE hierarchy_type = 'location_hierarchy'
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF location_file IS NULL THEN
      RETURN 'Error: Location hierarchy required but not found';
    END IF;
    
    location_data := location_file.data;
  END IF;
  
  -- Clear existing integrated data
  DELETE FROM integrated_forecast_data;
  
  -- Process each row of historical data
  FOR historical_row IN SELECT * FROM jsonb_array_elements(historical_data)
  LOOP
    v_sku := historical_row->>historical_product_key_column;
    
    -- Skip rows without a product key if product mapping is enabled
    IF use_product_mapping AND (v_sku IS NULL OR v_sku = '') THEN
      CONTINUE;
    END IF;
    
    -- Try to parse date
    BEGIN
      v_date := (historical_row->>'date')::date;
    EXCEPTION WHEN OTHERS THEN
      CONTINUE; -- Skip rows with invalid dates
    END;
    
    -- Try to parse actual value
    BEGIN
      v_actual_value := (historical_row->>'actual_value')::numeric;
    EXCEPTION WHEN OTHERS THEN
      v_actual_value := NULL;
    END;
    
    -- Build metadata from selected columns
    v_metadata := '{}'::jsonb;
    FOREACH column_name IN ARRAY selected_columns
    LOOP
      IF historical_row ? column_name THEN
        v_metadata := v_metadata || jsonb_build_object(column_name, historical_row->column_name);
      END IF;
    END LOOP;
    
    -- Insert integrated data
    INSERT INTO integrated_forecast_data(
      date,
      sku,
      actual_value,
      metadata,
      source_files,
      validation_status,
      mapping_config
    )
    VALUES (
      v_date,
      v_sku,
      v_actual_value,
      v_metadata,
      jsonb_build_array(
        jsonb_build_object(
          'id', historical_file.id,
          'name', historical_file.original_name,
          'type', 'historical_sales'
        )
      ),
      'valid',
      jsonb_build_object(
        'mapping_id', mapping_id,
        'mapping_name', mapping_record.mapping_name,
        'product_mapping', use_product_mapping,
        'location_mapping', use_location_mapping
      )
    );
    
    count_inserted := count_inserted + 1;
  END LOOP;
  
  RETURN 'Successfully integrated ' || count_inserted || ' records';
END;
$$;
