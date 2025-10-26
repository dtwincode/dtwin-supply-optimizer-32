import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDaysWithWeeks } from '@/utils/timeUtils';

export interface CoverageItem {
  product_id: string;
  location_id: string;
  sku: string;
  product_name: string;
  adu: number;
  dlt: number;
  on_hand: number;
  on_order: number;
  qualified_demand: number;
  nfp: number;
  dos: number;
  suggested_order_qty: number;
  buffer_profile_id?: string;
  category?: string;
  channel_id?: string;
  planning_priority?: string;
  supplier_id?: string;
  is_decoupling_point?: boolean;
  tor?: number;
  toy?: number;
  tog?: number;
  execution_priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface CoverageTableProps {
  items: CoverageItem[];
  onRowClick: (item: CoverageItem) => void;
  onCreateOrder: (item: CoverageItem) => void;
  statusFilter?: 'all' | 'red' | 'yellow' | 'green' | 'at-risk';
}

export const CoverageTable: React.FC<CoverageTableProps> = ({ 
  items, 
  onRowClick, 
  onCreateOrder,
  statusFilter = 'all'
}) => {
  
  const getDoSStatus = (dos: number, dlt: number) => {
    if (dos < dlt) return 'red';
    if (dos <= dlt * 1.5) return 'yellow';
    return 'green';
  };

  const filteredItems = useMemo(() => {
    let filtered = items;
    
    if (statusFilter !== 'all') {
      filtered = items.filter(item => {
        const status = getDoSStatus(item.dos, item.dlt);
        if (statusFilter === 'at-risk') return item.dos < item.dlt;
        return status === statusFilter;
      });
    }
    
    // Sort by execution priority
    return filtered.sort((a, b) => {
      const priorityOrder = { CRITICAL: 1, HIGH: 2, MEDIUM: 3, LOW: 4 };
      const aPriority = a.execution_priority || 'LOW';
      const bPriority = b.execution_priority || 'LOW';
      return priorityOrder[aPriority] - priorityOrder[bPriority];
    });
  }, [items, statusFilter]);

  const getStatusBadge = (dos: number, dlt: number) => {
    const status = getDoSStatus(dos, dlt);
    
    if (status === 'red') {
      return <Badge variant="destructive" className="font-semibold">CRITICAL</Badge>;
    }
    if (status === 'yellow') {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">WARNING</Badge>;
    }
    return <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">HEALTHY</Badge>;
  };

  const getProgressBar = (value: number, max: number, color: string) => {
    const percentage = Math.min((value / max) * 100, 100);
    return (
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <Badge variant="destructive" className="font-bold animate-pulse">🚨 CRITICAL</Badge>;
      case 'HIGH':
        return <Badge variant="destructive" className="font-semibold">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge className="bg-yellow-500 text-white font-semibold">MEDIUM</Badge>;
      case 'LOW':
        return <Badge variant="outline" className="border-green-500 text-green-700">LOW</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-bold sticky left-0 bg-muted/50 z-10">SKU / Location</TableHead>
            <TableHead className="text-right">ADU</TableHead>
            <TableHead className="text-right">DLT (days)</TableHead>
            <TableHead className="text-right">On-Hand</TableHead>
            <TableHead className="text-right">On-Order</TableHead>
            <TableHead className="text-right">Qualified Demand</TableHead>
            <TableHead className="text-right">NFP</TableHead>
            <TableHead className="text-center">Days of Supply</TableHead>
            <TableHead className="text-center">Execution Priority</TableHead>
            <TableHead className="text-right">Suggested Qty</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                No items found matching the current filter
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => {
              const status = getDoSStatus(item.dos, item.dlt);
              const rowColor = 
                status === 'red' ? 'bg-red-50 hover:bg-red-100' :
                status === 'yellow' ? 'bg-yellow-50 hover:bg-yellow-100' :
                'hover:bg-muted/50';

              return (
                <TableRow 
                  key={`${item.product_id}-${item.location_id}`}
                  className={`cursor-pointer ${rowColor} transition-colors`}
                  onClick={() => onRowClick(item)}
                >
                  <TableCell className="sticky left-0 bg-inherit z-10 font-medium">
                    <div>
                      <p className="font-semibold text-sm">{item.sku}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">{item.product_name}</p>
                      <p className="text-xs text-muted-foreground">{item.location_id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="font-mono">{item.adu.toFixed(1)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Average Daily Usage (90-day window)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right font-mono">{item.dlt}</TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <p className="font-mono text-sm">{item.on_hand.toFixed(0)}</p>
                      {getProgressBar(item.on_hand, item.dlt * item.adu * 2, 'bg-blue-500')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{item.on_order.toFixed(0)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="font-mono">{item.qualified_demand.toFixed(0)}</span>
                      {item.qualified_demand > item.adu * 7 && (
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`font-mono font-bold ${item.nfp < 0 ? 'text-red-600' : ''}`}>
                      {item.nfp.toFixed(0)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      {getStatusBadge(item.dos, item.dlt)}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="text-center">
                              <span className="text-lg font-bold block">{item.dos.toFixed(1)}</span>
                              <span className="text-[10px] text-muted-foreground">
                                ({(item.dos / 7).toFixed(1)} wks)
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>DoS = NFP / ADU</p>
                            <p className="text-xs">({item.nfp.toFixed(1)} / {item.adu.toFixed(1)})</p>
                            <p className="text-xs mt-1">{formatDaysWithWeeks(item.dos)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="text-xs text-muted-foreground">days</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getPriorityBadge(item.execution_priority || 'LOW')}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono font-semibold text-primary">
                      {item.suggested_order_qty > 0 ? item.suggested_order_qty.toFixed(0) : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick(item);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(status === 'red' || status === 'yellow') && item.suggested_order_qty > 0 && (
                        <Button
                          size="sm"
                          variant={status === 'red' ? 'destructive' : 'default'}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateOrder(item);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Order
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
