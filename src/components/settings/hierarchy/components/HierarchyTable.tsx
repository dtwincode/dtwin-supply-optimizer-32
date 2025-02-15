
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type ReactNode } from 'react';
import { ColumnHeader } from "../types";

interface HierarchyTableProps {
  combinedHeaders: ColumnHeader[];
  selectedColumns: Set<string>;
  currentData: any[];
  filters: Record<string, string>;
  onFilterChange: (column: string, value: string) => void;
  getUniqueValues: (column: string) => string[];
}

export function HierarchyTable({
  combinedHeaders,
  selectedColumns,
  currentData,
  filters,
  onFilterChange,
  getUniqueValues
}: HierarchyTableProps) {
  const SHOW_ALL_VALUE = "__show_all__";

  const getRowKey = (row: any, index: number): string => {
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

  return (
    <div className="relative rounded-md border">
      <ScrollArea className="h-[600px] rounded-md">
        <div className="relative min-w-max">
          <Table>
            <TableHeader>
              <TableRow>
                {combinedHeaders
                  .filter(header => selectedColumns.has(header.column))
                  .map(({ column, sampleData }) => (
                    <TableHead key={column} className="min-w-[200px] sticky top-0 bg-background">
                      <div className="space-y-2 py-2">
                        <div className="font-medium">{column}</div>
                        <Select
                          value={filters[column] || SHOW_ALL_VALUE}
                          onValueChange={(value) => onFilterChange(column, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder={`Filter ${column}...`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={SHOW_ALL_VALUE}>Show all</SelectItem>
                            {getUniqueValues(column).map((value) => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="text-xs text-muted-foreground">
                          Unique values: {getUniqueValues(column).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Example: {sampleData}
                        </div>
                      </div>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, index) => {
                const rowKey = getRowKey(row, index);
                
                return (
                  <TableRow key={rowKey}>
                    {combinedHeaders
                      .filter(header => selectedColumns.has(header.column))
                      .map(({ column }, colIndex) => {
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
  );
}
