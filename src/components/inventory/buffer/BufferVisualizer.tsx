
import React from 'react';
import { BufferZones } from '@/types/inventory';
import { Progress } from '@/components/ui/progress';

interface BufferVisualizerProps {
  netFlowPosition: number;
  bufferZones: BufferZones;
  adu?: number;
  showLabels?: boolean;
  height?: string;
}

export const BufferVisualizer = ({
  netFlowPosition,
  bufferZones,
  adu,
  showLabels = true,
  height = 'h-20'
}: BufferVisualizerProps) => {
  const { red, yellow, green } = bufferZones;
  const totalBuffer = red + yellow + green;
  
  // Calculate the positions for the buffer zones
  const redWidth = (red / totalBuffer) * 100;
  const yellowWidth = (yellow / totalBuffer) * 100;
  const greenWidth = (green / totalBuffer) * 100;
  
  // Calculate the net flow position
  const netFlowPositionPercentage = (netFlowPosition / totalBuffer) * 100;
  const clampedNetFlowPosition = Math.min(Math.max(netFlowPositionPercentage, 0), 100);
  
  return (
    <div className="w-full space-y-2">
      {/* Buffer zones visualization */}
      <div className={`relative w-full ${height} border rounded-md overflow-hidden bg-gray-50`}>
        <div className="absolute bottom-0 left-0 h-full flex w-full">
          {/* Red zone */}
          <div 
            className="bg-red-200 h-full" 
            style={{ width: `${redWidth}%` }}
          />
          
          {/* Yellow zone */}
          <div 
            className="bg-yellow-200 h-full" 
            style={{ width: `${yellowWidth}%` }}
          />
          
          {/* Green zone */}
          <div 
            className="bg-green-200 h-full" 
            style={{ width: `${greenWidth}%` }}
          />
        </div>
        
        {/* Net flow position indicator */}
        <div 
          className="absolute bottom-0 h-full w-1 bg-blue-600 z-10"
          style={{ left: `${clampedNetFlowPosition}%` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-blue-600 shadow" />
        </div>
        
        {/* Zone labels, if requested */}
        {showLabels && (
          <div className="absolute bottom-1 left-0 w-full flex text-xs px-2">
            <div className="flex-1 text-center">Red</div>
            <div className="flex-1 text-center">Yellow</div>
            <div className="flex-1 text-center">Green</div>
          </div>
        )}
      </div>
      
      {/* Buffer metrics */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <div>Red: {red}</div>
        <div>Yellow: {yellow}</div>
        <div>Green: {green}</div>
        <div>NFP: {netFlowPosition}</div>
        {adu !== undefined && <div>ADU: {adu}/day</div>}
      </div>
    </div>
  );
};
