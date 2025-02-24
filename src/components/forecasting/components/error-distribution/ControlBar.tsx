
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
  const handleClick = (handler: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handler();
  };

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick(() => onPan('left'))}
        disabled={!canPanLeft}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick(onZoomIn)}
        disabled={!canZoomIn}
        className="h-8 w-8"
      >
        <ZoomIn className="h-4 w-4" strokeWidth={2.5} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick(onReset)}
        disabled={!isZoomed}
        className="h-8 w-8"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={2.5} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick(onZoomOut)}
        disabled={!canZoomOut}
        className="h-8 w-8"
      >
        <ZoomOut className="h-4 w-4" strokeWidth={2.5} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick(() => onPan('right'))}
        disabled={!canPanRight}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
      </Button>
    </div>
  );
};
