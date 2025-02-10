
export interface ForecastData {
  week: string;
  forecast: number;
  lower: number;
  upper: number;
}

export interface EditingCell {
  row: number;
  col: 'forecast' | 'lower' | 'upper';
}
