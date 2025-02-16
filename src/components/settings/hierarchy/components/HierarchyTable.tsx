
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type ReactNode, useState } from 'react';
import { ColumnHeader, TableRowData } from "../types";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, Filter } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

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
  const [columnFilters, setColumnFilters] = useState<Record<string, Set<string>>>({});

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

  // Get unique values for a column
  const getUniqueValues = (column: string): string[] => {
    const values = new Set<string>();
    data.forEach(row => {
      const value = row[column];
      if (value !== null && value !== undefined) {
        values.add(String(value));
      }
    });
    return Array.from(values).sort();
  };

  // Filter data based on selected values
  const filteredData = data.filter(row => {
    return Object.entries(columnFilters).every(([column, selectedValues]) => {
      if (selectedValues.size === 0) return true;
      return selectedValues.has(String(row[column]));
    });
  });

  // Toggle filter value
  const toggleFilter = (column: string, value: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[column]) {
        newFilters[column] = new Set([value]);
      } else {
        const newSet = new Set(newFilters[column]);
        if (newSet.has(value)) {
          newSet.delete(value);
        } else {
          newSet.add(value);
        }
        newFilters[column] = newSet;
      }
      return newFilters;
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, filteredData.length);
  const currentData = filteredData.slice(startIndex, endIndex);

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
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{column}</span>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className={cn(
                                  "h-8 w-8 p-0",
                                  columnFilters[column]?.size ? "text-primary" : "text-muted-foreground"
                                )}
                              >
                                <Filter className="h-4 w-4" />
                                {columnFilters[column]?.size > 0 && (
                                  <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground">
                                    {columnFilters[column].size}
                                  </span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0" align="start">
                              <Command>
                                <CommandEmpty>No values found.</CommandEmpty>
                                <CommandGroup>
                                  {getUniqueValues(column).map((value) => (
                                    <CommandItem
                                      key={value}
                                      onSelect={() => toggleFilter(column, value)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={cn(
                                          "h-4 w-4 border rounded-sm flex items-center justify-center",
                                          columnFilters[column]?.has(value) ? "bg-primary border-primary" : "border-input"
                                        )}>
                                          {columnFilters[column]?.has(value) && (
                                            <Check className="h-3 w-3 text-primary-foreground" />
                                          )}
                                        </div>
                                        <span>{value}</span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
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
          Showing {startIndex + 1} to {endIndex} of {filteredData.length} entries
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
