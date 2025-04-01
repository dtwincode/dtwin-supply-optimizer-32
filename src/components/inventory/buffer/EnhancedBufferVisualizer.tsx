
import React from "react";

interface BufferZones {
  red: number;
  yellow: number;
  green: number;
}

interface EnhancedBufferVisualizerProps {
  bufferZones: BufferZones;
  netFlowPosition: number;
  adu?: number;
  showDetailedInfo?: boolean;
}

export const EnhancedBufferVisualizer: React.FC<EnhancedBufferVisualizerProps> = ({
  bufferZones,
  netFlowPosition,
  adu,
  showDetailedInfo = false
}) => {
  const { red, yellow, green } = bufferZones;
  const totalBuffer = red + yellow + green;
  
  // Calculate each zone's percentage of the total buffer
  const redPercent = totalBuffer > 0 ? (red / totalBuffer) * 100 : 33.33;
  const yellowPercent = totalBuffer > 0 ? (yellow / totalBuffer) * 100 : 33.33;
  const greenPercent = totalBuffer > 0 ? (green / totalBuffer) * 100 : 33.33;
  
  // Calculate the current position as a percentage
  const bufferPenetration = totalBuffer > 0 
    ? Math.max(0, Math.min(100, ((totalBuffer - netFlowPosition) / totalBuffer) * 100)) 
    : 0;
  
  // Calculate position for the marker
  const markerPosition = `${100 - bufferPenetration}%`;
  
  // Determine the status based on buffer penetration
  const getStatus = () => {
    if (bufferPenetration >= 80) {
      return { label: "Critical", color: "text-red-600" };
    } else if (bufferPenetration >= 40) {
      return { label: "Warning", color: "text-amber-600" };
    } else {
      return { label: "Healthy", color: "text-green-600" };
    }
  };
  
  const status = getStatus();
  
  return (
    <div className="w-full">
      <div className="relative h-4 flex rounded-full overflow-hidden mb-1">
        <div 
          className="bg-red-500 h-full" 
          style={{ width: `${redPercent}%` }}
        />
        <div 
          className="bg-yellow-400 h-full" 
          style={{ width: `${yellowPercent}%` }}
        />
        <div 
          className="bg-green-500 h-full" 
          style={{ width: `${greenPercent}%` }}
        />
        
        {/* Position marker */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-black"
          style={{ left: markerPosition }}
        >
          <div className="w-2 h-2 bg-black rounded-full -ml-[3px] -mt-[3px]"></div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium">
          <span className={status.color}>{status.label}</span>
          {bufferPenetration > 0 && (
            <span className="text-gray-700 dark:text-gray-300"> - {Math.round(bufferPenetration)}%</span>
          )}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {netFlowPosition} / {totalBuffer}
        </div>
      </div>
      
      {showDetailedInfo && (
        <div className="mt-2 space-y-1">
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="px-1.5 py-1 bg-red-100 text-red-800 rounded">
              Red: {red} {adu && <span>({Math.round(red/adu)} days)</span>}
            </div>
            <div className="px-1.5 py-1 bg-yellow-100 text-yellow-800 rounded">
              Yellow: {yellow} {adu && <span>({Math.round(yellow/adu)} days)</span>}
            </div>
            <div className="px-1.5 py-1 bg-green-100 text-green-800 rounded">
              Green: {green} {adu && <span>({Math.round(green/adu)} days)</span>}
            </div>
          </div>
          {adu && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Average Daily Usage: {adu} units/day
            </div>
          )}
        </div>
      )}
    </div>
  );
};
