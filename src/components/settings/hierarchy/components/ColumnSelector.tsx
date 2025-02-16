import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CheckSquare, XSquare, Trash2, Save } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";

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
  const { user } = useAuth();

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

  const savePermanentDataMutation = useMutation({
    mutationFn: async () => {
      if (!tempUploadId) return;

      const { data: tempUpload, error: fetchError } = await supabase
        .from('temp_hierarchy_uploads')
        .select('*')
        .eq('id', tempUploadId)
        .single();

      if (fetchError) throw fetchError;

      const { data: versionData, error: versionError } = await supabase
        .from('permanent_hierarchy_data')
        .select('version')
        .eq('hierarchy_type', tableName)
        .order('version', { ascending: false })
        .limit(1);

      if (versionError) throw versionError;

      const newVersion = versionData && versionData.length > 0 ? versionData[0].version + 1 : 1;

      const { error: saveError } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: tableName,
          version: newVersion,
          data: tempUpload.sample_data,
          source_upload_id: tempUploadId,
          created_by: user?.id
        });

      if (saveError) throw saveError;

      const { error: activateError } = await supabase.rpc('activate_hierarchy_version', {
        p_hierarchy_type: tableName,
        p_version: newVersion
      });

      if (activateError) throw activateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hierarchyData'] });
      toast({
        title: "Success",
        description: "Data saved successfully",
      });
    },
    onError: (error) => {
      console.error('Error saving permanent data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save data permanently",
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

  const handleSavePermanent = async () => {
    if (tempUploadId) {
      await savePermanentDataMutation.mutateAsync();
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
            <>
              <Button
                variant="default"
                size="sm"
                onClick={handleSavePermanent}
                className="h-8 px-2"
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-1" />
                Save Permanently
              </Button>
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
            </>
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
