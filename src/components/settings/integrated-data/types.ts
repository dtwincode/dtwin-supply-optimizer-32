
export interface IntegratedData {
  id: string;
  date: string;
  actual_value: number;
  sku: string;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  validation_status?: string;
  source_files?: any[];
  mapping_config?: Record<string, any>;
}

export interface ForecastMappingConfig {
  id: string;
  mapping_name: string;
  description?: string;
  historical_sales_mapping: Record<string, any>;
  product_hierarchy_mapping: Record<string, any>;
  location_hierarchy_mapping: Record<string, any>;
  historical_product_key_column?: string;
  historical_location_key_column?: string;
  product_key_column?: string;
  location_key_column?: string;
  use_product_mapping: boolean;
  use_location_mapping: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
