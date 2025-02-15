import { useState, useEffect, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { HierarchyTableHeader } from "./components/HierarchyTableHeader";
import { ColumnSelector } from "./components/ColumnSelector";
import { Pagination } from "./components/Pagination";
import { HierarchyTable } from "./components/HierarchyTable";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { HierarchyTableViewProps, ColumnMapping, TableRowData } from "./types";

const SHOW_ALL_VALUE = "__show_all__";
const ROWS_PER_PAGE = 50;
const BATCH_SIZE = 1000;

export function HierarchyTableView({ 
  tableName, 
  data, 
  columns,
  combinedHeaders = []
}: HierarchyTableViewProps) {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<TableRowData[]>(data);
  const [isSavingSelections, setIsSavingSelections] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const { data: existingMappings, isLoading: isMappingsLoading } = useQuery({
    queryKey: ['hierarchyMappings', tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_column_mappings')
        .select('*')
        .eq('table_name', tableName);

      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  const { data: columnSelections, isLoading: isSelectionsLoading } = useQuery({
    queryKey: ['columnSelections', tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_column_selections')
        .select('selected_columns')
        .eq('table_name', tableName)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (!isMappingsLoading && !isSelectionsLoading && !isInitialized) {
      if (existingMappings) {
        const initialMappings = combinedHeaders.map(header => ({
          column: header.column,
          level: existingMappings.find(m => m.column_name === header.column)?.hierarchy_level?.toString() || null
        }));
        setMappings(initialMappings);
      }

      if (columnSelections?.selected_columns) {
        setSelectedColumns(new Set(columnSelections.selected_columns));
      } else {
        setSelectedColumns(new Set(columns));
      }

      setIsInitialized(true);
    }
  }, [
    combinedHeaders,
    existingMappings,
    isMappingsLoading,
    columnSelections,
    columns,
    isSelectionsLoading,
    isInitialized
  ]);

  const handleSaveConfiguration = async () => {
    setIsSavingSelections(true);
    try {
      const mappingsJson = JSON.stringify(
        mappings
          .filter(m => m.level !== null)
          .map(m => ({
            column: m.column,
            level: m.level
          }))
      );

      const { error } = await supabase.rpc(
        'process_hierarchy_configuration',
        {
          p_table_name: tableName,
          p_selected_columns: Array.from(selectedColumns),
          p_mappings: mappingsJson
        }
      );

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['hierarchyMappings', tableName] });
      queryClient.invalidateQueries({ queryKey: ['columnSelections', tableName] });

      toast({
        title: "Success",
        description: "Hierarchy configuration saved successfully",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save hierarchy configuration",
      });
    } finally {
      setIsSavingSelections(false);
    }
  };

  const handleLevelChange = (column: string, level: string) => {
    setMappings(prev => 
      prev.map(mapping => 
        mapping.column === column 
          ? { ...mapping, level: level === 'none' ? null : level } 
          : mapping
      )
    );
  };

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value === SHOW_ALL_VALUE ? '' : value
    }));
  };

  const processDataInBatches = (data: TableRowData[], filters: Record<string, string>) => {
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

  const filteredData = useMemo(() => {
    return processDataInBatches(tableData, filters);
  }, [tableData, filters]);

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
      currentData: filteredData.slice(start, end)
    };
  }, [filteredData, currentPage]);

  const handleColumnToggle = (column: string) => {
    const newSelectedColumns = new Set(selectedColumns);
    if (newSelectedColumns.has(column)) {
      newSelectedColumns.delete(column);
      setMappings(prev => 
        prev.map(mapping => 
          mapping.column === column 
            ? { ...mapping, level: null } 
            : mapping
        )
      );
    } else {
      newSelectedColumns.add(column);
    }
    setSelectedColumns(newSelectedColumns);
  };

  const getUniqueValues = (column: string): string[] => {
    const values = uniqueValuesMap.get(column);
    return values ? Array.from(values).sort() : [];
  };

  const handleSelectedColumnsChange = async (newSelectedColumns: Set<string>) => {
    setSelectedColumns(newSelectedColumns);
    
    try {
      const { error } = await supabase
        .from('hierarchy_column_selections')
        .upsert({
          table_name: tableName,
          selected_columns: Array.from(newSelectedColumns)
        }, {
          onConflict: 'table_name'
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['columnSelections', tableName] });
    } catch (error) {
      console.error('Error saving column selections:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save column selections",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <HierarchyTableHeader
              startIndex={startIndex}
              endIndex={endIndex}
              totalItems={filteredData.length}
            />
            <Button
              onClick={handleSaveConfiguration}
              size="lg"
              className="h-12 px-6 gap-2 text-base font-medium"
              disabled={isSavingSelections}
            >
              <Save className="w-5 h-5" />
              {isSavingSelections ? "Saving..." : "Save Configuration"}
            </Button>
          </div>

          <Separator className="my-6" />

          <ColumnSelector
            tableName={tableName}
            combinedHeaders={combinedHeaders}
            selectedColumns={selectedColumns}
            onSelectedColumnsChange={handleSelectedColumnsChange}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={ROWS_PER_PAGE}
            onRowsPerPageChange={() => {}}
          />

          <HierarchyTable
            combinedHeaders={combinedHeaders}
            selectedColumns={selectedColumns}
            currentData={currentData}
            mappings={mappings}
            onLevelChange={handleLevelChange}
            filters={filters}
            onFilterChange={handleFilterChange}
            getUniqueValues={getUniqueValues}
          />

          {filteredData.length === 0 && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No results found for the current filters
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
