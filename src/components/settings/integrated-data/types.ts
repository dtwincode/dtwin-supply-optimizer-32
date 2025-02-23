
export interface IntegratedData {
  id: string;
  date: string;
  sku: string;
  actual_value: number;
  validation_status: string | null;
  metadata?: Record<string, any>;
  source_files?: Array<{
    file_name: string;
    [key: string]: any;
  }>;
  created_at?: string;
  updated_at?: string;
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
  created_at?: string;
  is_active?: boolean;
}
