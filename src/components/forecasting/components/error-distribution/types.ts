
import { ForecastDataPoint } from "@/types/forecasting";

export interface ErrorDistributionProps {
  data: ForecastDataPoint[];
  syncId?: string;
  onBrushChange?: (newIndex: { startIndex: number; endIndex: number } | null) => void;
}

export interface ErrorBin {
  range: string;
  count: number;
  errorRange: [number, number];
  errors: {
    error: number;
    week: string;
    actual: number | null;
    forecast: number | null;
  }[];
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}
