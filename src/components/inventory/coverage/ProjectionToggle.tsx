import { Button } from "@/components/ui/button";
import { BarChart3, Table } from "lucide-react";

type HorizonMode = '2W' | '4W' | '8W' | 'auto';

interface ProjectionToggleProps {
  view: 'chart' | 'table';
  onViewChange: (view: 'chart' | 'table') => void;
  period: 'daily' | 'weekly';
  onPeriodChange: (period: 'daily' | 'weekly') => void;
  horizonMode: HorizonMode;
  onHorizonChange: (mode: HorizonMode) => void;
  autoHorizonDays?: number; // Display value for auto mode
}

export function ProjectionToggle({ 
  view, 
  onViewChange, 
  period, 
  onPeriodChange,
  horizonMode,
  onHorizonChange,
  autoHorizonDays
}: ProjectionToggleProps) {
  const getHorizonLabel = (mode: HorizonMode) => {
    if (mode === 'auto' && autoHorizonDays) {
      return `Auto (${autoHorizonDays}d)`;
    }
    return mode === 'auto' ? 'Auto' : mode;
  };

  return (
    <div className="flex items-center gap-2">
      {/* View Toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
        <Button
          variant={view === 'chart' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('chart')}
          className="h-7 px-2"
        >
          <BarChart3 className="h-4 w-4 mr-1" />
          Chart
        </Button>
        <Button
          variant={view === 'table' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('table')}
          className="h-7 px-2"
        >
          <Table className="h-4 w-4 mr-1" />
          Table
        </Button>
      </div>

      {/* Period Toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
        <Button
          variant={period === 'daily' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange('daily')}
          className="h-7 px-3"
        >
          Daily
        </Button>
        <Button
          variant={period === 'weekly' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onPeriodChange('weekly')}
          className="h-7 px-3"
        >
          Weekly
        </Button>
      </div>

      {/* Horizon Toggle */}
      <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
        <Button
          variant={horizonMode === '2W' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onHorizonChange('2W')}
          className="h-7 px-2"
        >
          2W
        </Button>
        <Button
          variant={horizonMode === '4W' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onHorizonChange('4W')}
          className="h-7 px-2"
        >
          4W
        </Button>
        <Button
          variant={horizonMode === '8W' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onHorizonChange('8W')}
          className="h-7 px-2"
        >
          8W
        </Button>
        <Button
          variant={horizonMode === 'auto' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => onHorizonChange('auto')}
          className="h-7 px-2"
        >
          {getHorizonLabel('auto')}
        </Button>
      </div>
    </div>
  );
}
