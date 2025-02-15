
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { ColumnHeader } from "../types";

interface ColumnSelectorProps {
  combinedHeaders: ColumnHeader[];
  selectedColumns: Set<string>;
  onColumnToggle: (column: string) => void;
}

export function ColumnSelector({ 
  combinedHeaders, 
}: ColumnSelectorProps) {
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  // Fetch existing column selections from the database
  const { data: columnSelectionsData, isLoading } = useQuery({
    queryKey: ['columnSelections', 'location_hierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_column_selections')
        .select('selected_columns')
        .eq('table_name', 'location_hierarchy')
        .maybeSingle();

      if (error) throw error;
      return data?.selected_columns || [];
    }
  });

  // Update column selections in the database
  const updateColumnSelections = useMutation({
    mutationFn: async (columns: string[]) => {
      const { error } = await supabase
        .from('hierarchy_column_selections')
        .upsert({
          table_name: 'location_hierarchy',
          selected_columns: columns
        }, {
          onConflict: 'table_name'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columnSelections'] });
      toast({
        title: "Success",
        description: "Column selections saved successfully",
      });
    },
    onError: (error) => {
      console.error('Error saving column selections:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save column selections",
      });
    }
  });

  // Initialize selected columns from database
  useEffect(() => {
    if (columnSelectionsData) {
      setSelectedColumns(new Set(columnSelectionsData));
    }
  }, [columnSelectionsData]);

  const handleColumnToggle = async (column: string) => {
    const newSelection = new Set(selectedColumns);
    if (newSelection.has(column)) {
      newSelection.delete(column);
    } else {
      newSelection.add(column);
    }
    setSelectedColumns(newSelection);
    
    // Save to database
    await updateColumnSelections.mutateAsync(Array.from(newSelection));
  };

  if (isLoading) {
    return (
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">Loading column selections...</h4>
      </div>
    );
  }

  return (
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
  );
}
