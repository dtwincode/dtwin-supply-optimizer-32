import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { calculateBufferZones } from '@/utils/inventoryUtils';
import { InventoryItem, BufferZones } from '@/types/inventory';

interface BufferVisualizerProps {
  netFlowPosition: number;
  bufferZones: BufferZones;
  adu?: number;
  item?: InventoryItem;
  className?: string;
}

export function BufferVisualizer({
  netFlowPosition,
  bufferZones,
  adu,
  item,
  className = ''
}: BufferVisualizerProps) {
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState<BufferZones>(bufferZones);
  
  useEffect(() => {
    const loadZones = async () => {
      if (item) {
        setLoading(true);
        try {
          const calculatedZones = await calculateBufferZones(item);
          setZones(calculatedZones);
        } catch (error) {
          console.error("Error calculating buffer zones:", error);
          // Keep using the provided bufferZones if calculation fails
        } finally {
          setLoading(false);
        }
      } else {
        // If no item provided, use the provided bufferZones
        setZones(bufferZones);
      }
    };
    
    loadZones();
  }, [item, bufferZones]);

  const total = zones.red + zones.yellow + zones.green || 1;
  const redPercentage = (zones.red / total) * 100;
  const yellowPercentage = (zones.yellow / total) * 100;
  const greenPercentage = (zones.green / total) * 100;
  
  // Calculate penetration percentage (how far into the buffer)
  // 0% means at the top of green, 100% means at the bottom of red
  const penetrationPercentage = Math.max(0, Math.min(100, ((total - netFlowPosition) / total) * 100));
  
  // Determine position on the buffer
  const position = 
    penetrationPercentage >= (yellowPercentage + greenPercentage) ? 'red' :
    penetrationPercentage >= greenPercentage ? 'yellow' : 'green';
  
  if (loading) {
    return (
      <Card className={`p-2 ${className}`}>
        <CardContent className="p-1">
          <div className="h-6 bg-gray-200 animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!zones.red && !zones.yellow && !zones.green) {
    return (
      <Card className={`p-2 ${className}`}>
        <CardContent className="p-1">
          <div className="text-sm text-gray-500 text-center">No buffer data</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-xs">
        <span>NFP: {netFlowPosition.toFixed(0)}</span>
        {adu && <span>ADU: {adu.toFixed(1)}/day</span>}
      </div>
      
      <div className="flex h-6 rounded-md overflow-hidden">
        {/* Red Zone */}
        <div 
          className="bg-red-200 flex items-center justify-center" 
          style={{ width: `${redPercentage}%`, minWidth: '20px' }}
        >
          <span className="text-xs">{zones.red}</span>
        </div>
        
        {/* Yellow Zone */}
        <div 
          className="bg-yellow-200 flex items-center justify-center" 
          style={{ width: `${yellowPercentage}%`, minWidth: '20px' }}
        >
          <span className="text-xs">{zones.yellow}</span>
        </div>
        
        {/* Green Zone */}
        <div 
          className="bg-green-200 flex items-center justify-center" 
          style={{ width: `${greenPercentage}%`, minWidth: '20px' }}
        >
          <span className="text-xs">{zones.green}</span>
        </div>
      </div>
      
      {/* NFP Indicator */}
      <Progress 
        className="h-2" 
        value={penetrationPercentage} 
        indicatorClassName={`bg-${position}-500`}
      />
      
      <div className="flex justify-between text-xs">
        <span>Total: {total}</span>
        <span className={`text-${position}-600 font-medium`}>
          {position === 'green' ? 'Healthy' : position === 'yellow' ? 'Warning' : 'Critical'}
        </span>
      </div>
    </div>
  );
}
