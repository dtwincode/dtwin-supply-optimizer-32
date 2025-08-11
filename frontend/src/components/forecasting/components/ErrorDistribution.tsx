
import { Card } from "@/components/ui/card";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ErrorDistributionProps } from "./error-distribution/types";
import { calculateErrorDistribution } from "./error-distribution/utils";
import { ControlBar } from "./error-distribution/ControlBar";
import { ErrorDistributionChart } from "./error-distribution/ErrorDistributionChart";
import { SelectionSummary } from "./error-distribution/SelectionSummary";

export const ErrorDistribution = ({ data, syncId, onBrushChange }: ErrorDistributionProps) => {
  const [isSynced, setIsSynced] = useState(true);
  const [visibleRange, setVisibleRange] = useState<[number, number]>([0, 0]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [distribution, setDistribution] = useState<any[]>([]);

  useEffect(() => {
    const calculatedDistribution = calculateErrorDistribution(data);
    setDistribution(calculatedDistribution);
    setVisibleRange([0, calculatedDistribution.length]);
    setZoomLevel(1);
  }, [data]);

  const handleZoomIn = () => {
    const currentRange = visibleRange[1] - visibleRange[0];
    if (currentRange <= 4) return;

    // Calculate the center point of the current visible range
    const center = visibleRange[0] + Math.floor(currentRange / 2);
    // Calculate the new range size (half of current, but minimum of 4)
    const newRangeSize = Math.max(Math.floor(currentRange / 2), 4);
    // Calculate new start and end points, centered around the current center
    const halfRange = Math.floor(newRangeSize / 2);
    const start = Math.max(0, center - halfRange);
    const end = Math.min(distribution.length, center + halfRange);

    console.log('Zoom In:', { center, newRangeSize, start, end, currentRange });
    
    setVisibleRange([start, end]);
    setZoomLevel(prev => prev * 2);
    onBrushChange?.({ startIndex: start, endIndex: end });
  };

  const handleZoomOut = () => {
    const currentRange = visibleRange[1] - visibleRange[0];
    if (currentRange >= distribution.length) return;

    // Calculate the center point of the current visible range
    const center = visibleRange[0] + Math.floor(currentRange / 2);
    // Calculate the new range size (double current, but max of distribution length)
    const newRangeSize = Math.min(currentRange * 2, distribution.length);
    // Calculate new start and end points, centered around the current center
    const halfRange = Math.floor(newRangeSize / 2);
    const start = Math.max(0, center - halfRange);
    const end = Math.min(distribution.length, center + halfRange);

    console.log('Zoom Out:', { center, newRangeSize, start, end, currentRange });
    
    setVisibleRange([start, end]);
    setZoomLevel(prev => Math.max(1, prev / 2));
    onBrushChange?.({ startIndex: start, endIndex: end });
  };

  const handlePan = (direction: 'left' | 'right') => {
    const currentRange = visibleRange[1] - visibleRange[0];
    const shift = Math.max(1, Math.floor(currentRange / 4));
    let newStart, newEnd;

    if (direction === 'left' && visibleRange[0] > 0) {
      newStart = Math.max(0, visibleRange[0] - shift);
      newEnd = Math.min(distribution.length, newStart + currentRange);
    } else if (direction === 'right' && visibleRange[1] < distribution.length) {
      newEnd = Math.min(distribution.length, visibleRange[1] + shift);
      newStart = Math.max(0, newEnd - currentRange);
    } else {
      return;
    }

    console.log('Pan:', { direction, newStart, newEnd, shift, currentRange });
    
    setVisibleRange([newStart, newEnd]);
    onBrushChange?.({ startIndex: newStart, endIndex: newEnd });
  };

  const resetZoom = () => {
    console.log('Reset Zoom');
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

        <ControlBar
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onPan={handlePan}
          onReset={resetZoom}
          canZoomIn={visibleRange[1] - visibleRange[0] > 4}
          canZoomOut={visibleRange[1] - visibleRange[0] < distribution.length}
          canPanLeft={visibleRange[0] > 0}
          canPanRight={visibleRange[1] < distribution.length}
          isZoomed={zoomLevel > 1}
        />

        <ErrorDistributionChart
          data={visibleData}
          syncId={isSynced ? syncId : undefined}
        />

        {zoomLevel > 1 && <SelectionSummary visibleData={visibleData} />}
      </div>
    </Card>
  );
};
