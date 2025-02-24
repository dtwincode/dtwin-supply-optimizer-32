
import { Card } from "@/components/ui/card";
import { Link, RotateCcw, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { ForecastDataPoint } from "@/types/forecasting";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend
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
  const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 0]);
  const [zoomLevel, setZoomLevel] = useState(1);

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

  // Initialize visible range if not set
  if (visibleRange[1] === 0) {
    setVisibleRange([0, distribution.length]);
  }

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

  const handleZoomIn = () => {
    const currentRange = visibleRange[1] - visibleRange[0];
    const newRange = Math.max(Math.floor(currentRange / 2), 4);
    const center = Math.floor((visibleRange[0] + visibleRange[1]) / 2);
    const start = Math.max(0, center - Math.floor(newRange / 2));
    const end = Math.min(distribution.length, start + newRange);
    setVisibleRange([start, end]);
    setZoomLevel(zoomLevel * 2);
    onBrushChange?.({ startIndex: start, endIndex: end });
  };

  const handleZoomOut = () => {
    const currentRange = visibleRange[1] - visibleRange[0];
    const newRange = Math.min(currentRange * 2, distribution.length);
    const center = Math.floor((visibleRange[0] + visibleRange[1]) / 2);
    const start = Math.max(0, center - Math.floor(newRange / 2));
    const end = Math.min(distribution.length, start + newRange);
    setVisibleRange([start, end]);
    setZoomLevel(Math.max(1, zoomLevel / 2));
    onBrushChange?.({ startIndex: start, endIndex: end });
  };

  const handlePan = (direction: 'left' | 'right') => {
    const currentRange = visibleRange[1] - visibleRange[0];
    const shift = Math.max(1, Math.floor(currentRange / 4));
    
    if (direction === 'left') {
      const newStart = Math.max(0, visibleRange[0] - shift);
      setVisibleRange([newStart, newStart + currentRange]);
      onBrushChange?.({ startIndex: newStart, endIndex: newStart + currentRange });
    } else {
      const newStart = Math.min(distribution.length - currentRange, visibleRange[0] + shift);
      setVisibleRange([newStart, newStart + currentRange]);
      onBrushChange?.({ startIndex: newStart, endIndex: newStart + currentRange });
    }
  };

  const resetZoom = () => {
    setVisibleRange([0, distribution.length]);
    setZoomLevel(1);
    onBrushChange?.(null);
  };

  const visibleData = distribution.slice(visibleRange[0], visibleRange[1]);

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold">Error Distribution</h3>
            {syncId && (
              <Button
                variant="outline"
                size="sm"
                className={`gap-2 relative z-10 ${isSynced ? 'bg-primary/10 border-primary' : ''}`}
                onClick={() => setIsSynced(!isSynced)}
              >
                <Link className="h-4 w-4" />
                <span className="whitespace-nowrap">{isSynced ? 'Synced' : 'Not Synced'}</span>
              </Button>
            )}
          </div>
          <span className="text-sm text-muted-foreground px-3 py-1.5 bg-muted rounded-full">
            Forecast Error Analysis
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePan('left')}
            disabled={visibleRange[0] === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={visibleRange[1] - visibleRange[0] <= 4}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoom}
            disabled={zoomLevel === 1}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={visibleRange[1] - visibleRange[0] === distribution.length}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePan('right')}
            disabled={visibleRange[1] === distribution.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={visibleData}
              margin={{ top: 10, right: 30, left: 10, bottom: 60 }}
              syncId={isSynced ? syncId : undefined}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="range" 
                angle={-45} 
                textAnchor="end" 
                height={50}
                tick={{ fontSize: 12 }}
                interval={0}
                stroke="#6B7280"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickMargin={10}
                stroke="#6B7280"
                label={{ 
                  value: 'Number of Occurrences', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: 12 }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} />
              <Bar 
                dataKey="count" 
                fill="#6366F1" 
                name="Error Frequency"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {zoomLevel > 1 && (
          <div className="mt-4 p-4 bg-muted rounded-lg shadow-sm">
            <h4 className="text-sm font-medium mb-3">Selection Summary</h4>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Total Errors:</span>
                <span className="ml-2 font-medium">
                  {visibleData.reduce((sum, bin) => sum + bin.count, 0)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Average Error:</span>
                <span className="ml-2 font-medium">
                  {(visibleData
                    .reduce((sum, bin) => sum + (bin.errorRange[0] + bin.errorRange[1]) / 2 * bin.count, 0) /
                    visibleData
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
