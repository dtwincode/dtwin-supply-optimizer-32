
// NetworkFlowVisualization placeholder - this file would be created as part of the organization
import React from "react";

interface NetworkFlowVisualizationProps {
  netFlowPosition: {
    onHand: number;
    onOrder: number;
    qualifiedDemand: number;
    netFlowPosition: number;
  };
  bufferZones: {
    red: number;
    yellow: number;
    green: number;
  };
  bufferPenetration: number;
}

export const NetworkFlowVisualization: React.FC<NetworkFlowVisualizationProps> = ({
  netFlowPosition,
  bufferZones,
  bufferPenetration
}) => {
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">Network Flow Position</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-3 border rounded-md bg-blue-50">
          <div className="text-sm text-muted-foreground">On Hand</div>
          <div className="text-2xl font-bold">{netFlowPosition.onHand}</div>
        </div>
        
        <div className="p-3 border rounded-md bg-green-50">
          <div className="text-sm text-muted-foreground">On Order</div>
          <div className="text-2xl font-bold">{netFlowPosition.onOrder}</div>
        </div>
        
        <div className="p-3 border rounded-md bg-amber-50">
          <div className="text-sm text-muted-foreground">Qualified Demand</div>
          <div className="text-2xl font-bold">{netFlowPosition.qualifiedDemand}</div>
        </div>
        
        <div className="p-3 border rounded-md bg-indigo-50">
          <div className="text-sm text-muted-foreground">Net Flow Position</div>
          <div className="text-2xl font-bold">{netFlowPosition.netFlowPosition}</div>
        </div>
      </div>
      
      {/* Flow visualization */}
      <div className="relative h-12 rounded-md bg-gray-100 mb-6">
        <div className="absolute inset-0 flex">
          <div className="bg-red-500 h-full" style={{ width: `${bufferZones.red}%` }}></div>
          <div className="bg-yellow-400 h-full" style={{ width: `${bufferZones.yellow}%` }}></div>
          <div className="bg-green-500 h-full" style={{ width: `${bufferZones.green}%` }}></div>
        </div>
        
        <div 
          className="absolute top-0 h-full w-2 bg-blue-600"
          style={{ left: `${bufferPenetration}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-sm">
        <div>Red Zone: {bufferZones.red}%</div>
        <div>Yellow Zone: {bufferZones.yellow}%</div>
        <div>Green Zone: {bufferZones.green}%</div>
      </div>
    </div>
  );
};
