
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
      high: 'Strategic item',
      medium: 'Important item',
      low: 'Standard item'
    }
  };
  return tooltips[type as keyof typeof tooltips]?.[level as keyof typeof tooltips[keyof typeof tooltips]] || '';
};

const getBadgeColor = (level: string) => {
  switch (level) {
    case 'high':
      return 'bg-red-100 text-red-800 border border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

export function ClassificationBadge({ level, type, label }: ClassificationBadgeProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Badge className={getBadgeColor(level)}>
          {label}
        </Badge>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-gray-400" />
          </TooltipTrigger>
          <TooltipContent>
            {getClassificationTooltip(type, level)}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
