
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ControlBarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPan: (direction: 'left' | 'right') => void;
  onReset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
  canPanLeft: boolean;
  canPanRight: boolean;
  isZoomed: boolean;
}

export const ControlBar = ({
  onZoomIn,
  onZoomOut,
  onPan,
  onReset,
  canZoomIn,
  canZoomOut,
  canPanLeft,
  canPanRight,
  isZoomed,
}: ControlBarProps) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPan('left')}
        disabled={!canPanLeft}
        className="p-2"
      >
        <ChevronLeft className="h-4 w-4 pointer-events-none" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        className="p-2"
      >
        <ZoomIn className="h-4 w-4 pointer-events-none" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={!isZoomed}
        className="p-2"
      >
        <RotateCcw className="h-4 w-4 pointer-events-none" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        className="p-2"
      >
        <ZoomOut className="h-4 w-4 pointer-events-none" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPan('right')}
        disabled={!canPanRight}
        className="p-2"
      >
        <ChevronRight className="h-4 w-4 pointer-events-none" />
      </Button>
    </div>
  );
};
