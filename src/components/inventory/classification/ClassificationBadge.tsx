
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ClassificationBadgeProps {
  level: 'high' | 'medium' | 'low';
  type: 'leadTime' | 'variability' | 'criticality';
  label: string;
}

const getClassificationTooltip = (type: string, level: string) => {
  const tooltips = {
    leadTime: {
      high: 'Lead time > 30 days',
      medium: 'Lead time 15-30 days',
      low: 'Lead time < 15 days'
    },
    variability: {
      high: 'COV > 1',
      medium: 'COV 0.5-1',
      low: 'COV < 0.5'
    },
    criticality: {
      high: 'Strategic or critical item to operations',
      medium: 'Important item with moderate impact',
      low: 'Standard item with minimal impact'
    }
  };
  return tooltips[type as keyof typeof tooltips]?.[level as keyof typeof tooltips[keyof typeof tooltips]] || '';
};

const getBadgeColor = (level: string, type: string) => {
  // For criticality, we want to emphasize the meaning differently
  if (type === 'criticality') {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
    }
  } else {
    // For lead time and variability, we maintain the existing logic
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border border-green-200';
    }
  }
  return 'bg-gray-100 text-gray-800 border border-gray-200';
};

export function ClassificationBadge({ level, type, label }: ClassificationBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      <Badge className={cn(getBadgeColor(level, type), "px-1.5 py-0 text-xs")}>
        {label}
      </Badge>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-3 w-3 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent>
          {getClassificationTooltip(type, level)}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
