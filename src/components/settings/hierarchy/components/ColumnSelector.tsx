
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColumnHeader } from "../types";

interface ColumnSelectorProps {
  combinedHeaders: ColumnHeader[];
  selectedColumns: Set<string>;
  onColumnToggle: (column: string) => void;
}

export function ColumnSelector({ 
  combinedHeaders, 
  selectedColumns, 
  onColumnToggle 
}: ColumnSelectorProps) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-3">Column Selection</h4>
      <ScrollArea className="h-[120px] w-full rounded-md border p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {combinedHeaders.map(({ column }) => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox 
                id={`column-${column}`}
                checked={selectedColumns.has(column)}
                onCheckedChange={() => onColumnToggle(column)}
              />
              <label 
                htmlFor={`column-${column}`}
                className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              >
                {column}
              </label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
