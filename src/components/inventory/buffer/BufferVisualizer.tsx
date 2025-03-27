
// Buffer visualizer placeholder - this file would be created as part of the organization
import React from "react";

interface BufferVisualizerProps {
  netFlowPosition: number;
  bufferZones: {
    red: number;
    yellow: number;
    green: number;
  };
  adu?: number;
}

export const BufferVisualizer: React.FC<BufferVisualizerProps> = ({ 
  netFlowPosition, 
  bufferZones,
  adu 
}) => {
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  const bufferPenetration = totalBuffer > 0 
    ? Math.max(0, Math.min(100, ((totalBuffer - netFlowPosition) / totalBuffer) * 100)) 
    : 0;
  
  const redWidth = (bufferZones.red / totalBuffer) * 100;
  const yellowWidth = (bufferZones.yellow / totalBuffer) * 100;
  const greenWidth = (bufferZones.green / totalBuffer) * 100;
  
  // Position indicator based on buffer penetration
  const indicatorPosition = `${Math.min(98, Math.max(2, bufferPenetration))}%`;
  
  return (
    <div className="w-full">
      {/* Buffer visualization */}
      <div className="relative h-8 flex rounded-md overflow-hidden mb-2">
        <div 
          className="bg-red-500 h-full" 
          style={{ width: `${redWidth}%` }}
        ></div>
        <div 
          className="bg-yellow-400 h-full" 
          style={{ width: `${yellowWidth}%` }}
        ></div>
        <div 
          className="bg-green-500 h-full" 
          style={{ width: `${greenWidth}%` }}
        ></div>
        
        {/* Indicator for current position */}
        <div 
          className="absolute top-0 h-full w-1 bg-blue-600 shadow-lg"
          style={{ left: indicatorPosition }}
        ></div>
      </div>
      
      {/* Metrics */}
      <div className="flex justify-between text-xs text-gray-600 mt-1">
        <div>Position: {netFlowPosition}</div>
        {adu && <div>ADU: {adu}/day</div>}
        <div>Total Buffer: {totalBuffer}</div>
      </div>
    </div>
  );
};
