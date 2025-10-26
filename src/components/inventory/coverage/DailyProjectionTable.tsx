import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DayProjection } from '@/utils/projectionCalculations';

interface DailyProjectionTableProps {
  projections: DayProjection[];
}

export function DailyProjectionTable({ projections }: DailyProjectionTableProps) {
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
              <TableHead className="min-w-[100px]">Day</TableHead>
              <TableHead className="text-right">Demand</TableHead>
              <TableHead className="text-right">On-Hand Start</TableHead>
              <TableHead className="text-right">Incoming Supply</TableHead>
              <TableHead className="text-right">On-Hand End</TableHead>
              <TableHead className="text-right">On-Order</TableHead>
              <TableHead className="text-right">NFP</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Launch Order?</TableHead>
              <TableHead className="text-right">Order Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projections.map((projection) => (
              <TableRow
                key={projection.day}
                className={cn(
                  projection.isWeekend && 'bg-muted/30',
                  projection.bufferStatus === 'RED' && 'bg-destructive/5',
                  'hover:bg-muted/50 transition-colors'
                )}
              >
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">
                      {projection.day === 0 ? 'Today' : `Day ${projection.day}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(projection.date, 'MMM dd, EEE')}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatNumber(projection.demand)}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatNumber(projection.onHandStart)}
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
                  {formatNumber(projection.onHandEnd)}
                </TableCell>
                <TableCell className="text-right">{formatNumber(projection.onOrder)}</TableCell>
                <TableCell className="text-right font-bold">
                  <span className={getBufferColor(projection.bufferStatus)}>
                    {formatNumber(projection.nfp)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline" className={getBufferColor(projection.bufferStatus)}>
                    {projection.bufferStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {projection.launchOrder ? (
                    projection.bufferStatus === 'RED' ? (
                      <AlertTriangle className="h-5 w-5 text-destructive mx-auto" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mx-auto" />
                    )
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
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Legend */}
      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-6 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted/50"></div>
            <span>Weekend</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>Order Recommended</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span>Critical - Immediate Action</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-muted-foreground" />
            <span>No Action Needed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
