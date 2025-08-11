
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  rows: number;
  columns: number;
}

export function SkeletonTable({ rows, columns }: SkeletonTableProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-12 w-12" />
      </div>
      <div className="border rounded-md">
        <div className="h-12 border-b bg-muted/50 px-4 py-3">
          <div className="flex">
            {Array(columns)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="flex-1">
                  <Skeleton className="h-6 w-full max-w-[120px]" />
                </div>
              ))}
          </div>
        </div>
        <div className="divide-y">
          {Array(rows)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="h-12 px-4 py-3">
                <div className="flex">
                  {Array(columns)
                    .fill(null)
                    .map((_, j) => (
                      <div key={j} className="flex-1">
                        <Skeleton className="h-6 w-full max-w-[120px]" />
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
