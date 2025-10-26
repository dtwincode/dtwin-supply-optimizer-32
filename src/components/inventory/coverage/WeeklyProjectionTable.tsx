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
              <TableHead className="sticky left-0 z-20 bg-muted/50 border-r-2 border-border min-w-[160px] font-semibold">
                Metric
              </TableHead>
              {projections.map((projection) => (
                <TableHead
                  key={projection.week}
                  className="text-center min-w-[120px] border-l border-border"
                >
                  <div className="font-semibold">
                    {projection.week === 1 ? 'This Week' : projection.weekLabel}
                  </div>
                  <div className="text-xs font-normal text-muted-foreground">
                    {format(projection.startDate, 'MMM dd')} - {format(projection.endDate, 'MMM dd')}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Start Inventory */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                Start Inventory
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.week}
                  className="text-center border-l border-border font-medium"
                >
                  {formatNumber(projection.startInventory)}
                </TableCell>
              ))}
            </TableRow>

            {/* Total Demand */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                Total Demand
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.week}
                  className="text-center border-l border-border"
                >
                  <span className="text-orange-600 dark:text-orange-500">
                    -{formatNumber(projection.totalDemand)}
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
                  key={projection.week}
                  className="text-center border-l border-border"
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

            {/* End Inventory */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                End Inventory
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.week}
                  className="text-center border-l border-border font-medium"
                >
                  {formatNumber(projection.endInventory)}
                </TableCell>
              ))}
            </TableRow>

            {/* Average NFP (with tooltip) */}
            <TableRow className="hover:bg-muted/30 bg-primary/5">
              <TableCell className="sticky left-0 z-10 bg-primary/10 border-r-2 border-border font-semibold">
                Avg Net Flow Position (NFP)
              </TableCell>
              {projections.map((projection) => (
                <TooltipProvider key={projection.week}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableCell className="text-center border-l border-border cursor-help">
                        <span className={cn(
                          'px-2 py-1 rounded font-bold',
                          getBufferColor(projection.bufferStatus)
                        )}>
                          {formatNumber(projection.avgNFP)}
                        </span>
                      </TableCell>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-semibold">{projection.weekLabel} Daily NFP</div>
                        <div className="text-xs space-y-1">
                          {projection.dailyProjections.map((day) => (
                            <div key={day.day} className="flex justify-between gap-4">
                              <span>{format(day.date, 'EEE MMM dd')}</span>
                              <span className={getBufferColor(day.bufferStatus)}>
                                {formatNumber(day.nfp)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </TableRow>

            {/* Buffer Status */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                Buffer Status
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.week}
                  className="text-center border-l border-border"
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
                  key={projection.week}
                  className="text-center border-l border-border"
                >
                  {projection.launchOrder ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                  )}
                </TableCell>
              ))}
            </TableRow>

            {/* Order Quantity */}
            <TableRow className="hover:bg-muted/30">
              <TableCell className="sticky left-0 z-10 bg-background border-r-2 border-border font-medium">
                Total Order Quantity
              </TableCell>
              {projections.map((projection) => (
                <TableCell
                  key={projection.week}
                  className="text-center border-l border-border"
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

      {/* Summary */}
      <div className="border-t border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-6 text-xs text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-medium">💡 Tip:</span>
            <span>Hover over NFP values to see daily breakdown for each week</span>
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
