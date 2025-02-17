
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CheckSquare, XSquare, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnHeader } from "../types";
import { useAuth } from "@/contexts/AuthContext";
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
import { SavedFilesList } from "./SavedFilesList";

interface ColumnSelectorProps {
  tableName: string;
  combinedHeaders: ColumnHeader[];
  selectedColumns: Set<string>;
  onSelectedColumnsChange: (columns: Set<string>) => void;
  tempUploadId?: string;
  data?: any[];
}

export function ColumnSelector({ 
  tableName,
  combinedHeaders,
  selectedColumns,
  onSelectedColumnsChange,
  tempUploadId,
  data
}: ColumnSelectorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Delete temporary upload mutation
  const deleteTempUpload = useMutation({
    mutationFn: async () => {
      if (!tempUploadId) return;
      const { error } = await supabase
        .from('temp_hierarchy_uploads') // Changed from temporary_uploads to temp_hierarchy_uploads
        .delete()
        .eq('id', tempUploadId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Temporary upload deleted",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete temporary upload",
      });
    }
  });

  // Save permanently mutation
  const savePermanently = useMutation({
    mutationFn: async () => {
      console.log('Save permanently called with:', {
        user: user?.id,
        dataPresent: !!data,
        selectedColumns: Array.from(selectedColumns)
      });

      // More detailed validation
      if (!data) {
        throw new Error('No data provided for saving');
      }
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const fileName = `hierarchy_${tableName}_${new Date().getTime()}`;
      
      const insertData = {
        file_name: fileName,
        original_name: `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Hierarchy ${new Date().toLocaleDateString()}`,
        hierarchy_type: tableName,
        created_by: user.id,
        file_size: JSON.stringify(data).length,
        metadata: { records: data.length },
        selected_columns: Array.from(selectedColumns),
        data: data
      };

      console.log('Attempting to insert:', insertData);

      const { data: savedData, error: fileError } = await supabase
        .from('permanent_hierarchy_files')
        .insert([insertData])
        .select()
        .single();

      if (fileError) {
        console.error('Supabase error:', fileError);
        throw fileError;
      }

      return savedData;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "File saved permanently",
      });
    },
    onError: (error: Error) => {
      console.error('Error saving file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save file permanently",
      });
    }
  });

  const handleColumnToggle = (column: string) => {
    if (isSaving) return;
    
    const newSelection = new Set(selectedColumns);
    if (newSelection.has(column)) {
      newSelection.delete(column);
    } else {
      newSelection.add(column);
    }
    
    onSelectedColumnsChange(newSelection);
  };

  const handleSelectAll = () => {
    if (isSaving) return;
    const allColumns = new Set(combinedHeaders.map(header => header.column));
    onSelectedColumnsChange(allColumns);
  };

  const handleUnselectAll = () => {
    if (isSaving) return;
    onSelectedColumnsChange(new Set());
  };

  const handleDeleteTempUpload = async () => {
    if (tempUploadId) {
      await deleteTempUpload.mutateAsync();
    }
  };

  const handleSavePermanently = async () => {
    if (selectedColumns.size === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one column to save",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save files",
      });
      return;
    }

    if (!data) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No data available to save",
      });
      return;
    }

    setIsSaving(true);
    try {
      await savePermanently.mutateAsync();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
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
            <Button
              variant="default"
              size="sm"
              onClick={handleSavePermanently}
              className="h-8 px-2"
              disabled={isSaving || selectedColumns.size === 0}
            >
              <Save className="h-4 w-4 mr-1" />
              Save Permanently
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

      <SavedFilesList tableName={tableName} />
    </div>
  );
}
