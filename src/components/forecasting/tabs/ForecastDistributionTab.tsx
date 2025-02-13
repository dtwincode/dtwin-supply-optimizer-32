
import { Card } from "@/components/ui/card";
import { ForecastChart } from "@/components/forecasting/ForecastChart";
import { ForecastTable } from "@/components/forecasting/ForecastTable";
import { format, parseISO, addWeeks } from "date-fns";
import { useState } from "react";
import { ModelSelectionCard } from "@/components/forecasting/ModelSelectionCard";

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
  const [selectedModel, setSelectedModel] = useState<string>("moving-avg");
  
  const handleModelParametersChange = (modelId: string, parameters: any[]) => {
    console.log('Model parameters updated:', modelId, parameters);
  };

  // Transform the data to include future forecasts
  const currentDate = new Date();
  const futureWeeks = 12; // Number of weeks to forecast ahead

  const enhancedData = forecastTableData.map((row) => {
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
      week: row.date || '',
      forecast: forecast,
      actual: row.value,
      variance: row.variance,
      lower: Math.max(0, forecast - confidenceInterval),
      upper: forecast + confidenceInterval,
      sku: row.sku || 'N/A',
      category: row.category || 'N/A',
      subcategory: row.subcategory || 'N/A',
      id: row.id
    };
  });

  // Generate future forecast data points
  const futureDates = Array.from({ length: futureWeeks }, (_, i) => {
    const lastDataPoint = enhancedData[enhancedData.length - 1];
    const lastDate = lastDataPoint?.week ? parseISO(lastDataPoint.week) : currentDate;
    const newDate = addWeeks(lastDate, i + 1);
    
    // Add some randomness to the forecast for demonstration
    const baseForecast = lastDataPoint?.forecast || 100;
    const randomVariation = (Math.random() - 0.5) * 0.2; // ±10% variation
    const newForecast = baseForecast * (1 + randomVariation);
    const variance = (lastDataPoint?.variance || 10) * (1 + Math.random() * 0.2);

    return {
      week: format(newDate, 'yyyy-MM-dd'),
      forecast: newForecast,
      actual: null,
      variance: variance,
      lower: Math.max(0, newForecast - Math.sqrt(variance) * 1.96),
      upper: newForecast + Math.sqrt(variance) * 1.96,
      sku: lastDataPoint?.sku || 'N/A',
      category: lastDataPoint?.category || 'N/A',
      subcategory: lastDataPoint?.subcategory || 'N/A',
      id: `future-${i}`
    };
  });

  const allData = [...enhancedData, ...futureDates];
  const confidenceIntervals = allData.map(d => ({
    upper: d.upper,
    lower: d.lower
  }));

  // Only render if we have data
  if (!forecastTableData || forecastTableData.length === 0) {
    return <div className="p-4 text-muted-foreground">No forecast data available</div>;
  }

  return (
    <div className="space-y-8">
      {/* Model Selection Section */}
      <Card className="p-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Step 1: Select Model</h3>
          <p className="text-muted-foreground">
            Choose and configure your forecasting model
          </p>
        </div>
        <div className="mt-6">
          <ModelSelectionCard
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            onParametersChange={handleModelParametersChange}
          />
        </div>
      </Card>

      {/* Forecast Chart Section */}
      <Card className="p-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Step 2: Future Forecast Visualization</h3>
          <p className="text-muted-foreground">
            Historical data and future forecast predictions with confidence intervals
          </p>
        </div>
        <div className="h-[400px] w-full overflow-hidden mt-6">
          <ForecastChart
            data={allData}
            confidenceIntervals={confidenceIntervals}
          />
        </div>
      </Card>

      {/* Forecast Table Section */}
      <Card className="p-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Step 3: Forecast Distribution Details</h3>
          <p className="text-muted-foreground">
            Detailed view of forecast values and confidence intervals
          </p>
        </div>
        <div className="mt-6">
          <ForecastTable data={allData.map(d => ({
            week: format(parseISO(d.week), 'MMM dd, yyyy'),
            forecast: Math.round(d.forecast),
            lower: Math.round(d.lower),
            upper: Math.round(d.upper),
            sku: d.sku,
            category: d.category,
            subcategory: d.subcategory,
            id: d.id
          }))} />
        </div>
      </Card>
    </div>
  );
};
