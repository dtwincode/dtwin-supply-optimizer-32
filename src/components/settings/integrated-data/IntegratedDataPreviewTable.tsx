import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IntegratedData } from "./types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface IntegratedDataPreviewTableProps {
  data: IntegratedData[];
  isLoading: boolean;
  validationStatus: 'valid' | 'needs_review' | null;
  selectedMapping?: any;
}

export function IntegratedDataPreviewTable({ 
  data, 
  isLoading, 
  validationStatus,
  selectedMapping
}: IntegratedDataPreviewTableProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isStabilized, setIsStabilized] = useState<boolean>(false);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const previousDataLength = useRef<number>(0);
  const stabilityTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (stabilityTimer.current) {
      clearTimeout(stabilityTimer.current);
    }

    const currentDataLength = data.length;
    
    if (currentDataLength > 0 && currentDataLength === previousDataLength.current) {
      stabilityTimer.current = setTimeout(() => {
        setIsStabilized(true);
        setIsInitialRender(false);
      }, 800);
    } else if (currentDataLength > 0) {
      previousDataLength.current = currentDataLength;
      setIsStabilized(false);
      
      stabilityTimer.current = setTimeout(() => {
        setIsStabilized(true);
        setIsInitialRender(false);
      }, 800);
    }

    return () => {
      if (stabilityTimer.current) {
        clearTimeout(stabilityTimer.current);
      }
    };
  }, [data]);

  const extractDateColumns = useCallback((data: IntegratedData[]): Record<string, Set<string>> => {
    const dateColumns: Record<string, Set<string>> = {};
    
    if (data.length === 0) return dateColumns;
    
    const sampleRow = data[0];
    const potentialDateColumns: string[] = [];
    
    Object.keys(sampleRow).forEach(key => {
      if (key.toLowerCase().includes('date')) {
        potentialDateColumns.push(key);
      }
    });
    
    if (sampleRow.metadata && typeof sampleRow.metadata === 'object') {
      Object.keys(sampleRow.metadata).forEach(key => {
        if (key.toLowerCase().includes('date')) {
          potentialDateColumns.push(key);
        }
      });
    }
    
    if (!potentialDateColumns.includes('date')) {
      potentialDateColumns.push('date');
    }
    
    potentialDateColumns.forEach(col => {
      dateColumns[col] = new Set<string>();
    });
    
    data.forEach(row => {
      potentialDateColumns.forEach(col => {
        let dateValue: string | null = null;
        
        if (row[col] !== undefined) {
          dateValue = String(row[col]);
        } 
        else if (row.metadata && row.metadata[col] !== undefined) {
          dateValue = String(row.metadata[col]);
        }
        
        if (dateValue && dateValue.trim() !== '') {
          try {
            if (dateValue.match(/^\d{4}-\d{2}-\d{2}/)) {
              dateColumns[col].add(dateValue.split('T')[0]);
            } 
            else if (!isNaN(Number(dateValue))) {
              const date = new Date(Number(dateValue));
              if (!isNaN(date.getTime())) {
                dateColumns[col].add(date.toISOString().split('T')[0]);
              } else {
                dateColumns[col].add(dateValue);
              }
            } 
            else {
              dateColumns[col].add(dateValue);
            }
          } catch (e) {
            dateColumns[col].add(dateValue);
          }
        }
      });
    });
    
    return dateColumns;
  }, []);

  const uniqueValues = useMemo(() => {
    const values: Record<string, Set<string>> = {};
    
    if (!data.length || isLoading) {
      return values;
    }
    
    const allColumns = new Set<string>();
    const excludedColumns = ['id', 'source_files', 'created_at', 'updated_at', 'validation_status'];
    
    data.slice(0, 100).forEach(row => {
      Object.keys(row).forEach(key => {
        if (!excludedColumns.includes(key)) {
          allColumns.add(key);
        }
      });
      
      if (row.metadata && typeof row.metadata === 'object') {
        Object.keys(row.metadata).forEach(key => {
          if (!excludedColumns.includes(key)) {
            allColumns.add(key);
          }
        });
      }
    });
    
    allColumns.forEach(column => {
      values[column] = new Set<string>();
    });
    
    data.forEach(row => {
      allColumns.forEach(column => {
        let value;
        
        if (row[column] !== undefined) {
          value = row[column];
        } 
        else if (row.metadata && row.metadata[column] !== undefined) {
          value = row.metadata[column];
        }
        
        if (value !== undefined && value !== null && value !== '') {
          values[column].add(String(value));
        }
      });
    });
    
    const dateColumns = extractDateColumns(data);
    Object.entries(dateColumns).forEach(([column, dateValues]) => {
      if (values[column]) {
        dateValues.forEach(value => values[column].add(value));
      } else {
        values[column] = dateValues;
      }
    });
    
    return values;
  }, [data, isLoading, extractDateColumns]);

  const handleFilterChange = useCallback((column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value === "all" ? "" : value
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (!data.length || isLoading || !isStabilized) return [];
    
    if (Object.keys(filters).every(key => !filters[key])) {
      return data.slice(0, 100);
    }
    
    return data
      .slice(0, 1000)
      .filter(row => {
        return Object.entries(filters).every(([column, filterValue]) => {
          if (!filterValue) return true;
          
          if (row[column] !== undefined) {
            return String(row[column]) === filterValue;
          }
          
          if (row.metadata && row.metadata[column] !== undefined) {
            return String(row.metadata[column]) === filterValue;
          }
          
          return false;
        });
      })
      .slice(0, 100);
  }, [data, filters, isLoading, isStabilized]);

  const displayColumns = useMemo(() => {
    if (!data.length) return [];
    
    const columns = new Set<string>();
    const priorityColumns = ['date', 'sku', 'actual_value'];
    const excludedColumns = ['id', 'source_files', 'created_at', 'updated_at', 'validation_status'];
    
    priorityColumns.forEach(col => {
      columns.add(col);
    });
    
    Object.keys(uniqueValues).forEach(key => {
      if (key.toLowerCase().includes('date') && !columns.has(key)) {
        columns.add(key);
      }
    });
    
    if (selectedMapping && selectedMapping.selected_columns_array) {
      selectedMapping.selected_columns_array.forEach((col: string) => {
        if (!excludedColumns.includes(col) && !columns.has(col)) {
          columns.add(col);
        }
      });
    }
    
    Object.keys(uniqueValues).forEach(key => {
      if (!excludedColumns.includes(key) && !columns.has(key)) {
        columns.add(key);
      }
    });
    
    return Array.from(columns);
  }, [data, uniqueValues, selectedMapping]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isInitialRender || (!isStabilized && data.length > 0)) {
    return (
      <div className="text-center py-8 bg-background border rounded-lg">
        <div className="animate-pulse flex flex-col items-center justify-center space-y-2">
          <div className="h-4 w-32 bg-muted rounded"></div>
          <div className="text-sm text-muted-foreground">Processing data...</div>
        </div>
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

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <ScrollArea className="h-[600px] w-full">
          <div className="w-[max-content] min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {displayColumns.map((column) => (
                    <TableHead key={column} className="min-w-[150px]">
                      <div className="flex items-center justify-between">
                        <span>{column}</span>
                        <Select
                          value={filters[column] || "all"}
                          onValueChange={(value) => handleFilterChange(column, value)}
                        >
                          <SelectTrigger className="w-8 h-8 p-0">
                            <SelectValue>
                              <Filter className="h-4 w-4" />
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="all">All</SelectItem>
                            {Array.from(uniqueValues[column] || [])
                              .filter(value => value !== '')
                              .sort((a, b) => {
                                if (column.toLowerCase().includes('date')) {
                                  const dateA = new Date(a);
                                  const dateB = new Date(b);
                                  if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
                                    return dateB.getTime() - dateA.getTime();
                                  }
                                }
                                return a.localeCompare(b);
                              })
                              .map((value) => (
                                <SelectItem key={value} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={row.id || index}>
                    {displayColumns.map((column) => (
                      <TableCell 
                        key={`${row.id || index}-${column}`} 
                        className="min-w-[150px]"
                      >
                        {(() => {
                          if (row[column] !== undefined) {
                            const value = row[column];
                            return typeof value === 'object'
                              ? JSON.stringify(value)
                              : String(value);
                          }
                          
                          if (row.metadata && row.metadata[column] !== undefined) {
                            const value = row.metadata[column];
                            return typeof value === 'object'
                              ? JSON.stringify(value)
                              : String(value);
                          }
                          
                          return '';
                        })()}
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
