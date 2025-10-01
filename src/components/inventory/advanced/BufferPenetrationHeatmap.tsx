import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { fetchInventoryPlanningView } from '@/lib/inventory-planning.service';
import { useInventoryFilter } from '../InventoryFilterContext';
import { Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BufferCell {
  id: number;
  sku: string;
  product_name: string;
  location: string;
  penetration: number;
  status: 'RED' | 'YELLOW' | 'GREEN';
  nfp: number;
  tor: number;
  toy: number;
  tog: number;
}

export const BufferPenetrationHeatmap: React.FC = () => {
  const { filters } = useInventoryFilter();
  const [buffers, setBuffers] = useState<BufferCell[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchInventoryPlanningView();
      
      let filtered = data;
      if (filters.productCategory) {
        filtered = filtered.filter(item => item.category === filters.productCategory);
      }
      if (filters.locationId) {
        filtered = filtered.filter(item => item.location_id === filters.locationId);
      }
      if (filters.decouplingOnly) {
        filtered = filtered.filter(item => item.decoupling_point);
      }

      const bufferCells: BufferCell[] = filtered.map(item => {
        const penetration = item.tog > 0 ? (item.nfp / item.tog) * 100 : 0;
        return {
          id: item.id,
          sku: item.sku,
          product_name: item.product_name,
          location: item.location_id,
          penetration: Math.max(0, Math.min(100, penetration)),
          status: item.buffer_status as 'RED' | 'YELLOW' | 'GREEN',
          nfp: item.nfp,
          tor: item.tor,
          toy: item.toy,
          tog: item.tog
        };
      });

      setBuffers(bufferCells.slice(0, 50)); // Limit to 50 for performance
    } catch (error) {
      console.error('Error loading buffer data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string, penetration: number) => {
    if (status === 'RED') return 'hsl(0 84% 60%)';
    if (status === 'YELLOW') return 'hsl(48 96% 53%)';
    return 'hsl(142 71% 45%)';
  };

  const getBackgroundOpacity = (penetration: number) => {
    return Math.min(Math.max(penetration / 100, 0.2), 1);
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Buffer Penetration Heatmap</h3>
        </div>
        <div className="grid grid-cols-10 gap-2">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Buffer Penetration Heatmap</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  Visual representation of buffer penetration across all items.
                  Color intensity shows penetration level. Click any cell for details.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button variant="ghost" size="sm" onClick={loadData}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(0 84% 60%)' }} />
          <span>Red Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(48 96% 53%)' }} />
          <span>Yellow Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(142 71% 45%)' }} />
          <span>Green Zone</span>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-2">
        {buffers.map(buffer => (
          <TooltipProvider key={buffer.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="aspect-square rounded cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: getStatusColor(buffer.status, buffer.penetration),
                    opacity: getBackgroundOpacity(buffer.penetration)
                  }}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <div className="font-semibold">{buffer.sku}</div>
                  <div className="text-xs text-muted-foreground">{buffer.product_name}</div>
                  <div className="text-xs">Location: {buffer.location}</div>
                  <div className="text-xs">Penetration: {buffer.penetration.toFixed(1)}%</div>
                  <div className="text-xs">NFP: {buffer.nfp.toFixed(0)}</div>
                  <div className="text-xs">Status: {buffer.status}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {buffers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No buffer data available
        </div>
      )}
    </Card>
  );
};
