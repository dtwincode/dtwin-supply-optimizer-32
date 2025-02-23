
export interface IntegratedData {
  id: string;
  date: string;
  sku: string;
  actual_value: number;
  validation_status: string | null;
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
