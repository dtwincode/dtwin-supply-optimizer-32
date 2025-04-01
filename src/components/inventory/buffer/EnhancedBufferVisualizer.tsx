
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  ReferenceLine,
  Tooltip as RechartsTooltip
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedBufferVisualizerProps {
  bufferZones: {
    red: number;
    yellow: number;
    green: number;
  };
  netFlowPosition: number;
  adu?: number;
  className?: string;
  showDetailedInfo?: boolean;
}

export function EnhancedBufferVisualizer({
  bufferZones,
  netFlowPosition,
  adu,
  className,
  showDetailedInfo = false
}: EnhancedBufferVisualizerProps) {
  // Calculate the total buffer size
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  
  // Calculate buffer penetration percentage
  const penetration = totalBuffer > 0 
    ? Math.max(0, Math.min(100, ((totalBuffer - netFlowPosition) / totalBuffer) * 100)) 
    : 0;
  
  // Determine buffer status color
  const getStatusColor = () => {
    if (penetration >= 66) return "text-red-500";
    if (penetration >= 33) return "text-amber-500";
    return "text-green-500";
  };
  
  // Prepare data for the stacked bar chart
  const chartData = [
    {
      name: "Buffer",
      Red: bufferZones.red,
      Yellow: bufferZones.yellow,
      Green: bufferZones.green,
      NFP: 0, // For the reference line
    }
  ];
  
  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const zone = payload[0].name;
      const value = payload[0].value;
      
      return (
        <div className="bg-white p-2 border rounded shadow-sm text-xs">
          <p><span className="font-medium">{zone} Zone:</span> {value} units</p>
          {zone === "Red" && (
            <p className="text-xs text-muted-foreground">Protects against lead time variability</p>
          )}
          {zone === "Yellow" && (
            <p className="text-xs text-muted-foreground">Covers normal replenishment cycle</p>
          )}
          {zone === "Green" && (
            <p className="text-xs text-muted-foreground">Balances order frequency & size</p>
          )}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      {showDetailedInfo && (
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center">
            <span className={cn("text-sm font-medium", getStatusColor())}>
              {penetration.toFixed(0)}% Buffer Penetration
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs max-w-xs">
                    Buffer penetration indicates how deep into the buffer you've consumed.
                    <br />• 0-33%: Green (safe)
                    <br />• 34-66%: Yellow (monitor)
                    <br />• 67-100%: Red (action needed)
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-xs text-muted-foreground">
            NFP: {netFlowPosition}
          </div>
        </div>
      )}
      
      <div className="h-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            barSize={18}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <XAxis 
              type="number" 
              hide 
              domain={[0, totalBuffer > 0 ? totalBuffer * 1.1 : 100]} 
            />
            <YAxis type="category" dataKey="name" hide />
            <Bar 
              dataKey="Red" 
              stackId="buffer" 
              fill="#FDA4AF" 
              radius={[0, 0, 0, 0]} 
            />
            <Bar 
              dataKey="Yellow" 
              stackId="buffer" 
              fill="#FEF08A" 
              radius={[0, 0, 0, 0]} 
            />
            <Bar 
              dataKey="Green" 
              stackId="buffer" 
              fill="#A7F3D0" 
              radius={[0, 10, 10, 0]} 
            />
            <ReferenceLine 
              x={netFlowPosition} 
              stroke="#000" 
              strokeWidth={2} 
              label={{ 
                position: 'top', 
                value: '', 
                fill: '#000' 
              }} 
            />
            <RechartsTooltip content={<CustomTooltip />} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {showDetailedInfo && (
        <div className="grid grid-cols-3 gap-1 text-xs mt-1">
          <div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-200 rounded-sm mr-1"></div>
              <span className="text-muted-foreground">Red: {bufferZones.red}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-200 rounded-sm mr-1"></div>
              <span className="text-muted-foreground">Yellow: {bufferZones.yellow}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-200 rounded-sm mr-1"></div>
              <span className="text-muted-foreground">Green: {bufferZones.green}</span>
            </div>
          </div>
        </div>
      )}
      
      {showDetailedInfo && adu && (
        <div className="text-xs text-muted-foreground mt-1">
          <span>ADU: {adu} units/day</span>
          {bufferZones.red > 0 && (
            <span className="ml-3">TOG Coverage: {((totalBuffer) / adu).toFixed(1)} days</span>
          )}
        </div>
      )}
    </div>
  );
}
