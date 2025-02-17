
import { useState, useEffect } from "react";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Json } from "@/integrations/supabase/types";

interface SavedFile {
  id: string;
  file_name: string;
  original_name: string;
  created_at: string;
  created_by: string;
  data: Json;
  hierarchy_type: string;
  selected_columns: string[];
}

interface SavedLocationFilesProps {
  triggerRefresh?: number;
}

export function SavedLocationFiles({ triggerRefresh = 0 }: SavedLocationFilesProps) {
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchSavedFiles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching files:', error);
      setError('Failed to load saved files');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved files"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedFiles();
  }, [triggerRefresh]);

  const handleDelete = async (fileId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('permanent_hierarchy_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
      
      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      // Refresh the file list after deletion
      await fetchSavedFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (file: SavedFile) => {
    try {
      setIsLoading(true);
      
      const data = file.data;
      const selectedColumns = file.selected_columns;
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format');
      }

      // Create CSV content with only selected columns
      const headers = selectedColumns.join(',');
      const rows = data.map(row => 
        selectedColumns.map(col => {
          const value = row[col];
          // Handle values that might contain commas
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value ?? '';
        }).join(',')
      );

      const csvContent = [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.original_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File download started",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (files.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Saved Files</h3>
      <div className="space-y-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
          >
            <div>
              <p className="font-medium">{file.original_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(file.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(file)}
                disabled={isLoading}
                className="h-8 w-8 hover:bg-primary/10"
              >
                <Download className="h-4 w-4 text-primary stroke-[1.5]" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-destructive/10"
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-destructive stroke-[1.5]" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete File</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this file? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(file.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
