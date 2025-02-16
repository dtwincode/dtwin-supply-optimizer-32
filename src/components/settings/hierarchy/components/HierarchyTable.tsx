
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type ReactNode, useMemo } from 'react';
import { ColumnHeader, TableRowData } from "../types";

interface HierarchyTableProps {
  data: TableRowData[];
  columns: string[];
  combinedHeaders?: ColumnHeader[];
  selectedColumns?: Set<string>;
  filters?: Record<string, string>;
  onFilterChange?: (column: string, value: string) => void;
}

export function HierarchyTable({
  data,
  columns,
  combinedHeaders = [],
  selectedColumns = new Set(columns),
  filters = {},
  onFilterChange = () => {}
}: HierarchyTableProps) {
  const SHOW_ALL_VALUE = "__show_all__";

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

  // Memoize the unique values calculation to prevent infinite recursion
  const uniqueValuesByColumn = useMemo(() => {
    const result: Record<string, string[]> = {};
    columns.forEach(column => {
      const values = new Set<string>();
      data.forEach(row => {
        if (row[column] !== null && row[column] !== undefined) {
          values.add(String(row[column]));
        }
      });
      result[column] = Array.from(values).sort();
    });
    return result;
  }, [data, columns]);

  return (
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
                      <Select
                        value={filters[column] || SHOW_ALL_VALUE}
                        onValueChange={(value) => onFilterChange(column, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Filter ${column}...`} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={SHOW_ALL_VALUE}>Show all</SelectItem>
                          {uniqueValuesByColumn[column]?.map((value) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-xs text-muted-foreground">
                        Unique values: {uniqueValuesByColumn[column]?.length || 0}
                      </div>
                      {combinedHeaders?.find(h => h.column === column)?.sampleData && (
                        <div className="text-xs text-muted-foreground">
                          Example: {combinedHeaders.find(h => h.column === column)?.sampleData}
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => {
                const rowKey = getRowKey(row, index);
                
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
  );
}
