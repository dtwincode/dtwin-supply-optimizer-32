
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type ReactNode } from 'react';
import { ColumnHeader } from "../types";

interface HierarchyTableProps {
  combinedHeaders: ColumnHeader[];
  selectedColumns: Set<string>;
  currentData: any[];
  mappings: { column: string; level: string | null }[];
  onLevelChange: (column: string, level: string) => void;
  filters: Record<string, string>;
  onFilterChange: (column: string, value: string) => void;
  getUniqueValues: (column: string) => string[];
}

const generateHierarchyLevels = () => {
  const levels: string[] = [];
  
  // Main levels (1-8)
  for (let i = 1; i <= 8; i++) {
    levels.push(`${i}.00`); // Main level
    // Sub-levels (1-99 for each main level)
    for (let j = 1; j <= 99; j++) {
      levels.push(`${i}.${j.toString().padStart(2, '0')}`);
    }
  }
  
  return levels;
};

export function HierarchyTable({
  combinedHeaders,
  selectedColumns,
  currentData,
  mappings,
  onLevelChange,
  filters,
  onFilterChange,
  getUniqueValues
}: HierarchyTableProps) {
  const SHOW_ALL_VALUE = "__show_all__";
  const hierarchyLevels = generateHierarchyLevels();

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

  const formatLevelDisplay = (level: string) => {
    if (level === 'none') return 'None';
    const [main, sub] = level.split('.');
    if (sub === '00') return `Level ${main}`;
    return `Level ${main}.${sub}`;
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
                          value={mappings.find(m => m.column === column)?.level || 'none'}
                          onValueChange={(value) => onLevelChange(column, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {hierarchyLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {formatLevelDisplay(level)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
