
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IntegratedData } from "./types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";

interface IntegratedDataPreviewTableProps {
  data: IntegratedData[];
  isLoading: boolean;
  validationStatus: 'valid' | 'needs_review' | null;
}

export function IntegratedDataPreviewTable({ 
  data, 
  isLoading, 
  validationStatus 
}: IntegratedDataPreviewTableProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());

  // Get all possible columns from the data, excluding system columns
  const availableColumns = useMemo(() => {
    const columns = new Set<string>();
    const excludedColumns = [
      'id', 
      'metadata', 
      'source_files',
      'created_at',
      'updated_at',
      'validation_status',
      'actual_value',
      'date' // Excluding the incorrect date column
    ];

    data.forEach(row => {
      Object.keys(row).forEach(key => {
        if (!excludedColumns.includes(key)) {
          columns.add(key);
        }
      });
    });
    return Array.from(columns);
  }, [data]);

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No integrated data available
      </div>
    );
  }

  const displayColumns = selectedColumns.size > 0 
    ? Array.from(selectedColumns)
    : availableColumns;

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg bg-background">
        <h4 className="text-sm font-medium mb-3">Select Columns to Display</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {availableColumns.map(column => (
            <div key={column} className="flex items-center space-x-2">
              <Checkbox
                id={`column-${column}`}
                checked={selectedColumns.has(column)}
                onCheckedChange={() => toggleColumn(column)}
              />
              <label
                htmlFor={`column-${column}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {column}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border">
        <ScrollArea className="h-[600px] w-full">
          <div className="w-[max-content] min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {displayColumns.map((column) => (
                    <TableHead key={column} className="min-w-[150px]">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.id || index}>
                    {displayColumns.map((column) => (
                      <TableCell 
                        key={`${row.id || index}-${column}`} 
                        className="min-w-[150px]"
                      >
                        {typeof row[column] === 'object' 
                          ? JSON.stringify(row[column]) 
                          : String(row[column] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
