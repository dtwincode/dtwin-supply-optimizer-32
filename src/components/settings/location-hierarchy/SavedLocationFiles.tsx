import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FileList } from "./components/FileList";
import type { SavedFile } from "./types";

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
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching saved files...');
      
      const { data, error } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'location_hierarchy')
        .eq('created_by', user.id);

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }

      // Simple deduplication by file_name, keeping only the latest version
      const uniqueFiles = Object.values(
        data.reduce((acc: Record<string, SavedFile>, current) => {
          // Only keep the file if it's newer than what we have
          if (!acc[current.file_name] || 
              new Date(current.created_at) > new Date(acc[current.file_name].created_at)) {
            acc[current.file_name] = current;
          }
          return acc;
        }, {})
      );

      console.log('Fetched unique files:', uniqueFiles.length);
      setFiles(uniqueFiles);
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
  }, [triggerRefresh, user]);

  const handleDelete = async (fileId: string) => {
    if (!user || !fileId) return;

    try {
      setIsLoading(true);
      console.log('Deleting file:', fileId);

      // First, get the file details to ensure we delete all related records
      const { data: fileData, error: fetchError } = await supabase
        .from('permanent_hierarchy_files')
        .select('file_name')
        .eq('id', fileId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (!fileData) {
        throw new Error('File not found');
      }

      // Delete all records with this file_name for this user
      const { error: deleteError } = await supabase
        .from('permanent_hierarchy_files')
        .delete()
        .eq('file_name', fileData.file_name)
        .eq('created_by', user.id);

      if (deleteError) {
        console.error('Supabase delete error:', deleteError);
        throw deleteError;
      }

      // Immediately update local state
      setFiles(prevFiles => prevFiles.filter(f => f.file_name !== fileData.file_name));

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      // Refresh the file list to ensure we have the latest data
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

  return (
    <FileList
      files={files}
      error={error}
      isLoading={isLoading}
      onDelete={handleDelete}
      onDownload={handleDownload}
    />
  );
}
