
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
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomIn}
        disabled={!canZoomIn}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        disabled={!isZoomed}
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onZoomOut}
        disabled={!canZoomOut}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPan('right')}
        disabled={!canPanRight}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
