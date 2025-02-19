
export interface IntegratedData {
  date: string;
  actual_value: number;
  sku: string;
  // Product hierarchy levels
  l1_main_prod: string;
  l2_prod_line: string;
  l3_prod_category: string;
  l4_device_make: string;
  l5_prod_sub_category: string;
  l6_device_model: string;
  // Location hierarchy levels
  region: string;
  city: string;
  warehouse: string;
  channel: string;
}
