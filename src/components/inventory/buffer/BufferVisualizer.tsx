
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { InventoryItem } from "@/types/inventory";

interface BufferVisualizerProps {
  item: InventoryItem;
}

export const BufferVisualizer = ({ item }: BufferVisualizerProps) => {
  // Calculate total buffer size
  const totalBuffer = (item.redZoneSize || 0) + (item.yellowZoneSize || 0) + (item.greenZoneSize || 0);
  
  // Calculate percentages for visualization
  const redPercent = totalBuffer ? Math.round(((item.redZoneSize || 0) / totalBuffer) * 100) : 0;
  const yellowPercent = totalBuffer ? Math.round(((item.yellowZoneSize || 0) / totalBuffer) * 100) : 0;
  const greenPercent = totalBuffer ? Math.round(((item.greenZoneSize || 0) / totalBuffer) * 100) : 0;
  
  // Calculate current penetration
  const bufferPenetration = item.bufferPenetration || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Buffer Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Red: {item.redZoneSize || 0}</span>
            <span>Yellow: {item.yellowZoneSize || 0}</span>
            <span>Green: {item.greenZoneSize || 0}</span>
          </div>
          
          <div className="w-full h-6 flex rounded-full overflow-hidden">
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
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Buffer Penetration</span>
              <span className="font-medium">{bufferPenetration}%</span>
            </div>
            <Progress value={bufferPenetration} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
