
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { BufferZones } from '@/types/inventory';
import { InfoIcon } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface BufferVisualizerProps {
  netFlowPosition: number;
  bufferZones: BufferZones;
  adu?: number;
}

export const BufferVisualizer = ({ netFlowPosition, bufferZones, adu }: BufferVisualizerProps) => {
  const totalBuffer = bufferZones.red + bufferZones.yellow + bufferZones.green;
  const bufferPenetration = ((totalBuffer - netFlowPosition) / totalBuffer) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Base Buffer Level: {totalBuffer}</span>
            <HoverCard>
              <HoverCardTrigger asChild>
                <InfoIcon className="h-4 w-4 cursor-help" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-semibold">Base Buffer Level (BBL)</h4>
                  <p className="text-sm">BBL = Red Zone + Yellow Zone + Green Zone</p>
                  <div className="text-sm text-muted-foreground mt-2">
                    <h5 className="font-medium">Zone Calculations:</h5>
                    <ul className="list-disc pl-4 mt-1 space-y-1">
                      <li>Red Zone = ADU × Lead Time Factor</li>
                      <li>Yellow Zone = ADU × Replenishment Time</li>
                      <li>Green Zone = Yellow Zone × Top of Green Factor</li>
                    </ul>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <h5 className="font-medium">Current values:</h5>
                    <ul className="list-disc pl-4 mt-1">
                      <li>Red Zone: {bufferZones.red}</li>
                      <li>Yellow Zone: {bufferZones.yellow}</li>
                      <li>Green Zone: {bufferZones.green}</li>
                      <li>Total BBL: {totalBuffer}</li>
                    </ul>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          <span>|</span>
          <span>Buffer Penetration: {Math.round(bufferPenetration)}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span>ADU: {adu?.toFixed(2) || 'N/A'}</span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <InfoIcon className="h-4 w-4 cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-60">
              <p className="text-sm">Average Daily Usage affects buffer zones sizing</p>
            </HoverCardContent>
          </HoverCard>
        </div>
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
