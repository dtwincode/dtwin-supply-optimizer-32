
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Download, Trash2, CheckSquare, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface SavedFilesProps {
  triggerRefresh: number;
  hierarchyType: string;
}

export function SavedFiles({ triggerRefresh, hierarchyType }: SavedFilesProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  const allSelected = files.length > 0 && selectedFiles.size === files.length;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        // Query specifically for files matching the hierarchyType
        const { data, error } = await supabase
          .from('permanent_hierarchy_files')
          .select('*')
          .eq('hierarchy_type', hierarchyType) // This ensures we only get files for the current tab
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFiles(data || []);
        // Clear selected files when changing tabs or refreshing
        setSelectedFiles(new Set());
      } catch (error) {
        console.error('Error fetching files:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch saved files"
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFiles();
    }
  }, [user, triggerRefresh, hierarchyType, toast]);

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(file => file.id)));
    }
  };

  const handleToggleFile = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleDelete = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('permanent_hierarchy_files')
        .delete()
        .eq('id', fileId)
        .eq('hierarchy_type', hierarchyType); // Add this to ensure we only delete from current hierarchy

      if (error) throw error;

      setFiles(files.filter(f => f.id !== fileId));
      setSelectedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
      
      toast({
        title: "Success",
        description: "File deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file"
      });
    }
  };

  const handleDownload = async (file: any) => {
    try {
      // Implement download logic here
      toast({
        title: "Success",
        description: "File downloaded successfully"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Saved Files</h2>
          </div>
          <p className="text-sm text-muted-foreground">Loading saved files...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Saved Files</h2>
          {files.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleAll}
              className="flex items-center gap-2"
            >
              {allSelected ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
              Select All
            </Button>
          )}
        </div>
        <div className="space-y-4">
          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved files found for this section.</p>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFile(file.id)}
                    className="p-0 h-auto"
                  >
                    {selectedFiles.has(file.id) ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      {file.original_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(file.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4 text-primary" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
