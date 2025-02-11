
export interface ForecastData {
  week: string;
  forecast: number;
  lower: number;
  upper: number;
  sku: string;
  category: string;
  subcategory: string;
}

export interface EditingCell {
  row: number;
  col: 'forecast' | 'lower' | 'upper';
}
