
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type ReactNode, useState } from 'react';
import { ColumnHeader, TableRowData } from "../types";
import { Button } from "@/components/ui/button";

interface HierarchyTableProps {
  data: TableRowData[];
  columns: string[];
  combinedHeaders?: ColumnHeader[];
  selectedColumns?: Set<string>;
}

export function HierarchyTable({
  data,
  columns,
  combinedHeaders = [],
  selectedColumns = new Set(columns),
}: HierarchyTableProps) {
  const ROWS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const getRowKey = (row: TableRowData, index: number): string => {
    const id = row.id !== undefined ? String(row.id) : String(index);
    const sku = row.sku !== undefined ? String(row.sku) : '';
    return `row-${id}-${sku}`;
  };

  const getCellKey = (rowKey: string, colIndex: number): string => {
    return `${rowKey}-col-${colIndex}`;
  };

  const renderCell = (value: any): ReactNode => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  // Calculate pagination
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, data.length);
  const currentData = data.slice(startIndex, endIndex);

  return (
    <div className="space-y-4">
      <div className="relative rounded-md border">
        <ScrollArea className="h-[600px] rounded-md">
          <div className="relative min-w-max">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column} className="min-w-[200px] sticky top-0 bg-background">
                      <div className="space-y-2 py-2">
                        <div className="font-medium">{column}</div>
                        <div className="text-xs text-muted-foreground">
                          {combinedHeaders?.find(h => h.column === column)?.sampleData && (
                            <div className="text-xs text-muted-foreground">
                              Example: {combinedHeaders.find(h => h.column === column)?.sampleData}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row, index) => {
                  const rowKey = getRowKey(row, startIndex + index);
                  
                  return (
                    <TableRow key={rowKey}>
                      {columns.map((column, colIndex) => {
                        const cellValue = row[column];
                        return (
                          <TableCell 
                            key={getCellKey(rowKey, colIndex)}
                            className="min-w-[200px]"
                          >
                            {renderCell(cellValue)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {endIndex} of {data.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
