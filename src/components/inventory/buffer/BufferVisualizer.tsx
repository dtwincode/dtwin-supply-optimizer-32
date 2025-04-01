
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BufferVisualizerProps {
  netFlowPosition: number;
  bufferZones: {
    red: number;
    yellow: number;
    green: number;
  };
  adu?: number; // Average Daily Usage
}

export function BufferVisualizer({ 
  netFlowPosition, 
  bufferZones, 
  adu 
}: BufferVisualizerProps) {
  const { red, yellow, green } = bufferZones;
  const totalBuffer = red + yellow + green;
  
  // Calculate buffer penetration (how much of the buffer has been consumed)
  const penetration = totalBuffer > 0 
    ? Math.max(0, Math.min(100, ((totalBuffer - netFlowPosition) / totalBuffer) * 100)) 
    : 0;
  
  // Determine status based on penetration percentage
  const getStatus = (): 'green' | 'yellow' | 'red' => {
    if (penetration <= 33) return 'green';
    if (penetration <= 66) return 'yellow';
    return 'red';
  };
  
  const status = getStatus();
  
  // Calculate zone proportions for visualization
  const redZonePercent = Math.round((red / totalBuffer) * 100) || 0;
  const yellowZonePercent = Math.round((yellow / totalBuffer) * 100) || 0;
  const greenZonePercent = 100 - redZonePercent - yellowZonePercent;
  
  // Determine color for the progress indicator
  const getStatusColor = () => {
    switch (status) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{adu ? `ADU: ${adu.toFixed(1)}` : ''}</span>
              <span>Buffer: {totalBuffer}</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              {/* Red zone */}
              <div 
                className="absolute left-0 h-full bg-red-200" 
                style={{ width: `${redZonePercent}%` }} 
              />
              {/* Yellow zone */}
              <div 
                className="absolute h-full bg-yellow-200" 
                style={{ 
                  left: `${redZonePercent}%`, 
                  width: `${yellowZonePercent}%` 
                }} 
              />
              {/* Green zone */}
              <div 
                className="absolute right-0 h-full bg-green-200" 
                style={{ width: `${greenZonePercent}%` }} 
              />
              <Progress 
                value={100 - penetration} 
                className="h-full" 
                indicatorClassName={getStatusColor()}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-600 font-medium">
                {netFlowPosition < 0 ? 0 : Math.round(penetration)}%
              </span>
              <span className="text-muted-foreground">
                NFP: {Math.round(netFlowPosition)}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64">
          <div className="space-y-2">
            <h4 className="font-medium">Buffer Details</h4>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span>Red Zone:</span>
              <span className="text-right">{red}</span>
              <span>Yellow Zone:</span>
              <span className="text-right">{yellow}</span>
              <span>Green Zone:</span>
              <span className="text-right">{green}</span>
              <span>Total Buffer:</span>
              <span className="text-right">{totalBuffer}</span>
              <span>Net Flow Position:</span>
              <span className="text-right">{Math.round(netFlowPosition)}</span>
              <span>Buffer Penetration:</span>
              <span className="text-right">{Math.round(penetration)}%</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
