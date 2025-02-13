
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { BufferZones } from '@/types/inventory';

interface BufferVisualizerProps {
  netFlowPosition: number;
  bufferZones: BufferZones;
}

export const BufferVisualizer = ({ netFlowPosition, bufferZones }: BufferVisualizerProps) => {
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  const bufferPenetration = ((totalBuffer - netFlowPosition) / totalBuffer) * 100;

  const getBackgroundColor = () => {
    if (bufferPenetration >= 66) return 'bg-red-200';
    if (bufferPenetration >= 33) return 'bg-yellow-200';
    return 'bg-green-200';
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Buffer Penetration: {Math.round(bufferPenetration)}%</span>
        <span>Net Flow: {netFlowPosition}</span>
      </div>
      <div className="relative h-6 rounded-full overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className="bg-red-200" style={{ width: `${(bufferZones.red / totalBuffer) * 100}%` }} />
          <div className="bg-yellow-200" style={{ width: `${(bufferZones.yellow / totalBuffer) * 100}%` }} />
          <div className="bg-green-200" style={{ width: `${(bufferZones.green / totalBuffer) * 100}%` }} />
        </div>
        <Progress value={bufferPenetration} className="h-full" />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-red-600">Red: {bufferZones.red}</span>
        <span className="text-yellow-600">Yellow: {bufferZones.yellow}</span>
        <span className="text-green-600">Green: {bufferZones.green}</span>
      </div>
    </div>
  );
};
