
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
  file_size: number;
  temp_upload_id: string | null;
  is_active: boolean;
  metadata: Json;
  file_type: string;
  created_by: string;
}

interface LocationData {
  [key: string]: string | number | boolean | null;
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

  useEffect(() => {
    fetchSavedFiles();
  }, [triggerRefresh]);

  const fetchSavedFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('location_hierarchy_files')
        .select('*')
        .eq('is_active', true)
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
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      setIsLoading(true);
      
      // Delete the record instead of updating is_active
      const { error } = await supabase
        .from('location_hierarchy_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      // Update local state after successful deletion
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

  const sanitizeCSVValue = (value: unknown): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const handleDownload = async (fileName: string) => {
    try {
      setIsLoading(true);
      const { data: hierarchyData, error: hierarchyError } = await supabase
        .from('permanent_hierarchy_data')
        .select('data')
        .eq('hierarchy_type', 'location_hierarchy')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (hierarchyError) throw hierarchyError;
      
      if (!hierarchyData?.data) {
        throw new Error('No data found');
      }

      const locationData = hierarchyData.data as LocationData[];

      if (!Array.isArray(locationData) || locationData.length === 0) {
        throw new Error('Invalid data format');
      }

      const headers = Object.keys(locationData[0]);
      const csvContent = [
        headers.join(','),
        ...locationData.map((row) => 
          headers.map(header => sanitizeCSVValue(row[header])).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
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
      const errorMessage = error instanceof Error ? error.message : 'Failed to download file';
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage
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
                onClick={() => handleDownload(file.file_name)}
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
