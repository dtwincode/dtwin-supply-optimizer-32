import { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { HierarchyTableHeader } from "./components/HierarchyTableHeader";
import { ColumnSelector } from "./components/ColumnSelector";
import { Pagination } from "./components/Pagination";
import { HierarchyTable } from "./components/HierarchyTable";
import type { HierarchyTableViewProps, TableRowData } from "./types";
import { supabase } from "@/integrations/supabase/client";

const SHOW_ALL_VALUE = "__show_all__";
const ROWS_PER_PAGE = 50;

export function HierarchyTableView({ 
  tableName, 
  data,
  columns,
  combinedHeaders = []
}: HierarchyTableViewProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(columns));
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState<TableRowData[]>(data);

  // Query for saved column selections
  const { data: savedSelections } = useQuery({
    queryKey: ['columnSelections', tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_column_selections')
        .select('selected_columns')
        .eq('table_name', tableName)
        .single();

      if (error) {
        console.error('Error fetching saved columns:', error);
        return null;
      }

      return data;
    },
    onSuccess: (data) => {
      if (data?.selected_columns) {
        setSelectedColumns(new Set(data.selected_columns));
      }
    }
  });

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

  const handleFilterChange = (column: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [column]: value === SHOW_ALL_VALUE ? '' : value
    }));
  };

  const processDataInBatches = (data: TableRowData[], filters: Record<string, string>) => {
    const results: TableRowData[] = [];
    const totalItems = data.length;
    const BATCH_SIZE = 1000;
    
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

  const handleSelectedColumnsChange = async (newSelectedColumns: Set<string>) => {
    setSelectedColumns(newSelectedColumns);
  };

  const getUniqueValues = (column: string): string[] => {
    const values = uniqueValuesMap.get(column);
    return values ? Array.from(values).sort() : [];
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
