
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IntegratedData } from "./types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
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
}

export function IntegratedDataPreviewTable({ 
  data, 
  isLoading, 
  validationStatus 
}: IntegratedDataPreviewTableProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [isStabilized, setIsStabilized] = useState<boolean>(false);
  const [isInitialRender, setIsInitialRender] = useState<boolean>(true);
  const previousDataLength = useRef<number>(0);
  const stabilityTimer = useRef<NodeJS.Timeout | null>(null);

  // More robust stabilization for initial rendering and data changes
  useEffect(() => {
    // Clear any existing timers to prevent multiple timers
    if (stabilityTimer.current) {
      clearTimeout(stabilityTimer.current);
    }

    const currentDataLength = data.length;
    
    // Only set stabilized to true if we have data and the length hasn't changed
    if (currentDataLength > 0 && currentDataLength === previousDataLength.current) {
      stabilityTimer.current = setTimeout(() => {
        setIsStabilized(true);
        setIsInitialRender(false);
      }, 500); // Half second delay for stability
    } else if (currentDataLength > 0) {
      // Data length changed, update reference but wait before stabilizing
      previousDataLength.current = currentDataLength;
      setIsStabilized(false);
      
      stabilityTimer.current = setTimeout(() => {
        setIsStabilized(true);
        setIsInitialRender(false);
      }, 500);
    }

    return () => {
      if (stabilityTimer.current) {
        clearTimeout(stabilityTimer.current);
      }
    };
  }, [data]);

  // Extract historical sales dates from metadata - memoized for performance
  const extractDateFromMetadata = useCallback((row: IntegratedData): string => {
    if (row.metadata && typeof row.metadata === 'object') {
      const metadataObj = row.metadata as Record<string, any>;
      // Look for date fields in metadata
      const dateFields = ['date', 'sales_date', 'transaction_date'];
      for (const field of dateFields) {
        if (metadataObj[field]) {
          return String(metadataObj[field]);
        }
      }
    }
    return row.date || '';
  }, []);

  // Get all possible columns from the data, excluding system columns - stable memoization
  const availableColumns = useMemo(() => {
    if (!data.length) return [];
    
    const columns = new Set<string>();
    const excludedColumns = [
      'id', 
      'metadata', 
      'source_files',
      'created_at',
      'updated_at',
      'validation_status',
      'actual_value'
    ];

    // Add date column first
    columns.add('date');

    // Sample only the first 100 rows for column detection to improve performance
    const sampleSize = Math.min(100, data.length);
    const sampleData = data.slice(0, sampleSize);

    sampleData.forEach(row => {
      if (row.metadata && typeof row.metadata === 'object') {
        Object.keys(row.metadata).forEach(key => {
          if (!excludedColumns.includes(key)) {
            columns.add(key);
          }
        });
      }
      Object.keys(row).forEach(key => {
        if (!excludedColumns.includes(key) && key !== 'date' && key !== 'metadata') {
          columns.add(key);
        }
      });
    });
    return Array.from(columns);
  }, [data.length]); // Only depend on length for stability

  // Get unique values for each column - with improved performance
  const uniqueValues = useMemo(() => {
    const values: Record<string, Set<string>> = {};
    
    if (!data.length || !availableColumns.length || isLoading) {
      return values;
    }
    
    availableColumns.forEach(column => {
      values[column] = new Set();
      
      // Only process a reasonable number of rows for better performance
      const maxRowsToProcess = 100; // Reduced from 1000
      const rowsToProcess = data.slice(0, maxRowsToProcess);
      
      rowsToProcess.forEach(row => {
        if (column === 'date') {
          const dateValue = extractDateFromMetadata(row);
          if (dateValue) {
            values[column].add(dateValue);
          }
        } else {
          const value = row.metadata?.[column] ?? row[column];
          if (value !== undefined && value !== null && value !== '') {
            values[column].add(String(value));
          }
        }
      });
    });
    return values;
  }, [data, availableColumns, extractDateFromMetadata, isLoading]);

  const toggleColumn = useCallback((column: string) => {
    setSelectedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  }, []);

  const handleFilterChange = useCallback((column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value === "all" ? "" : value
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (!data.length || isLoading || !isStabilized) return [];
    
    // If there are no active filters, return a slice of the data directly
    if (Object.keys(filters).every(key => !filters[key])) {
      return data.slice(0, 200); // Always limit to 200 rows to improve performance
    }
    
    // Apply filters to a limited dataset
    return data
      .slice(0, 1000) // Only filter through the first 1000 rows for performance
      .filter(row => {
        return Object.entries(filters).every(([column, filterValue]) => {
          if (!filterValue) return true;
          
          if (column === 'date') {
            const dateValue = extractDateFromMetadata(row);
            return dateValue === filterValue;
          }
          
          const value = row.metadata?.[column] ?? row[column];
          return String(value) === filterValue;
        });
      })
      .slice(0, 200); // Then limit results to 200 rows
  }, [data, filters, extractDateFromMetadata, isLoading, isStabilized]);

  // Show loading indicator while data is being prepared
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show a stable message during initial render or when data is being processed
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

  // Show empty state when there's no data
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
                {column === 'date' ? 'Date' : column}
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
                      <div className="flex items-center justify-between">
                        <span>{column === 'date' ? 'Date' : column}</span>
                        <Select
                          value={filters[column] || "all"}
                          onValueChange={(value) => handleFilterChange(column, value)}
                        >
                          <SelectTrigger className="w-8 h-8 p-0">
                            <SelectValue>
                              <Filter className="h-4 w-4" />
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {Array.from(uniqueValues[column] || [])
                              .filter(value => value !== '')
                              .sort((a, b) => column === 'date' ? b.localeCompare(a) : a.localeCompare(b))
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
                        {column === 'date' ? extractDateFromMetadata(row) : (
                          (() => {
                            const value = row.metadata?.[column] ?? row[column];
                            return typeof value === 'object'
                              ? JSON.stringify(value)
                              : String(value ?? '');
                          })()
                        )}
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
