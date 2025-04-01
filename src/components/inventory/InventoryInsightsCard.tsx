
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeDelta } from "@/components/ui/badge-delta";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function InventoryInsightsCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Buffer Effectiveness</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">
                  Measures how well your buffer levels are preventing stockouts while minimizing excess inventory
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">87%</div>
            <BadgeDelta deltaType="increase" size="sm">
              +5.2%
            </BadgeDelta>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Compared to previous month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">
                  How many times inventory is sold and replaced over a specific period
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">4.3x</div>
            <BadgeDelta deltaType="increase" size="sm">
              +0.8x
            </BadgeDelta>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Compared to previous quarter
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Service Level</CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">
                  Percentage of customer orders that are fulfilled completely and on time
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">95.4%</div>
            <BadgeDelta deltaType="moderateIncrease" size="sm">
              +1.2%
            </BadgeDelta>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last 30 days performance
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
