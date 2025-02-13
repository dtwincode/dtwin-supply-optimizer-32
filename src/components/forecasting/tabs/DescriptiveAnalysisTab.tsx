
import { Card } from "@/components/ui/card";
import { ForecastDataPoint } from "@/types/forecasting";
import { ResponsiveContainer, ScatterPlot, XAxis, YAxis, Tooltip, CartesianGrid, Scatter } from "recharts";
import { BoxPlot, ResponsiveBoxPlot } from "@nivo/boxplot";

interface DescriptiveAnalysisTabProps {
  filteredData?: ForecastDataPoint[];
}

export const DescriptiveAnalysisTab = ({ filteredData = [] }: DescriptiveAnalysisTabProps) => {
  // Transform data for scatter plot (actual vs forecast)
  const scatterData = filteredData.map(d => ({
    actual: d.actual,
    forecast: d.forecast,
  }));

  // Transform data for box plot
  const boxPlotData = {
    actual: filteredData.map(d => d.actual).filter(Boolean) as number[],
    forecast: filteredData.map(d => d.forecast).filter(Boolean) as number[],
  };

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
            <ResponsiveContainer width="100%" height="100%">
              <BoxPlot
                data={[
                  {
                    group: 'Actual',
                    values: boxPlotData.actual
                  },
                  {
                    group: 'Forecast',
                    values: boxPlotData.forecast
                  }
                ]}
                margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                padding={0.15}
              />
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Mean Actual</p>
            <p className="text-lg font-semibold">
              {(boxPlotData.actual.reduce((a, b) => a + b, 0) / boxPlotData.actual.length).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Mean Forecast</p>
            <p className="text-lg font-semibold">
              {(boxPlotData.forecast.reduce((a, b) => a + b, 0) / boxPlotData.forecast.length).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Std Dev Actual</p>
            <p className="text-lg font-semibold">
              {Math.sqrt(
                boxPlotData.actual.reduce((a, b) => a + Math.pow(b - boxPlotData.actual.reduce((a, b) => a + b, 0) / boxPlotData.actual.length, 2), 0) / 
                boxPlotData.actual.length
              ).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-secondary/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Std Dev Forecast</p>
            <p className="text-lg font-semibold">
              {Math.sqrt(
                boxPlotData.forecast.reduce((a, b) => a + Math.pow(b - boxPlotData.forecast.reduce((a, b) => a + b, 0) / boxPlotData.forecast.length, 2), 0) / 
                boxPlotData.forecast.length
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
