
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
    staleTime: 0, // Always refetch when component mounts
    refetchOnMount: true, // Ensure we refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  useEffect(() => {
    console.log('Effect triggered with:', { existingMappings, isLoading });
    if (!isLoading && existingMappings) {
      // Initialize mappings with existing values or null levels
      const initialMappings = combinedHeaders.map(header => {
        const existingMapping = existingMappings.find(m => m.column_name === header.column);
        console.log('Mapping for column:', header.column, 'Found:', existingMapping);
        return {
          column: header.column,
          level: existingMapping?.hierarchy_level || null
        };
      });
      console.log('Setting initial mappings:', initialMappings);
      setMappings(initialMappings);
    }
  }, [combinedHeaders, existingMappings, isLoading]);

  const handleLevelChange = (column: string, level: HierarchyLevel | 'none') => {
    console.log('Handling level change:', { column, level });
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
      console.log('Saving mappings:', mappings);
      // Filter out mappings without levels
      const validMappings = mappings.filter((m): m is ColumnMapping & { level: HierarchyLevel } => m.level !== null);
      
      // Delete existing mappings for this table
      const { error: deleteError } = await supabase
        .from('hierarchy_column_mappings')
        .delete()
        .eq('table_name', tableName);

      if (deleteError) {
        console.error('Error deleting mappings:', deleteError);
        throw deleteError;
      }

      // Insert new mappings
      const { error: insertError } = await supabase
        .from('hierarchy_column_mappings')
        .insert(
          validMappings.map(m => ({
            table_name: tableName,
            column_name: m.column,
            hierarchy_level: m.level
          }))
        );

      if (insertError) {
        console.error('Error inserting mappings:', insertError);
        throw insertError;
      }

      // Invalidate and refetch the query to update the cached data
      await queryClient.invalidateQueries({
        queryKey: ['hierarchyMappings', tableName]
      });

      console.log('Successfully saved and invalidated cache');

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
