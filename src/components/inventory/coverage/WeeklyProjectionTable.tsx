import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { WeekProjection } from '@/utils/projectionCalculations';

interface WeeklyProjectionTableProps {
  projections: WeekProjection[];
}

export function WeeklyProjectionTable({ projections }: WeeklyProjectionTableProps) {
  const getBufferColor = (status: string) => {
    switch (status) {
      case 'RED': return 'text-destructive bg-destructive/10';
      case 'YELLOW': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-500 dark:bg-yellow-950';
      case 'GREEN': return 'text-green-600 bg-green-50 dark:text-green-500 dark:bg-green-950';
      case 'BLUE': return 'text-blue-600 bg-blue-50 dark:text-blue-500 dark:bg-blue-950';
      default: return '';
    }
  };

  const formatNumber = (num: number) => num.toFixed(1);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[120px]">Week</TableHead>
              <TableHead className="text-right">Total Demand</TableHead>
              <TableHead className="text-right">Start Inventory</TableHead>
              <TableHead className="text-right">Incoming Supply</TableHead>
              <TableHead className="text-right">End Inventory</TableHead>
              <TableHead className="text-right">Avg NFP</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Launch Order?</TableHead>
              <TableHead className="text-right">Order Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projections.map((projection) => (
              <TooltipProvider key={projection.week}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TableRow
                      className={cn(
                        projection.bufferStatus === 'RED' && 'bg-destructive/5',
                        'hover:bg-muted/50 transition-colors cursor-help'
                      )}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">
                            {projection.week === 1 ? 'This Week' : projection.weekLabel}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(projection.startDate, 'MMM dd')} - {format(projection.endDate, 'MMM dd')}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{formatNumber(projection.totalDemand)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatNumber(projection.startInventory)}
                      </TableCell>
                      <TableCell className="text-right">
                        {projection.incomingSupply > 0 ? (
                          <span className="text-green-600 dark:text-green-500 font-semibold">
                            +{formatNumber(projection.incomingSupply)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatNumber(projection.endInventory)}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        <span className={getBufferColor(projection.bufferStatus)}>
                          {formatNumber(projection.avgNFP)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={getBufferColor(projection.bufferStatus)}>
                          {projection.bufferStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {projection.launchOrder ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {projection.orderAmount > 0 ? (
                          <span className="font-semibold text-primary">
                            {formatNumber(projection.orderAmount)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                    </TableRow>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-xs">
                    <div className="space-y-1">
                      <div className="font-semibold">{projection.weekLabel} Daily Breakdown</div>
                      <div className="text-xs space-y-1">
                        {projection.dailyProjections.map((day) => (
                          <div key={day.day} className="flex justify-between gap-4">
                            <span>{format(day.date, 'EEE MMM dd')}</span>
                            <span className={getBufferColor(day.bufferStatus)}>
                              NFP: {formatNumber(day.nfp)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Summary */}
      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <div className="text-xs text-muted-foreground">
          Hover over any week to see daily breakdown • Weekly aggregations show cumulative demand and supply
        </div>
      </div>
    </div>
  );
}
