
export interface ForecastMappingConfig {
  id?: string;
  mapping_name: string;
  description?: string;
  use_product_mapping: boolean;
  use_location_mapping: boolean;
  product_key_column?: string;
  location_key_column?: string;
  historical_product_key_column?: string;
  historical_location_key_column?: string;
  historical_sales_mapping?: any;
  location_mapping?: any;
  product_mapping?: any;
  created_at?: string;
  created_by?: string;
  is_active?: boolean;
  selected_columns?: string[];
}

export interface IntegratedData {
  id?: string;
  date: string;
  actual_value: number;
  sku: string;
  created_at?: string;
  updated_at?: string;
  validation_status?: 'valid' | 'needs_review' | 'pending';
  source_files?: any[];
  metadata?: Record<string, any>;
  [key: string]: any; // Allow for dynamic fields from metadata
}
