import { Button } from "@/components/ui/button";
import { BarChart3, Table } from "lucide-react";

interface ProjectionToggleProps {
  view: 'chart' | 'table';
  onViewChange: (view: 'chart' | 'table') => void;
  period: 'daily' | 'weekly';
  onPeriodChange: (period: 'daily' | 'weekly') => void;
}

export function ProjectionToggle({ 
  view, 
  onViewChange, 
  period, 
  onPeriodChange 
}: ProjectionToggleProps) {
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
    </div>
  );
}
