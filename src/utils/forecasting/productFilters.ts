
export interface ProductHierarchy {
  category: string;
  subcategory?: string;
  sku?: string;
}

export interface ForecastDataPoint {
  month: string;
  category: string;
  subcategory?: string;
  sku?: string;
  promotionalEvent?: boolean;
  weatherImpact?: number;
  marketEvents?: string[];
  stockLevels?: number;
  priceElasticity?: number;
}

export const filterByProductHierarchy = (
  data: ForecastDataPoint[],
  filters: ProductHierarchy
): ForecastDataPoint[] => {
  return data.filter(item => {
    const categoryMatch = !filters.category || item.category === filters.category;
    const subcategoryMatch = !filters.subcategory || item.subcategory === filters.subcategory;
    const skuMatch = !filters.sku || item.sku === filters.sku;
    return categoryMatch && subcategoryMatch && skuMatch;
  });
};

export const getUniqueValues = (data: ForecastDataPoint[], field: keyof ProductHierarchy): string[] => {
  const values = new Set(data.map(item => item[field]).filter(Boolean));
  return Array.from(values) as string[];
};
