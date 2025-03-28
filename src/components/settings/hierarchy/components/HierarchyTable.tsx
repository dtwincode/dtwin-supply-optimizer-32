
import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type ReactNode } from 'react';
import { ColumnHeader, TableRowData } from "../types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface HierarchyTableProps {
  data: TableRowData[];
  columns: string[];
  combinedHeaders?: ColumnHeader[];
  selectedColumns?: Set<string>;
}

export function HierarchyTable({
  data = [],
  columns = [],
  combinedHeaders = [],
  selectedColumns = new Set(),
}: HierarchyTableProps) {
  const ROWS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [columnFilters, setColumnFilters] = React.useState<Record<string, Set<string>>>({});

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

  const handleFilterChange = React.useCallback((column: string, value: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[column]) {
        newFilters[column] = new Set([value]);
      } else {
        const newSet = new Set(newFilters[column]);
        if (value === "all") {
          delete newFilters[column];
        } else {
          newSet.clear();
          newSet.add(value);
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
                    const currentFilter = columnFilters[column]?.values().next().value;

                    return (
                      <TableHead key={column} className="min-w-[200px] sticky top-0 bg-background">
                        <div className="space-y-2 py-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{column}</span>
                            <Select
                              value={currentFilter || "all"}
                              onValueChange={(value) => handleFilterChange(column, value)}
                            >
                              <SelectTrigger className="w-[180px] h-8">
                                <SelectValue placeholder="Filter..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Filter {column}</SelectLabel>
                                  <SelectItem value="all">All</SelectItem>
                                  {uniqueValues.map((value) => (
                                    <SelectItem key={value} value={value}>
                                      {value}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
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
          <button
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
