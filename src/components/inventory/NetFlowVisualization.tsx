
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BufferZones, NetFlowPosition } from "@/types/inventory";
import { calculateBufferPenetration, getBufferStatus } from "@/utils/bufferCalculations";

interface NetFlowVisualizationProps {
  netFlowPosition: NetFlowPosition;
  bufferZones: BufferZones;
  bufferPenetration: number;
}

export const NetFlowVisualization = ({
  netFlowPosition,
  bufferZones,
  bufferPenetration
}: NetFlowVisualizationProps) => {
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  const status = getBufferStatus(bufferPenetration);
  
  // Calculate percentages for visualization
  const redPercent = (bufferZones.red / totalBuffer) * 100;
  const yellowPercent = (bufferZones.yellow / totalBuffer) * 100;
  const greenPercent = (bufferZones.green / totalBuffer) * 100;
  
  // Calculate position for the current net flow marker
  const netFlowPercent = Math.max(0, Math.min(100, (netFlowPosition.netFlowPosition / totalBuffer) * 100));
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-medium">Net Flow Position</h3>
          <p className="text-sm text-muted-foreground">
            Current position: {netFlowPosition.netFlowPosition} units
          </p>
        </div>
        <Badge 
          variant={status === 'red' ? 'destructive' : status === 'yellow' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {bufferPenetration.toFixed(0)}% Buffer Penetration
        </Badge>
      </div>
      
      <div className="relative pt-8 pb-12">
        {/* Buffer zones visualization */}
        <div className="h-8 w-full flex rounded-full overflow-hidden">
          <div 
            className="bg-red-500" 
            style={{ width: `${redPercent}%` }}
          ></div>
          <div 
            className="bg-yellow-400" 
            style={{ width: `${yellowPercent}%` }}
          ></div>
          <div 
            className="bg-green-500" 
            style={{ width: `${greenPercent}%` }}
          ></div>
        </div>
        
        {/* Buffer zone labels */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <div>0</div>
          <div className="absolute" style={{ left: `${redPercent}%` }}>
            {bufferZones.red}
          </div>
          <div className="absolute" style={{ left: `${redPercent + yellowPercent}%` }}>
            {bufferZones.red + bufferZones.yellow}
          </div>
          <div>{totalBuffer}</div>
        </div>
        
        {/* Net flow position marker */}
        <div 
          className="absolute top-4 w-0.5 h-16 bg-blue-600"
          style={{ left: `calc(${netFlowPercent}% - 1px)` }}
        >
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
            Net Flow: {netFlowPosition.netFlowPosition}
          </div>
        </div>
        
        {/* Zone labels */}
        <div className="flex text-xs mt-8">
          <div className="flex-1 text-center text-red-700">Red Zone</div>
          <div className="flex-1 text-center text-yellow-700">Yellow Zone</div>
          <div className="flex-1 text-center text-green-700">Green Zone</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-t-4 border-t-red-500">
          <div className="font-medium">Red Zone</div>
          <div className="text-2xl font-bold mt-1">{bufferZones.red}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Base stock protection
          </div>
        </Card>
        
        <Card className="p-4 border-t-4 border-t-yellow-400">
          <div className="font-medium">Yellow Zone</div>
          <div className="text-2xl font-bold mt-1">{bufferZones.yellow}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Lead time coverage
          </div>
        </Card>
        
        <Card className="p-4 border-t-4 border-t-green-500">
          <div className="font-medium">Green Zone</div>
          <div className="text-2xl font-bold mt-1">{bufferZones.green}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Order cycle coverage
          </div>
        </Card>
      </div>
    </div>
  );
};
