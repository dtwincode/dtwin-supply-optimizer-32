
export interface IntegratedData {
  id: string;
  date: string;
  actual_value: number;
  sku: string;
  metadata: Record<string, any>;
  source_files: any[];
  validation_status: 'valid' | 'needs_review' | 'pending';
  created_at?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface ForecastMappingConfig {
  id: string;
  mapping_name: string;
  description?: string;
  use_product_mapping: boolean;
  use_location_mapping: boolean;
  product_key_column?: string;
  location_key_column?: string;
  historical_product_key_column?: string;
  historical_location_key_column?: string;
  selected_columns?: string[];
  selected_columns_array?: string[];
  columns_config?: string;
  is_active?: boolean;
  created_at?: string;
  created_by?: string;
  historical_key_column?: string;
  historical_sales_mapping?: any;
  location_hierarchy_mapping?: any;
  product_hierarchy_mapping?: any;
}
