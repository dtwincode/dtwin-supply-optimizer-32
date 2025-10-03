import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DAFIndicatorProps {
  daf: number;
  adjustedADU?: number;
  baseADU?: number;
}

export function DAFIndicator({ daf, adjustedADU, baseADU }: DAFIndicatorProps) {
  if (daf === 1.0) {
    return null; // No adjustment, don't display anything
  }

  const isIncrease = daf > 1.0;
  const percentChange = ((daf - 1) * 100).toFixed(0);
  const Icon = isIncrease ? TrendingUp : TrendingDown;
  const colorClass = isIncrease ? "bg-green-500" : "bg-red-500";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${colorClass} text-white cursor-help`}>
            <Icon className="h-3 w-3 mr-1" />
            DAF {daf.toFixed(2)}× ({percentChange > '0' ? '+' : ''}{percentChange}%)
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">Active Demand Adjustment Factor</p>
            <p className="text-sm">
              A planned adjustment is currently active for this product-location.
            </p>
            {baseADU && adjustedADU && (
              <div className="text-xs mt-2 space-y-1">
                <p>Base ADU: {baseADU.toFixed(2)} units/day</p>
                <p>Adjusted ADU: {adjustedADU.toFixed(2)} units/day</p>
                <p className="font-medium mt-1">
                  {isIncrease ? 'Increasing' : 'Decreasing'} buffer zones by {Math.abs(parseInt(percentChange))}%
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
