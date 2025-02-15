import { useState, useEffect, useMemo, type ReactNode, Key } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ColumnHeader {
  column: string;
  sampleData: string;
}

interface HierarchyTableViewProps {
  tableName: string;
  data: Record<string, any>[];
  columns: string[];
  combinedHeaders: ColumnHeader[];
}

type HierarchyLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8';

interface ColumnMapping {
  column: string;
  level: HierarchyLevel | null;
}

interface Filters {
  [key: string]: string;
}

interface TableRowData {
  id?: string | number;
  sku?: string | number;
  [key: string]: string | number | boolean | null | undefined;
}

const SHOW_ALL_VALUE = "__show_all__";
const ROWS_PER_PAGE = 50;
const BATCH_SIZE = 1000;

export function HierarchyTableView({ 
  tableName, 
  data, 
  columns,
  combinedHeaders = []
}: HierarchyTableViewProps) {
  const { toast } = useToast();
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const queryClient = useQueryClient();
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(columns));
  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueValuesMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const sampleSize = Math.min(1000, data.length);
    
    columns.forEach(column => {
      const values = new Set<string>();
      for (let i = 0; i < sampleSize; i++) {
        const row = data[i];
        if (row && row[column] !== null && row[column] !== undefined) {
          values.add(String(row[column]));
        }
      }
      map.set(column, values);
    });
    return map;
  }, [data, columns]);

  const getUniqueValues = (column: string) => {
    return Array.from(uniqueValuesMap.get(column) || new Set()).sort();
  };

  const processDataInBatches = (data: TableRowData[], filters: Filters) => {
    const results: TableRowData[] = [];
    const totalItems = data.length;
    
    for (let i = 0; i < totalItems; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);
      const filteredBatch = batch.filter(row => {
        return Object.entries(filters).every(([column, filterValue]) => {
          if (!filterValue || filterValue === SHOW_ALL_VALUE) return true;
          const cellValue = String(row[column] || '');
          return cellValue === filterValue;
        });
      });
      results.push(...filteredBatch);
    }
    
    return results;
  };

  const { data: existingMappings, isLoading } = useQuery({
    queryKey: ['hierarchyMappings', tableName],
    queryFn: async () => {
      console.log('Fetching mappings for table:', tableName);
      const { data, error } = await supabase
        .from('hierarchy_column_mappings')
        .select('*')
        .eq('table_name', tableName);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    if (!isLoading && existingMappings) {
      const initialMappings = combinedHeaders.map(header => ({
        column: header.column,
        level: existingMappings.find(m => m.column_name === header.column)?.hierarchy_level || null
      }));
      setMappings(initialMappings);
    }
  }, [combinedHeaders, existingMappings, isLoading]);

  const handleLevelChange = (column: string, level: HierarchyLevel | 'none') => {
    setMappings(prev => 
      prev.map(mapping => 
        mapping.column === column 
          ? { ...mapping, level: level === 'none' ? null : level } 
          : mapping
      )
    );
  };

  const filteredData = useMemo(() => {
    return processDataInBatches(data, filters);
  }, [data, filters]);

  const {
    totalPages,
    startIndex,
    endIndex,
    currentData
  } = useMemo(() => {
    const total = Math.ceil(filteredData.length / ROWS_PER_PAGE);
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;
    return {
      totalPages: total,
      startIndex: start,
      endIndex: end,
      currentData: filteredData.slice(start, end) as HierarchyTableData[]
    };
  }, [filteredData, currentPage]);

  const getRowKey = (row: HierarchyTableData, index: number): string => {
    const id = row.id !== undefined ? String(row.id) : String(index);
    const sku = row.sku !== undefined ? String(row.sku) : '';
    return `row-${id}-${sku}`;
  };

  const getCellKey = (rowKey: string, colIndex: number): string => {
    return `${rowKey}-col-${colIndex}`;
  };

  const renderCell = (value: string | number | boolean | null | undefined): ReactNode => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const handleColumnToggle = (column: string) => {
    const newSelectedColumns = new Set(selectedColumns);
    if (newSelectedColumns.has(column)) {
      newSelectedColumns.delete(column);
    } else {
      newSelectedColumns.add(column);
    }
    setSelectedColumns(newSelectedColumns);

    const previewKey = `${tableName}Preview`.replace('_', '') as 'locationHierarchyPreview' | 'productHierarchyPreview';
    const currentPreview = queryClient.getQueryData([previewKey]) as any;
    if (currentPreview) {
      const filteredData = data.map(row => {
        const newRow: any = {};
        Array.from(newSelectedColumns).forEach(col => {
          newRow[col] = row[col];
        });
        return newRow;
      });

      const filteredHeaders = combinedHeaders.filter(header => 
        newSelectedColumns.has(header.column)
      );

      queryClient.setQueryData([previewKey], {
        ...currentPreview,
        columns: Array.from(newSelectedColumns),
        previewData: filteredData,
        combinedHeaders: filteredHeaders
      });
    }
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value === SHOW_ALL_VALUE ? '' : value
    }));
  };

  const handleSave = async () => {
    try {
      const validMappings = mappings.filter((m): m is ColumnMapping & { level: HierarchyLevel } => m.level !== null);
      
      const { error: deleteError } = await supabase
        .from('hierarchy_column_mappings')
        .delete()
        .eq('table_name', tableName);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('hierarchy_column_mappings')
        .insert(
          validMappings.map(m => ({
            table_name: tableName,
            column_name: m.column,
            hierarchy_level: m.level
          }))
        );

      if (insertError) throw insertError;

      await queryClient.invalidateQueries({
        queryKey: ['hierarchyMappings', tableName]
      });

      toast({
        title: "Success",
        description: "Column mappings saved successfully",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save column mappings",
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Data Preview</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} rows
                </p>
              </div>
              <Button
                onClick={handleSave}
                className="ml-auto"
              >
                Save Mappings
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h4 className="text-sm font-medium mb-3">Column Selection</h4>
              <ScrollArea className="h-[120px] w-full rounded-md border p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {combinedHeaders.map(({ column }) => (
                    <div key={column} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`column-${column}`}
                        checked={selectedColumns.has(column)}
                        onCheckedChange={() => handleColumnToggle(column)}
                      />
                      <label 
                        htmlFor={`column-${column}`}
                        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                      >
                        {column}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <Select
                  value={ROWS_PER_PAGE.toString()}
                  onValueChange={(value) => {
                    const newRowsPerPage = parseInt(value);
                    if (!isNaN(newRowsPerPage)) {
                      setCurrentPage(1);
                    }
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rows per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25 rows per page</SelectItem>
                    <SelectItem value="50">50 rows per page</SelectItem>
                    <SelectItem value="100">100 rows per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
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
                                    onValueChange={(value) => handleLevelChange(column, value as HierarchyLevel | 'none')}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                      {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'].map((level) => (
                                        <SelectItem key={level} value={level}>
                                          {level}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Select
                                    value={filters[column] || SHOW_ALL_VALUE}
                                    onValueChange={(value) => handleFilterChange(column, value)}
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
                {filteredData.length === 0 && (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No results found for the current filters
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
