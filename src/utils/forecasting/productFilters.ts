
export interface ProductHierarchy {
  l1_main_prod: string;
  l2_prod_line?: string;
  l3_prod_category?: string;
  l4_device_make?: string;
  l5_prod_sub_category?: string;
  l6_device_model?: string;
  l7_device_color?: string;
  l8_device_storage?: string;
}

export interface ForecastDataPoint {
  week: string;
  actual: number | null;
  forecast: number;
  variance: number | null;
  region: string;
  city: string;
  channel: string;
  warehouse: string;
  sku: string;
  l1_main_prod: string;
  l2_prod_line: string;
  l3_prod_category: string;
  l4_device_make: string;
  l5_prod_sub_category: string;
  l6_device_model: string;
  l7_device_color: string;
  l8_device_storage: string;
}

export const filterByProductHierarchy = (
  data: ForecastDataPoint[],
  filters: Partial<ProductHierarchy>
): ForecastDataPoint[] => {
  return data.filter(item => {
    const l1Match = !filters.l1_main_prod || item.l1_main_prod === filters.l1_main_prod;
    const l2Match = !filters.l2_prod_line || item.l2_prod_line === filters.l2_prod_line;
    const l3Match = !filters.l3_prod_category || item.l3_prod_category === filters.l3_prod_category;
    const l4Match = !filters.l4_device_make || item.l4_device_make === filters.l4_device_make;
    const l5Match = !filters.l5_prod_sub_category || item.l5_prod_sub_category === filters.l5_prod_sub_category;
    const l6Match = !filters.l6_device_model || item.l6_device_model === filters.l6_device_model;
    const l7Match = !filters.l7_device_color || item.l7_device_color === filters.l7_device_color;
    const l8Match = !filters.l8_device_storage || item.l8_device_storage === filters.l8_device_storage;
    
    return l1Match && l2Match && l3Match && l4Match && l5Match && l6Match && l7Match && l8Match;
  });
};

export const getUniqueValues = (data: ForecastDataPoint[], field: keyof ProductHierarchy): string[] => {
  const values = new Set(data.map(item => item[field]).filter(Boolean));
  return Array.from(values) as string[];
};
