
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CheckSquare, XSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      // Ensure we return an array even if data is null
      return data?.selected_columns || [];
    },
    // Prevent stale data from being shown
    staleTime: 0,
    // Always refetch on window focus
    refetchOnWindowFocus: true
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
    if (Array.isArray(columnSelectionsData)) {
      // Only create a new Set if we have valid array data
      setSelectedColumns(new Set(columnSelectionsData));
    } else {
      // If no data, initialize with an empty Set
      setSelectedColumns(new Set());
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

  const handleSelectAll = async () => {
    const allColumns = new Set(combinedHeaders.map(header => header.column));
    setSelectedColumns(allColumns);
    await updateColumnSelections.mutateAsync(Array.from(allColumns));
  };

  const handleUnselectAll = async () => {
    setSelectedColumns(new Set());
    await updateColumnSelections.mutateAsync([]);
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
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">Column Selection</h4>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="h-8 px-2"
          >
            <CheckSquare className="h-4 w-4 mr-1" />
            Select All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnselectAll}
            className="h-8 px-2"
          >
            <XSquare className="h-4 w-4 mr-1" />
            Unselect All
          </Button>
        </div>
      </div>
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
