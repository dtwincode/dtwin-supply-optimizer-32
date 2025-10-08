import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-40" />
        <div className="flex gap-1">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-8 flex-1" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function TableSkeleton({ rows = 5, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3 animate-fade-in">
      {/* Header */}
      <div className="flex gap-4 border-b pb-3">
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4">
          {[...Array(columns)].map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
      
      {/* Table */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <TableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
