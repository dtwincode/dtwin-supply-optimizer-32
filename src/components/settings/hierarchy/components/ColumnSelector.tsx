
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
  tempUploadId?: string;
}

export function ColumnSelector({ 
  tableName,
  combinedHeaders,
  selectedColumns,
  onSelectedColumnsChange,
  tempUploadId
}: ColumnSelectorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const deleteTempUploadMutation = useMutation({
    mutationFn: async () => {
      if (!tempUploadId) return;
      
      const { error } = await supabase
        .from('temp_hierarchy_uploads')
        .delete()
        .eq('id', tempUploadId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hierarchyData', tableName]
      });
      toast({
        title: "Success",
        description: "Temporary upload deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting temporary upload:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete temporary upload",
      });
    }
  });

  const handleColumnToggle = async (column: string) => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const newSelection = new Set(selectedColumns);
      if (newSelection.has(column)) {
        newSelection.delete(column);
      } else {
        newSelection.add(column);
      }
      
      const { error } = await supabase
        .from('hierarchy_column_selections')
        .upsert({
          table_name: tableName,
          selected_columns: Array.from(newSelection)
        }, {
          onConflict: 'table_name'
        });

      if (error) throw error;

      onSelectedColumnsChange(newSelection);
      queryClient.invalidateQueries({
        queryKey: ['columnSelections', tableName]
      });
    } catch (error) {
      console.error('Error updating column selections:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update column selections",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectAll = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const allColumns = new Set(combinedHeaders.map(header => header.column));
      
      const { error } = await supabase
        .from('hierarchy_column_selections')
        .upsert({
          table_name: tableName,
          selected_columns: Array.from(allColumns)
        }, {
          onConflict: 'table_name'
        });

      if (error) throw error;

      onSelectedColumnsChange(allColumns);
      queryClient.invalidateQueries({
        queryKey: ['columnSelections', tableName]
      });
    } catch (error) {
      console.error('Error selecting all columns:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to select all columns",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnselectAll = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('hierarchy_column_selections')
        .upsert({
          table_name: tableName,
          selected_columns: []
        }, {
          onConflict: 'table_name'
        });

      if (error) throw error;

      onSelectedColumnsChange(new Set());
      queryClient.invalidateQueries({
        queryKey: ['columnSelections', tableName]
      });
    } catch (error) {
      console.error('Error unselecting all columns:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unselect all columns",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTempUpload = async () => {
    if (tempUploadId) {
      await deleteTempUploadMutation.mutateAsync();
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
            disabled={isSaving}
          >
            <CheckSquare className="h-4 w-4 mr-1" />
            Select All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUnselectAll}
            className="h-8 px-2"
            disabled={isSaving}
          >
            <XSquare className="h-4 w-4 mr-1" />
            Unselect All
          </Button>
          {tempUploadId && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 px-2"
                  disabled={isSaving}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Upload
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Temporary Upload</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this temporary upload? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteTempUpload}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
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
                disabled={isSaving}
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
