
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
  batch_size integer := 500;
  total_rows integer := 0;
  column_name text;
  batch_rows jsonb[];
  i integer;
  transaction_started boolean := false;
  max_batch_size integer := 1000; -- Increased batch size for better performance
  rows_to_process integer;
  processing_limit integer := 100000; -- Limit the total number of rows to process for large datasets
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
  
  -- Clear existing integrated data within a transaction for better performance
  BEGIN
    transaction_started := true;
    DELETE FROM integrated_forecast_data;
    
    -- Count total rows for progress reporting
    total_rows := jsonb_array_length(historical_data);
    
    -- Limit number of rows to process for very large datasets
    rows_to_process := LEAST(total_rows, processing_limit);
    
    -- Initialize empty batch array
    batch_rows := ARRAY[]::jsonb[];
    i := 0;
    
    -- Process each row of historical data
    FOR historical_row IN 
    SELECT * FROM jsonb_array_elements(historical_data)
    LIMIT rows_to_process -- Apply limit for very large datasets
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
      
      -- Add row to batch
      batch_rows := array_append(batch_rows, jsonb_build_object(
        'date', v_date,
        'sku', v_sku,
        'actual_value', v_actual_value,
        'metadata', v_metadata,
        'source_files', jsonb_build_array(
          jsonb_build_object(
            'id', historical_file.id,
            'name', historical_file.original_name,
            'type', 'historical_sales'
          )
        ),
        'validation_status', 'valid',
        'mapping_config', jsonb_build_object(
          'mapping_id', mapping_id,
          'mapping_name', mapping_record.mapping_name,
          'product_mapping', use_product_mapping,
          'location_mapping', use_location_mapping
        )
      ));
      
      i := i + 1;
      
      -- Process batch when it reaches the batch size
      IF i >= max_batch_size THEN
        -- Insert batch
        INSERT INTO integrated_forecast_data(
          date,
          sku,
          actual_value,
          metadata,
          source_files,
          validation_status,
          mapping_config
        )
        SELECT 
          (row_data->>'date')::date,
          row_data->>'sku',
          (row_data->>'actual_value')::numeric,
          row_data->'metadata',
          row_data->'source_files',
          row_data->>'validation_status',
          row_data->'mapping_config'
        FROM unnest(batch_rows) AS row_data;
        
        count_inserted := count_inserted + i;
        
        -- Reset batch
        batch_rows := ARRAY[]::jsonb[];
        i := 0;
        
        -- Commit the current transaction batch and start a new one to prevent long-running transactions
        COMMIT;
        
        -- Sleep briefly to allow other transactions to proceed
        PERFORM pg_sleep(0.01);
        
        -- Start a new transaction
        BEGIN;
      END IF;
    END LOOP;
    
    -- Insert any remaining rows in the batch
    IF i > 0 THEN
      INSERT INTO integrated_forecast_data(
        date,
        sku,
        actual_value,
        metadata,
        source_files,
        validation_status,
        mapping_config
      )
      SELECT 
        (row_data->>'date')::date,
        row_data->>'sku',
        (row_data->>'actual_value')::numeric,
        row_data->'metadata',
        row_data->'source_files',
        row_data->>'validation_status',
        row_data->'mapping_config'
      FROM unnest(batch_rows) AS row_data;
      
      count_inserted := count_inserted + i;
    END IF;
    
    -- Final commit
    COMMIT;
    transaction_started := false;
    
    -- Add an index on the date and sku fields for faster filtering
    IF NOT EXISTS (
      SELECT 1 
      FROM pg_indexes 
      WHERE tablename = 'integrated_forecast_data' 
      AND indexname = 'idx_integrated_forecast_data_date_sku'
    ) THEN
      CREATE INDEX idx_integrated_forecast_data_date_sku 
      ON integrated_forecast_data(date, sku);
    END IF;
    
  EXCEPTION WHEN OTHERS THEN
    -- Rollback on error
    IF transaction_started THEN
      ROLLBACK;
    END IF;
    RAISE;
  END;
  
  RETURN 'Successfully integrated ' || count_inserted || ' records';
END;
$$;
