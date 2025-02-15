import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ColumnHeader {
  column: string;
  sampleData: string;
}

interface HierarchyTableViewProps {
  tableName: string;
  data: any[];
  columns: string[];
  combinedHeaders: ColumnHeader[];
}

type HierarchyLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8';

interface ColumnMapping {
  column: string;
  level: HierarchyLevel | null;
}

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

  const { data: existingMappings, isLoading } = useQuery({
    queryKey: ['hierarchyMappings', tableName],
    queryFn: async () => {
      console.log('Fetching mappings for table:', tableName);
      const { data, error } = await supabase
        .from('hierarchy_column_mappings')
        .select('*')
        .eq('table_name', tableName);

      if (error) {
        console.error('Error fetching mappings:', error);
        throw error;
      }
      console.log('Fetched mappings:', data);
      return data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!isLoading && existingMappings) {
      const initialMappings = combinedHeaders.map(header => {
        const existingMapping = existingMappings.find(m => m.column_name === header.column);
        return {
          column: header.column,
          level: existingMapping?.hierarchy_level || null
        };
      });
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

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Data Preview</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select columns to display and assign hierarchy levels
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

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {combinedHeaders
                      .filter(header => selectedColumns.has(header.column))
                      .map(({ column, sampleData }) => (
                        <TableHead key={column} className="min-w-[200px]">
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
                            <div className="text-xs text-muted-foreground">
                              Example: {sampleData}
                            </div>
                          </div>
                        </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 5).map((row, index) => (
                    <TableRow key={index}>
                      {combinedHeaders
                        .filter(header => selectedColumns.has(header.column))
                        .map(({ column }) => (
                          <TableCell key={column}>
                            {row[column]}
                          </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
