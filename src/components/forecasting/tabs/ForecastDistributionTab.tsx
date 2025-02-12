
import { ForecastTable } from "@/components/forecasting/ForecastTable";
import { format, parseISO } from "date-fns";
import { type ForecastData } from "@/components/forecasting/table/types";

interface ForecastDistributionTabProps {
  forecastTableData: Array<{
    date: string | null;
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
    const confidenceInterval = Math.sqrt(row.variance || 0) * 1.96; // 95% confidence interval
    const forecast = row.forecast || 0;
    
    // Safely format the date with a fallback
    let formattedDate = 'No date';
    try {
      if (row.date) {
        formattedDate = format(parseISO(row.date), 'MMM dd, yyyy');
      }
    } catch (error) {
      console.error('Error parsing date:', row.date, error);
    }
    
    return {
      week: formattedDate,
      forecast: forecast,
      lower: Math.max(0, forecast - confidenceInterval),
      upper: forecast + confidenceInterval,
      sku: row.sku || 'N/A',
      category: row.category || 'N/A',
      subcategory: row.subcategory || 'N/A',
      id: row.id
    };
  });

  // Only render if we have data
  if (!forecastTableData || forecastTableData.length === 0) {
    return <div className="p-4 text-muted-foreground">No forecast data available</div>;
  }

  return <ForecastTable data={enhancedData} />;
};
