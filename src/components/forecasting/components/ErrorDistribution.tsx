
import { Card } from "@/components/ui/card";
import { Link, RotateCcw } from "lucide-react";
import { ForecastDataPoint } from "@/types/forecasting";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend, 
  Brush
} from "recharts";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ErrorDistributionProps {
  data: ForecastDataPoint[];
  syncId?: string;
  onBrushChange?: (newIndex: { startIndex: number; endIndex: number } | null) => void;
}

export const ErrorDistribution = ({ data, syncId, onBrushChange }: ErrorDistributionProps) => {
  const [isSynced, setIsSynced] = useState(true);
  const [selectedRange, setSelectedRange] = useState<[number, number] | null>(null);

  const handleBrushChange = (newIndex: { startIndex: number; endIndex: number } | null) => {
    setSelectedRange(newIndex ? [newIndex.startIndex, newIndex.endIndex] : null);
    onBrushChange?.(newIndex);
  };

  const resetZoom = () => {
    setSelectedRange(null);
    onBrushChange?.(null);
  };

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
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Error Distribution</h3>
            {syncId && (
              <Button
                variant="outline"
                size="sm"
                className={`gap-2 ${isSynced ? 'bg-primary/10' : ''}`}
                onClick={() => setIsSynced(!isSynced)}
              >
                <Link className="h-4 w-4" />
                {isSynced ? 'Synced' : 'Not Synced'}
              </Button>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            Forecast Error Analysis
          </span>
        </div>

        {selectedRange && (
          <div className="flex items-center justify-between bg-muted/50 p-2 rounded-lg text-sm">
            <span className="font-medium">
              Selected Range: {distribution[selectedRange[0]]?.range} - {distribution[selectedRange[1]]?.range}
            </span>
            <Button variant="ghost" size="sm" onClick={resetZoom} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset Zoom
            </Button>
          </div>
        )}

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={distribution}
              margin={{ top: 10, right: 30, left: 10, bottom: 50 }}
              syncId={isSynced ? syncId : undefined}
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
                onChange={handleBrushChange}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {selectedRange && (
          <div className="mt-2 p-3 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Selection Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Errors:</span>
                <span className="ml-2 font-medium">
                  {distribution
                    .slice(selectedRange[0], selectedRange[1] + 1)
                    .reduce((sum, bin) => sum + bin.count, 0)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Average Error:</span>
                <span className="ml-2 font-medium">
                  {(distribution
                    .slice(selectedRange[0], selectedRange[1] + 1)
                    .reduce((sum, bin) => sum + (bin.errorRange[0] + bin.errorRange[1]) / 2 * bin.count, 0) /
                    distribution
                      .slice(selectedRange[0], selectedRange[1] + 1)
                      .reduce((sum, bin) => sum + bin.count, 0))
                    .toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
