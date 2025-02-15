
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ColumnHeader {
  column: string;
  sampleData: string;
}

interface HierarchyTableViewProps {
  tableName: string;
  data: any[];
  columns: string[];
  combinedHeaders?: ColumnHeader[];
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

  // Fetch existing mappings
  const { data: existingMappings, isLoading } = useQuery({
    queryKey: ['hierarchyMappings', tableName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_column_mappings')
        .select('*')
        .eq('table_name', tableName);

      if (error) throw error;
      return data;
    },
    staleTime: Infinity, // Keep the data fresh indefinitely unless explicitly invalidated
  });

  useEffect(() => {
    if (!isLoading && existingMappings) {
      // Initialize mappings with existing values or null levels
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

  const handleSave = async () => {
    try {
      // Filter out mappings without levels
      const validMappings = mappings.filter((m): m is ColumnMapping & { level: HierarchyLevel } => m.level !== null);
      
      // Delete existing mappings for this table
      await supabase
        .from('hierarchy_column_mappings')
        .delete()
        .eq('table_name', tableName);

      // Insert new mappings
      const { error } = await supabase
        .from('hierarchy_column_mappings')
        .insert(
          validMappings.map(m => ({
            table_name: tableName,
            column_name: m.column,
            hierarchy_level: m.level
          }))
        );

      if (error) throw error;

      // Invalidate and refetch the query to update the cached data
      await queryClient.invalidateQueries({
        queryKey: ['hierarchyMappings', tableName]
      });

      toast({
        title: "Success",
        description: "Column mappings saved successfully",
      });
    } catch (error) {
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
            <h3 className="text-lg font-semibold mb-4">Data Preview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    {combinedHeaders.map(({ column, sampleData }) => (
                      <th key={column} className="px-4 py-2 text-left bg-muted space-y-2">
                        <div className="flex flex-col space-y-2">
                          <div className="font-semibold">{column}</div>
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
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 5).map((row, index) => (
                    <tr key={index}>
                      {combinedHeaders.map(({ column }) => (
                        <td key={column} className="px-4 py-2 border-t">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
          >
            Save Mappings
          </button>
        </div>
      </Card>
    </div>
  );
}
