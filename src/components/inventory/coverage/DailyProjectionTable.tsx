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
      case 'RED': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'YELLOW': return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-500 dark:border-yellow-700';
      case 'GREEN': return 'bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-500 dark:border-green-700';
      case 'BLUE': return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-500 dark:border-blue-700';
      default: return '';
    }
  };

  const formatNumber = (num: number) => num.toFixed(1);

  if (projections.length === 0) {
    return (
      <div className="rounded-lg border border-border p-8 text-center text-muted-foreground">
        No projection data available
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="sticky left-0 z-20 bg-muted/50 border-r-2 border-border min-w-[140px] font-semibold">
                Metric
              </TableHead>
              {projections.map((projection) => (
                <TableHead
                  key={projection.day}
                  className={cn(
                    'text-center min-w-[90px] border-l border-border',
                    projection.isWeekend && 'bg-muted/70'
                  )}
                >
                  <div className="font-semibold">
                    {projection.day === 0 ? 'Today' : `Day ${projection.day}`}
                  </div>
                  <div className="text-xs font-normal text-muted-foreground">
                    {format(projection.date, 'MMM dd')}
                  </div>
                  <div className="text-xs font-normal text-muted-foreground">
                    {format(projection.date, 'EEE')}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* On-Hand Start */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                On-Hand Start
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.day}
                  className={cn(
                    'text-center border-l border-border font-medium',
                    projection.isWeekend && 'bg-muted/30'
                  )}
                >
                  {formatNumber(projection.onHandStart)}
                </TableCell>
              ))}
            </TableRow>

            {/* Demand */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                Demand
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.day}
                  className={cn(
                    'text-center border-l border-border',
                    projection.isWeekend && 'bg-muted/30'
                  )}
                >
                  <span className="text-orange-600 dark:text-orange-500">
                    -{formatNumber(projection.demand)}
                  </span>
                </TableCell>
              ))}
            </TableRow>

            {/* Incoming Supply */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                Incoming Supply
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.day}
                  className={cn(
                    'text-center border-l border-border',
                    projection.isWeekend && 'bg-muted/30'
                  )}
                >
                  {projection.incomingSupply > 0 ? (
                    <span className="text-green-600 dark:text-green-500 font-semibold">
                      +{formatNumber(projection.incomingSupply)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              ))}
            </TableRow>

            {/* On-Hand End */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                On-Hand End
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.day}
                  className={cn(
                    'text-center border-l border-border font-medium',
                    projection.isWeekend && 'bg-muted/30'
                  )}
                >
                  {formatNumber(projection.onHandEnd)}
                </TableCell>
              ))}
            </TableRow>

            {/* On-Order */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                On-Order
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.day}
                  className={cn(
                    'text-center border-l border-border',
                    projection.isWeekend && 'bg-muted/30'
                  )}
                >
                  {formatNumber(projection.onOrder)}
                </TableCell>
              ))}
            </TableRow>

            {/* NFP */}
            <TableRow className="hover:bg-muted/30 bg-primary/5">
              <TableCell className="sticky left-0 z-10 bg-primary/10 border-r-2 border-border font-semibold">
                Net Flow Position (NFP)
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.day}
                  className={cn(
                    'text-center border-l border-border font-bold',
                    projection.isWeekend && 'bg-muted/30'
                  )}
                >
                  <span className={cn(
                    'px-2 py-1 rounded',
                    getBufferColor(projection.bufferStatus)
                  )}>
                    {formatNumber(projection.nfp)}
                  </span>
                </TableCell>
              ))}
            </TableRow>

            {/* Buffer Status */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                Buffer Status
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.day}
                  className={cn(
                    'text-center border-l border-border',
                    projection.isWeekend && 'bg-muted/30'
                  )}
                >
                  <Badge
                    variant="outline"
                    className={cn('font-semibold', getBufferColor(projection.bufferStatus))}
                  >
                    {projection.bufferStatus}
                  </Badge>
                </TableCell>
              ))}
            </TableRow>

            {/* Launch Order */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                Launch Order?
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.day}
                  className={cn(
                    'text-center border-l border-border',
                    projection.isWeekend && 'bg-muted/30'
                  )}
                >
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
              ))}
            </TableRow>

            {/* Order Quantity */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                Order Quantity
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.day}
                  className={cn(
                    'text-center border-l border-border',
                    projection.isWeekend && 'bg-muted/30'
                  )}
                >
                  {projection.orderAmount > 0 ? (
                    <span className="font-semibold text-primary">
                      {formatNumber(projection.orderAmount)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-6 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted/70"></div>
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
          <div className="flex items-center gap-2">
            <span className="font-semibold">Scroll horizontally →</span>
            <span>to view full projection timeline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
