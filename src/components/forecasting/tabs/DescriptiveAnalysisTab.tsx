
import { Card } from "@/components/ui/card";
import { ForecastDataPoint } from "@/types/forecasting";
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, Tooltip, CartesianGrid, Scatter } from "recharts";
import { BoxPlot, BoxPlotDatum } from "@nivo/boxplot";

interface DescriptiveAnalysisTabProps {
  filteredData?: ForecastDataPoint[];
}

export const DescriptiveAnalysisTab = ({ filteredData = [] }: DescriptiveAnalysisTabProps) => {
  // Transform data for scatter plot (actual vs forecast)
  const scatterData = filteredData.map(d => ({
    actual: d.actual ?? 0,
    forecast: d.forecast ?? 0,
  }));

  // Transform data for box plot with the correct BoxPlotDatum structure
  const prepareBoxPlotData = (values: number[]): BoxPlotDatum => {
    if (values.length === 0) return {
      group: '',
      min: 0,
      max: 0,
      median: 0,
      quantile1: 0,
      quantile3: 0,
      whiskerLow: 0,
      whiskerHigh: 0,
    };

    const sorted = [...values].sort((a, b) => a - b);
    const len = sorted.length;
    const median = len % 2 === 0
      ? (sorted[len / 2 - 1] + sorted[len / 2]) / 2
      : sorted[Math.floor(len / 2)];
    
    const q1Index = Math.floor(len * 0.25);
    const q3Index = Math.floor(len * 0.75);
    
    return {
      min: sorted[0],
      max: sorted[len - 1],
      median,
      quantile1: sorted[q1Index],
      quantile3: sorted[q3Index],
      whiskerLow: sorted[0],
      whiskerHigh: sorted[len - 1],
    };
  };

  const actualValues = filteredData.map(d => d.actual).filter((val): val is number => val !== null);
  const forecastValues = filteredData.map(d => d.forecast).filter(Boolean);

  const boxPlotData = [
    {
      group: 'Actual',
      ...prepareBoxPlotData(actualValues)
    },
    {
      group: 'Forecast',
      ...prepareBoxPlotData(forecastValues)
    }
  ];

  // Calculate statistics for actual values
  const actualMean = actualValues.length > 0
    ? actualValues.reduce((a, b) => a + b, 0) / actualValues.length
    : 0;
  const actualStdDev = actualValues.length > 0
    ? Math.sqrt(actualValues.reduce((a, b) => a + Math.pow(b - actualMean, 2), 0) / actualValues.length)
    : 0;

  // Calculate statistics for forecast values
  const forecastMean = forecastValues.length > 0
    ? forecastValues.reduce((a, b) => a + b, 0) / forecastValues.length
    : 0;
  const forecastStdDev = forecastValues.length > 0
    ? Math.sqrt(forecastValues.reduce((a, b) => a + Math.pow(b - forecastMean, 2), 0) / forecastValues.length)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Actual vs Forecast Scatter Plot</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid />
                <XAxis type="number" dataKey="actual" name="Actual" />
                <YAxis type="number" dataKey="forecast" name="Forecast" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name="Values" 
                  data={scatterData} 
                  fill="#8884d8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Distribution Box Plot</h3>
          <div className="h-[400px]">
            <BoxPlot
              data={boxPlotData}
              margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
              padding={0.15}
              minValue={0}
              maxValue={Math.max(...[...actualValues, ...forecastValues], 0)}
              layout="vertical"
              valueFormat={(value) => typeof value === 'number' ? value.toFixed(2) : '0'}
            />
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Mean Actual</p>
            <p className="text-lg font-semibold">{actualMean.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Mean Forecast</p>
            <p className="text-lg font-semibold">{forecastMean.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Std Dev Actual</p>
            <p className="text-lg font-semibold">{actualStdDev.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Std Dev Forecast</p>
            <p className="text-lg font-semibold">{forecastStdDev.toFixed(2)}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
