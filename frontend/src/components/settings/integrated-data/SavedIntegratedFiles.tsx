
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { FileCard } from "../location-hierarchy/components/FileCard";
import type { SavedFile } from "../location-hierarchy/types";

interface SavedIntegratedFilesProps {
  triggerRefresh?: number;
}

export function SavedIntegratedFiles({ triggerRefresh = 0 }: SavedIntegratedFilesProps) {
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('permanent_hierarchy_files')
        .select('*')
        .eq('hierarchy_type', 'integrated_data')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error",
        description: "Failed to fetch saved files",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [triggerRefresh]);

  const handleDelete = async (fileId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('permanent_hierarchy_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      await fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (file: SavedFile) => {
    try {
      if (!Array.isArray(file.data)) {
        throw new Error('Invalid file data format');
      }

      const fileData = file.data;
      const fileName = file.original_name;
      
      // Convert data to CSV
      const headers = Object.keys(fileData[0] || {});
      const csvContent = [
        headers.join(','),
        ...fileData.map((row: any) => 
          headers.map(header => JSON.stringify(row[header] || '')).join(',')
        )
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Saved Files</h3>
        </div>
        
        <div className="space-y-2">
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved files found
            </p>
          ) : (
            files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                isLoading={isLoading}
                isSelected={selectedFiles.has(file.id)}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onToggleSelect={() => toggleFileSelection(file.id)}
              />
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
