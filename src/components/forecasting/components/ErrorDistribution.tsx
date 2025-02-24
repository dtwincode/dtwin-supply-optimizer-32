
import { Card } from "@/components/ui/card";
import { ForecastDataPoint } from "@/types/forecasting";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Brush } from "recharts";

interface ErrorDistributionProps {
  data: ForecastDataPoint[];
  syncId?: string;
  onBrushChange?: (domain: [number, number]) => void;
}

export const ErrorDistribution = ({ data, syncId, onBrushChange }: ErrorDistributionProps) => {
  const calculateErrorDistribution = () => {
    const errors = data
      .filter(d => d.actual !== null && d.forecast !== null)
      .map(d => ({
        error: ((d.actual! - d.forecast!) / d.actual!) * 100,
        week: d.week,
        actual: d.actual,
        forecast: d.forecast
      }));

    const binSize = 5;
    const bins: { range: string; count: number; errorRange: [number, number]; errors: typeof errors }[] = [];
    
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

  const distribution = calculateErrorDistribution();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const binData = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">Error Range: {label}</p>
          <p className="text-sm">Count: {binData.count}</p>
          <p className="text-sm text-muted-foreground">
            Average Error: {
              (binData.errors.reduce((sum: number, e: any) => sum + e.error, 0) / binData.count).toFixed(2)
            }%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Error Distribution</h3>
          <span className="text-sm text-muted-foreground">
            Forecast Error Analysis
          </span>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={distribution}
              margin={{ top: 10, right: 30, left: 10, bottom: 50 }}
              syncId={syncId}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="range" 
                angle={-45} 
                textAnchor="end" 
                height={80}
                tick={{ fontSize: 12 }}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                label={{ 
                  value: 'Number of Occurrences', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#6366F1" 
                name="Error Frequency"
                radius={[4, 4, 0, 0]}
              />
              <Brush 
                dataKey="range"
                height={30}
                stroke="#8884d8"
                onChange={onBrushChange}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};
