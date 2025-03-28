
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
import { Filter, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [errorState, setErrorState] = useState<string | null>(null);
  const previousDataLength = useRef<number>(0);
  const stabilityTimer = useRef<NodeJS.Timeout | null>(null);

  // More robust stabilization for initial rendering and data changes
  useEffect(() => {
    // Clear any existing timers to prevent multiple timers
    if (stabilityTimer.current) {
      clearTimeout(stabilityTimer.current);
    }

    try {
      const currentDataLength = data?.length || 0;
      
      // Reset error state on new data
      setErrorState(null);
      
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
    } catch (error) {
      console.error("Error in table stabilization:", error);
      setErrorState("An error occurred while preparing the data view");
    }

    return () => {
      if (stabilityTimer.current) {
        clearTimeout(stabilityTimer.current);
      }
    };
  }, [data]);

  // Extract historical sales dates from metadata - memoized for performance
  const extractDateFromMetadata = useCallback((row: IntegratedData): string => {
    try {
      if (row.metadata && typeof row.metadata === 'object') {
        const metadataObj = row.metadata as Record<string, any>;
        // Look for date fields in metadata
        const dateFields = ['Date', 'date', 'sales_date', 'transaction_date'];
        for (const field of dateFields) {
          if (metadataObj[field]) {
            return String(metadataObj[field]);
          }
        }
      }
      return row.date || '';
    } catch (error) {
      console.error("Error extracting date:", error);
      return '';
    }
  }, []);

  // Get all possible columns from the data, excluding system columns - stable memoization
  const availableColumns = useMemo(() => {
    if (!data || !data.length) return [];
    
    try {
      const columns = new Set<string>();
      const excludedColumns = [
        'id', 
        'metadata', 
        'source_files',
        'created_at',
        'updated_at',
        'validation_status',
        'actual_value',
        'sku' // Exclude sku if it's not explicitly part of the selected mapping
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
      
      // Process all rows to find unique column names
      const sampleSize = Math.min(100, data.length);
      const sampleData = data.slice(0, sampleSize);

      sampleData.forEach(row => {
        if (row && row.metadata && typeof row.metadata === 'object') {
          Object.keys(row.metadata).forEach(key => {
            if (!excludedColumns.includes(key)) {
              columns.add(key);
            }
          });
        }
        
        // Add direct row properties excluding system properties
        if (row) {
          Object.keys(row).forEach(key => {
            if (!excludedColumns.includes(key) && key !== 'metadata' && key !== 'source_files') {
              columns.add(key);
            }
          });
        }
      });
      
      // Make sure we don't have duplicates, and add 'date' if it doesn't exist
      if (!columns.has('date') && !columns.has('Date')) {
        columns.add('date');
      }
      
      return Array.from(columns);
    } catch (error) {
      console.error("Error getting columns:", error);
      setErrorState("Error extracting columns from data");
      return [];
    }
  }, [data, selectedMapping]);

  // Get unique values for each column - with improved performance
  const uniqueValues = useMemo(() => {
    const values: Record<string, Set<string>> = {};
    
    if (!data || !data.length || !availableColumns.length || isLoading) {
      return values;
    }
    
    try {
      availableColumns.forEach(column => {
        values[column] = new Set();
        
        // Only process a reasonable number of rows for better performance
        const maxRowsToProcess = 100;
        const rowsToProcess = data.slice(0, maxRowsToProcess);
        
        rowsToProcess.forEach(row => {
          if (column === 'date' || column === 'Date') {
            const dateValue = extractDateFromMetadata(row);
            if (dateValue) {
              values[column].add(dateValue);
            }
          } else {
            // Try to get value from metadata first, then from row directly
            const value = row.metadata?.[column] ?? row[column];
            if (value !== undefined && value !== null && value !== '') {
              values[column].add(String(value));
            }
          }
        });
      });
      return values;
    } catch (error) {
      console.error("Error getting unique values:", error);
      setErrorState("Error processing data values");
      return values;
    }
  }, [data, availableColumns, extractDateFromMetadata, isLoading]);

  const handleFilterChange = useCallback((column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value === "all" ? "" : value
    }));
  }, []);

  const filteredData = useMemo(() => {
    if (!data || !data.length || isLoading || !isStabilized) return [];
    
    try {
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
            
            if (column === 'date' || column === 'Date') {
              const dateValue = extractDateFromMetadata(row);
              return dateValue === filterValue;
            }
            
            const value = row.metadata?.[column] ?? row[column];
            return String(value) === filterValue;
          });
        })
        .slice(0, 100); // Limit results to 100 rows
    } catch (error) {
      console.error("Error filtering data:", error);
      setErrorState("Error filtering data");
      return [];
    }
  }, [data, filters, extractDateFromMetadata, isLoading, isStabilized]);

  // Show loading indicator while data is being prepared
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show error state if we encountered problems
  if (errorState) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>{errorState}</AlertDescription>
      </Alert>
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
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <div className="text-muted-foreground">
          No integrated data available
        </div>
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
                    <TableHead key={column} className="min-w-[150px] bg-muted/50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{column}</span>
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
                              .sort((a, b) => column.toLowerCase().includes('date') ? b.localeCompare(a) : a.localeCompare(b))
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
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={dedupedColumns.length} className="h-24 text-center">
                      No results match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row, index) => (
                    <TableRow key={row.id || index}>
                      {dedupedColumns.map((column) => (
                        <TableCell 
                          key={`${row.id || index}-${column}`} 
                          className="min-w-[150px]"
                        >
                          {column.toLowerCase() === 'date' || column === 'Date' ? extractDateFromMetadata(row) : (
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      
      <div className="text-xs text-muted-foreground text-right">
        Showing {filteredData.length} of {data.length} records
      </div>
    </div>
  );
}
