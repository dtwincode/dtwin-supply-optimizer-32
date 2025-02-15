
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CheckSquare, XSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnHeader } from "../types";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ColumnSelectorProps {
  tableName: string;
  combinedHeaders: ColumnHeader[];
  selectedColumns: Set<string>;
  onSelectedColumnsChange: (columns: Set<string>) => void;
}

export function ColumnSelector({ 
  tableName,
  combinedHeaders,
  selectedColumns,
  onSelectedColumnsChange,
}: ColumnSelectorProps) {
  const [columnToDelete, setColumnToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteColumnMutation = useMutation({
    mutationFn: async (columnName: string) => {
      const { error } = await supabase
        .rpc('drop_hierarchy_column', {
          p_table_name: tableName,
          p_column_name: columnName
        });

      if (error) throw error;

      // Update column selections after deletion
      const newSelections = new Set(selectedColumns);
      newSelections.delete(columnName);
      
      const { error: selectionsError } = await supabase
        .from('hierarchy_column_selections')
        .upsert({
          table_name: tableName,
          selected_columns: Array.from(newSelections)
        }, {
          onConflict: 'table_name'
        });

      if (selectionsError) throw selectionsError;

      return newSelections;
    },
    onSuccess: (newSelections) => {
      onSelectedColumnsChange(newSelections);
      queryClient.invalidateQueries([
        ['columnSelections', tableName],
        ['hierarchyMappings', tableName]
      ]);
      toast({
        title: "Success",
        description: "Column deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting column:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete column",
      });
    }
  });

  const handleColumnToggle = (column: string) => {
    const newSelection = new Set(selectedColumns);
    if (newSelection.has(column)) {
      newSelection.delete(column);
    } else {
      newSelection.add(column);
    }
    onSelectedColumnsChange(newSelection);
  };

  const handleSelectAll = () => {
    const allColumns = new Set(combinedHeaders.map(header => header.column));
    onSelectedColumnsChange(allColumns);
  };

  const handleUnselectAll = () => {
    onSelectedColumnsChange(new Set());
  };

  const handleDeleteColumn = async () => {
    if (columnToDelete) {
      await deleteColumnMutation.mutateAsync(columnToDelete);
      setColumnToDelete(null);
    }
  };

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
            <div key={column} className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setColumnToDelete(column)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive hover:text-destructive/90" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Column</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the column "{column}"? This action cannot be undone
                      and all data in this column will be permanently lost.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setColumnToDelete(null)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteColumn}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
