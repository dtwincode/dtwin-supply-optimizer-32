
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BufferVisualizerProps {
  netFlowPosition: number;
  bufferZones: {
    red: number;
    yellow: number;
    green: number;
  };
  adu?: number;
}

export function BufferVisualizer({ netFlowPosition, bufferZones, adu }: BufferVisualizerProps) {
  const [data, setData] = useState({
    percentage: 0,
    zoneColor: 'bg-gray-200',
    labelColor: 'text-gray-700',
    zoneLabel: 'Loading...'
  });

  useEffect(() => {
    // Calculate buffer zones and percentages
    const calculateBufferData = () => {
      try {
        const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
        
        if (totalBuffer <= 0) {
          return {
            percentage: 0,
            zoneColor: 'bg-gray-200',
            labelColor: 'text-gray-700',
            zoneLabel: 'No buffer'
          };
        }

        // Calculate penetration (how much of the buffer is penetrated)
        const penetration = ((totalBuffer - netFlowPosition) / totalBuffer) * 100;
        const boundedPenetration = Math.max(0, Math.min(100, penetration));
        
        // Determine which zone we're in
        let zoneColor, labelColor, zoneLabel;
        
        if (penetration >= 100 - (bufferZones.red / totalBuffer) * 100) {
          zoneColor = 'bg-red-500';
          labelColor = 'text-red-700';
          zoneLabel = 'Red Zone';
        } else if (penetration >= 100 - ((bufferZones.red + bufferZones.yellow) / totalBuffer) * 100) {
          zoneColor = 'bg-yellow-500';
          labelColor = 'text-yellow-700';
          zoneLabel = 'Yellow Zone';
        } else {
          zoneColor = 'bg-green-500';
          labelColor = 'text-green-700';
          zoneLabel = 'Green Zone';
        }
        
        return {
          percentage: boundedPenetration,
          zoneColor,
          labelColor,
          zoneLabel
        };
      } catch (error) {
        console.error('Error calculating buffer data:', error);
        return {
          percentage: 0,
          zoneColor: 'bg-gray-200',
          labelColor: 'text-gray-700',
          zoneLabel: 'Error'
        };
      }
    };
    
    setData(calculateBufferData());
  }, [netFlowPosition, bufferZones]);

  // Convert raw values to display friendly strings
  const displayValues = {
    netFlow: netFlowPosition.toFixed(0),
    redZone: bufferZones.red.toFixed(0),
    yellowZone: bufferZones.yellow.toFixed(0),
    greenZone: bufferZones.green.toFixed(0),
    total: (bufferZones.red + bufferZones.yellow + bufferZones.green).toFixed(0),
    adu: adu ? adu.toFixed(1) : '0',
    penetration: data.percentage.toFixed(0) + '%'
  };

  return (
    <div className="w-full space-y-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="space-y-1 cursor-help">
            <div className="flex justify-between items-center text-xs">
              <span className={data.labelColor + " font-medium"}>{data.zoneLabel}</span>
              <span className="text-gray-500">{displayValues.penetration}</span>
            </div>
            <Progress 
              className="h-2" 
              value={data.percentage} 
              indicatorColor={data.zoneColor} 
            />
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-64 p-2">
          <div className="space-y-2 text-xs">
            <h4 className="font-medium">Buffer Status</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-gray-500">Net Flow Position:</span>
              <span className="font-medium">{displayValues.netFlow}</span>
              
              <span className="text-gray-500">Red Zone:</span>
              <span className="font-medium">{displayValues.redZone}</span>
              
              <span className="text-gray-500">Yellow Zone:</span>
              <span className="font-medium">{displayValues.yellowZone}</span>
              
              <span className="text-gray-500">Green Zone:</span>
              <span className="font-medium">{displayValues.greenZone}</span>
              
              <span className="text-gray-500">Total Buffer:</span>
              <span className="font-medium">{displayValues.total}</span>
              
              <span className="text-gray-500">ADU:</span>
              <span className="font-medium">{displayValues.adu}/day</span>
              
              <span className="text-gray-500">Buffer Penetration:</span>
              <span className="font-medium">{displayValues.penetration}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
