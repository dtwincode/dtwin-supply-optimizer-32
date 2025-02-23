
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
