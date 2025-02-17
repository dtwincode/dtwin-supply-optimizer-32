import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CheckSquare, XSquare, Trash2, Save, Download } from "lucide-react";
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
import { Card } from "@/components/ui/card";

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
  const [savedFiles, setSavedFiles] = useState<any[]>([]);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const fetchSavedFiles = async () => {
    const { data: files, error } = await supabase
      .from('permanent_hierarchy_files')
      .select('*')
      .eq('hierarchy_type', tableName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved files:', error);
      return;
    }

    setSavedFiles(files || []);
  };

  useEffect(() => {
    fetchSavedFiles();
  }, [tableName]);

  const savePermanentlyMutation = useMutation({
    mutationFn: async () => {
      if (!data || !user) return;

      const fileName = `hierarchy_${tableName}_${new Date().getTime()}`;
      
      const { error: fileError } = await supabase
        .from('permanent_hierarchy_files')
        .insert({
          file_name: fileName,
          original_name: `${tableName.charAt(0).toUpperCase() + tableName.slice(1)} Hierarchy ${new Date().toLocaleDateString()}`,
          hierarchy_type: tableName,
          created_by: user.id,
          file_size: JSON.stringify(data).length,
          metadata: { records: data.length },
          selected_columns: Array.from(selectedColumns),
          data: data
        });

      if (fileError) throw fileError;
      return fileName;
    },
    onSuccess: () => {
      fetchSavedFiles();
      toast({
        title: "Success",
        description: "File saved permanently",
      });
    },
    onError: (error) => {
      console.error('Error saving file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save file permanently",
      });
    }
  });

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
      
      onSelectedColumnsChange(newSelection);
    } finally {
      setIsSaving(false);
    }
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
      await deleteTempUploadMutation.mutateAsync();
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

    await savePermanentlyMutation.mutateAsync();
  };

  const handleDownload = async (fileData: any) => {
    try {
      const data = fileData.data;
      const selectedCols = fileData.selected_columns;
      
      const filteredData = data.map((row: any) => {
        const filtered: any = {};
        selectedCols.forEach((col: string) => {
          filtered[col] = row[col];
        });
        return filtered;
      });

      const headers = selectedCols.join(',');
      const rows = filteredData.map((row: any) => 
        selectedCols.map(col => `"${row[col] || ''}"`).join(',')
      );
      const csv = [headers, ...rows].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileData.original_name}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file",
      });
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
              onClick={() => savePermanentlyMutation.mutate()}
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

      {savedFiles.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">Saved Files</h4>
          <div className="space-y-3">
            {savedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{file.original_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(file.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  className="h-8 w-8"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
