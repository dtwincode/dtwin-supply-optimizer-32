
import { ForecastTable } from "@/components/forecasting/ForecastTable";
import { format, parseISO } from "date-fns";
import { type ForecastData } from "@/components/forecasting/table/types";

interface ForecastDistributionTabProps {
  forecastTableData: Array<{
    date: string;
    value: number;
    forecast: number;
    sku: string;
    category: string;
    subcategory: string;
    variance: number;
    id: string;
  }>;
}

export const ForecastDistributionTab = ({
  forecastTableData
}: ForecastDistributionTabProps) => {
  // Transform the data to include confidence bounds based on variance
  const enhancedData: ForecastData[] = forecastTableData.map((row) => {
    // Calculate confidence bounds using the variance
    const confidenceInterval = Math.sqrt(row.variance) * 1.96; // 95% confidence interval
    
    // Safely format the date with a fallback
    const formattedDate = row.date ? format(parseISO(row.date), 'MMM dd, yyyy') : 'No date';
    
    return {
      week: formattedDate,
      forecast: row.forecast,
      lower: Math.max(0, row.forecast - confidenceInterval),
      upper: row.forecast + confidenceInterval,
      sku: row.sku || 'N/A',
      category: row.category || 'N/A',
      subcategory: row.subcategory || 'N/A',
      id: row.id
    };
  });

  return <ForecastTable data={enhancedData} />;
};
