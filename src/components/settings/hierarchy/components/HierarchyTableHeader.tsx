
interface HierarchyTableHeaderProps {
  startIndex?: number;
  endIndex?: number;
  totalItems: number;
  onPageChange?: (page: number) => void;
  currentPage?: number;
}

export function HierarchyTableHeader({ 
  startIndex = 0,
  endIndex,
  totalItems,
  onPageChange,
  currentPage = 1
}: HierarchyTableHeaderProps) {
  return (
    <div className="flex flex-col">
      <h3 className="text-2xl font-bold tracking-tight mb-2">Data Preview</h3>
      <p className="text-lg text-muted-foreground">
        Showing {startIndex + 1} to {Math.min(endIndex || totalItems, totalItems)} of {totalItems} rows
      </p>
    </div>
  );
}
