
import { ForecastDataPoint } from "@/types/forecasting";
import { ErrorBin } from "./types";

export const calculateErrorDistribution = (data: ForecastDataPoint[]): ErrorBin[] => {
  const errors = data
    .filter(d => d.actual !== null && d.forecast !== null)
    .map(d => ({
      error: ((d.actual! - d.forecast!) / d.actual!) * 100,
      week: d.week,
      actual: d.actual,
      forecast: d.forecast
    }));

  const binSize = 5;
  const bins: ErrorBin[] = [];
  
  const minError = Math.floor(Math.min(...errors.map(e => e.error)) / binSize) * binSize;
  const maxError = Math.ceil(Math.max(...errors.map(e => e.error)) / binSize) * binSize;

  for (let i = minError; i <= maxError; i += binSize) {
    const binErrors = errors.filter(e => e.error >= i && e.error < i + binSize);
    bins.push({
      range: `${i.toFixed(0)}% to ${(i + binSize).toFixed(0)}%`,
      count: binErrors.length,
      errorRange: [i, i + binSize],
      errors: binErrors
    });
  }

  return bins;
};
