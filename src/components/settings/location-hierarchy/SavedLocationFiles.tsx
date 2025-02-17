
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
    try {
      setIsLoading(true);
      console.log('Fetching saved files...');
      
      // Add distinct constraint and created_by filter
      const { data, error } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'location_hierarchy')
        .eq('created_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }

      // Additional deduplication by file_name
      const uniqueFiles = data?.reduce((acc: SavedFile[], current) => {
        const exists = acc.find(file => file.file_name === current.file_name);
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []) || [];

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
    if (user) {
      console.log('Refresh triggered:', triggerRefresh);
      fetchSavedFiles();
    }
  }, [triggerRefresh, user]);

  const handleDelete = async (fileId: string) => {
    try {
      setIsLoading(true);
      console.log('Deleting file:', fileId);
      
      const { error } = await supabase
        .from('permanent_hierarchy_files')
        .delete()
        .eq('id', fileId)
        .eq('created_by', user?.id); // Add user check for safety

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('File deleted successfully:', fileId);
      setFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
      
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
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
