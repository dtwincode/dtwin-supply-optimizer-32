
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
      }, 800); // Increased delay for better stability
    } else if (currentDataLength > 0) {
      // Data length changed, update reference but wait before stabilizing
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

  // Improved function to extract date from various possible locations in the data
  const extractDateFromData = useCallback((row: IntegratedData): string => {
    // Try to get date directly from the row
    if (row.date) {
      return String(row.date);
    }
    
    // Look in metadata for date fields
    if (row.metadata && typeof row.metadata === 'object') {
      const metadataObj = row.metadata as Record<string, any>;
      // Check common date field names
      const dateFields = ['Date', 'date', 'sales_date', 'transaction_date'];
      for (const field of dateFields) {
        if (metadataObj[field]) {
          return String(metadataObj[field]);
        }
      }
    }
    
    return '';
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

    // Include columns based on the selected mapping configuration
    if (selectedMapping && selectedMapping.selected_columns_array && selectedMapping.selected_columns_array.length > 0) {
      // First prioritize mapping-defined columns
      selectedMapping.selected_columns_array.forEach((column: string) => {
        if (!excludedColumns.includes(column)) {
          columns.add(column);
        }
      });
    }
    
    // Make sure we add the date column
    columns.add('date');
    
    // Process all rows to find unique column names in metadata
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
      
      // Add direct row properties excluding system properties
      Object.keys(row).forEach(key => {
        if (!excludedColumns.includes(key) && key !== 'metadata' && key !== 'source_files') {
          columns.add(key);
        }
      });
    });
    
    return Array.from(columns);
  }, [data.length, selectedMapping]);

  // Get unique values for each column - with improved performance
  const uniqueValues = useMemo(() => {
    const values: Record<string, Set<string>> = {};
    
    if (!data.length || !availableColumns.length || isLoading) {
      return values;
    }
    
    availableColumns.forEach(column => {
      values[column] = new Set();
    });
    
    // Process the entire dataset for dates to ensure we capture all unique dates
    if (data.length > 0) {
      data.forEach(row => {
        // Special handling for dates
        const dateValue = extractDateFromData(row);
        if (dateValue) {
          values['date']?.add(dateValue);
        }
        
        // Process other columns only for a subset of rows
        const processRow = (row: IntegratedData) => {
          availableColumns.forEach(column => {
            if (column !== 'date') {
              // Try to get value from metadata first, then from row directly
              const value = row.metadata?.[column] ?? row[column];
              if (value !== undefined && value !== null && value !== '') {
                values[column]?.add(String(value));
              }
            }
          });
        };
        
        // Only process a subset of rows for non-date columns
        if (data.indexOf(row) < 200) { // Limit to first 200 rows for performance
          processRow(row);
        }
      });
    }
    
    return values;
  }, [data, availableColumns, extractDateFromData, isLoading]);

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
      return data.slice(0, 100); // Limit to 100 rows to improve performance
    }
    
    // Apply filters to a limited dataset
    return data
      .slice(0, 1000) // Only filter through the first 1000 rows for performance
      .filter(row => {
        return Object.entries(filters).every(([column, filterValue]) => {
          if (!filterValue) return true;
          
          if (column === 'date') {
            const dateValue = extractDateFromData(row);
            return dateValue === filterValue;
          }
          
          const value = row.metadata?.[column] ?? row[column];
          return String(value) === filterValue;
        });
      })
      .slice(0, 100); // Limit results to 100 rows
  }, [data, filters, extractDateFromData, isLoading, isStabilized]);

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

  // De-duplicate displayed columns
  const dedupedColumns = availableColumns.reduce((acc, col) => {
    const lowerCol = col.toLowerCase();
    if (!acc.some(c => c.toLowerCase() === lowerCol)) {
      acc.push(col);
    }
    return acc;
  }, [] as string[]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <ScrollArea className="h-[600px] w-full">
          <div className="w-[max-content] min-w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {dedupedColumns.map((column) => (
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
                                // Sort dates in descending order, other values alphabetically
                                if (column.toLowerCase() === 'date') {
                                  return new Date(b).getTime() - new Date(a).getTime();
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
                    {dedupedColumns.map((column) => (
                      <TableCell 
                        key={`${row.id || index}-${column}`} 
                        className="min-w-[150px]"
                      >
                        {column.toLowerCase() === 'date' ? extractDateFromData(row) : (
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
