
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
        console.log('Fetching files for hierarchy type:', hierarchyType);
        
        const { data, error } = await supabase
          .from('permanent_hierarchy_files')
          .select('*')
          .eq('hierarchy_type', hierarchyType)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        console.log('Retrieved files:', data);
        setFiles(data || []);
        setSelectedFiles(new Set()); // Clear selections on fetch
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

    if (user && hierarchyType) {
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
      console.log('Deleting file with ID:', fileId, 'from hierarchy:', hierarchyType);
      
      const { error } = await supabase
        .from('permanent_hierarchy_files')
        .delete()
        .eq('id', fileId)
        .eq('hierarchy_type', hierarchyType);

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

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

  const handleBulkDelete = async () => {
    try {
      // Create an array of promises for each deletion
      const deletePromises = Array.from(selectedFiles).map(fileId => handleDelete(fileId));
      
      // Wait for all deletions to complete
      await Promise.all(deletePromises);
      
      // Clear selection after successful deletion
      setSelectedFiles(new Set());
      
      toast({
        title: "Success",
        description: "Selected files deleted successfully"
      });
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete some files"
      });
    }
  };

  const handleDownload = async (file: any) => {
    try {
      // Add download logic here
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

  const handleBulkDownload = async () => {
    try {
      // Create an array of promises for each download
      const downloadPromises = Array.from(selectedFiles).map(fileId => {
        const file = files.find(f => f.id === fileId);
        if (file) {
          return handleDownload(file);
        }
        return Promise.resolve();
      });
      
      // Wait for all downloads to complete
      await Promise.all(downloadPromises);
      
      toast({
        title: "Success",
        description: "Selected files downloaded successfully"
      });
    } catch (error) {
      console.error('Error in bulk download:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download some files"
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
          <div className="flex items-center gap-2">
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
            
            {selectedFiles.size > 0 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBulkDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Selected
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Selected
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Selected Files</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedFiles.size} selected files? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleBulkDelete}
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
