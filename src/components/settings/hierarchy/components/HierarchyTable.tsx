
import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type ReactNode } from 'react';
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
  data = [], // Provide default empty array
  columns,
  combinedHeaders = [],
  selectedColumns = new Set(columns),
}: HierarchyTableProps) {
  const ROWS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [columnFilters, setColumnFilters] = React.useState<Record<string, Set<string>>>({});
  const [open, setOpen] = React.useState<Record<string, boolean>>({});

  const getRowKey = (row: TableRowData, index: number): string => {
    const id = row?.id !== undefined ? String(row.id) : String(index);
    const sku = row?.sku !== undefined ? String(row.sku) : '';
    return `row-${id}-${sku}`;
  };

  const getCellKey = (rowKey: string, colIndex: number): string => {
    return `${rowKey}-col-${colIndex}`;
  };

  const renderCell = (value: any): ReactNode => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const getUniqueValues = React.useCallback((column: string): string[] => {
    if (!Array.isArray(data) || !column) return [];
    
    try {
      const values = new Set<string>();
      data.forEach(row => {
        if (!row || typeof row !== 'object') return;
        
        const value = row[column];
        if (value !== null && value !== undefined) {
          values.add(String(value));
        }
      });
      
      return Array.from(values).sort();
    } catch (error) {
      console.error('Error getting unique values:', error);
      return [];
    }
  }, [data]);

  const filteredData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    return data.filter(row => {
      if (!row || typeof row !== 'object') return false;
      
      return Object.entries(columnFilters).every(([column, selectedValues]) => {
        if (!selectedValues || !selectedValues.size) return true;
        const value = row[column];
        if (value === null || value === undefined) return false;
        return selectedValues.has(String(value));
      });
    });
  }, [data, columnFilters]);

  const toggleFilter = React.useCallback((column: string, value: string) => {
    if (!column || value === undefined) return;
    
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
        if (newSet.size === 0) {
          delete newFilters[column];
        } else {
          newFilters[column] = newSet;
        }
      }
      return newFilters;
    });
  }, []);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / ROWS_PER_PAGE));
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, filteredData.length);
  const currentData = filteredData.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [columnFilters]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-md border">
        <ScrollArea className="h-[600px] rounded-md">
          <div className="relative min-w-max">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => {
                    const uniqueValues = getUniqueValues(column);
                    const hasFilters = columnFilters[column]?.size > 0;

                    return (
                      <TableHead key={column} className="min-w-[200px] sticky top-0 bg-background">
                        <div className="space-y-2 py-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{column}</span>
                            <Popover 
                              open={open[column]} 
                              onOpenChange={(isOpen) => {
                                setOpen(prev => ({ ...prev, [column]: isOpen }));
                              }}
                            >
                              <PopoverTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className={cn(
                                    "ml-2 h-8 px-2 lg:px-3",
                                    hasFilters ? "bg-primary/20 hover:bg-primary/20" : ""
                                  )}
                                >
                                  <Filter className="h-4 w-4 mr-2" />
                                  <span className="hidden lg:inline">Filter</span>
                                  {hasFilters && (
                                    <span className="ml-1 rounded-full bg-primary w-4 h-4 text-[10px] flex items-center justify-center text-primary-foreground">
                                      {columnFilters[column].size}
                                    </span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0" align="start">
                                <Command shouldFilter={false}>
                                  <CommandEmpty>No values found.</CommandEmpty>
                                  <CommandGroup heading="Select values">
                                    {uniqueValues.map((value) => {
                                      const isSelected = columnFilters[column]?.has(value) || false;
                                      return (
                                        <CommandItem
                                          key={value}
                                          onSelect={() => {
                                            toggleFilter(column, value);
                                          }}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div className={cn(
                                              "h-4 w-4 border rounded-sm flex items-center justify-center",
                                              isSelected ? "bg-primary border-primary" : "border-input"
                                            )}>
                                              {isSelected && (
                                                <Check className="h-3 w-3 text-primary-foreground" />
                                              )}
                                            </div>
                                            <span>{value}</span>
                                          </div>
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                          {combinedHeaders?.find(h => h.column === column)?.sampleData && (
                            <div className="text-xs text-muted-foreground">
                              Example: {combinedHeaders.find(h => h.column === column)?.sampleData}
                            </div>
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
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
