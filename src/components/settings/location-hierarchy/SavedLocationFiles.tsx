
import { useState, useEffect } from "react";
import { Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SavedFile {
  id: string;
  file_name: string;
  original_name: string;
  created_at: string;
  file_size?: number;
}

export function SavedLocationFiles() {
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchSavedFiles();
  }, []);

  const fetchSavedFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('location_hierarchy_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved files"
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('location_hierarchy_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      fetchSavedFiles();
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

  const handleDownload = async (fileName: string) => {
    try {
      setIsLoading(true);
      // First get the data from the permanent hierarchy data table
      const { data: hierarchyData, error: hierarchyError } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('created_at', { ascending: false })
        .limit(1);

      if (hierarchyError) throw hierarchyError;
      
      if (!hierarchyData || hierarchyData.length === 0 || !hierarchyData[0].data) {
        throw new Error('No data found');
      }

      const locationData = hierarchyData[0].data;

      // Convert data to CSV
      const headers = Object.keys(locationData[0]);
      const csvContent = [
        headers.join(','), // Header row
        ...locationData.map((row: any) => 
          headers.map(header => {
            const value = row[header];
            // Handle special characters and commas in the value
            if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.csv`;
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
                onClick={() => handleDownload(file.file_name)}
                disabled={isLoading}
                className="h-8 w-8 hover:bg-primary/10"
              >
                <Download className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(file.id)}
                disabled={isLoading}
                className="h-8 w-8 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
