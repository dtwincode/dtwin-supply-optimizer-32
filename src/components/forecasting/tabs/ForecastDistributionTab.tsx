
import { ForecastTable } from "@/components/forecasting/ForecastTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { format, parseISO } from "date-fns";
import { type ForecastData } from "@/components/forecasting/table/types";

interface ForecastContextType {
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

export const ForecastDistributionTab = () => {
  const navigate = useNavigate();
  const { forecastTableData } = useOutletContext<ForecastContextType>();
  
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/forecasting")}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Forecasting
        </Button>
      </div>
      
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Forecast Distribution</h2>
        <ForecastTable data={enhancedData} />
      </Card>
    </div>
  );
};
