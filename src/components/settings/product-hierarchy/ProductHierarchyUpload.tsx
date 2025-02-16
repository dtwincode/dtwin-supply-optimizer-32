
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Save } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { HierarchyTableView } from '../hierarchy/HierarchyTableView';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

export function ProductHierarchyUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savedFileName, setSavedFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for product hierarchy data
  const { data: productData } = useQuery({
    queryKey: ['productHierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_hierarchy')
        .select('*')
        .limit(100);
      
      if (error) throw error;
      return data;
    }
  });

  // Query for saved files
  const { data: savedFiles, refetch: refetchSavedFiles } = useQuery({
    queryKey: ['savedHierarchyFiles', 'product'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hierarchy_file_references')
        .select('*')
        .eq('hierarchy_type', 'product')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Query for preview data
  const { data: previewState } = useQuery({
    queryKey: ['productHierarchyPreview'],
    queryFn: () => {
      return {
        columns: [] as string[],
        previewData: [] as any[],
        combinedHeaders: [] as Array<{column: string, sampleData: string}>
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setProgress(0);
    setSavedFileName(null);
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase
        .from('hierarchy_file_references')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });
      
      refetchSavedFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file",
      });
    }
  };

  const handleDeleteCurrentFile = () => {
    setFile(null);
    setProgress(0);
    setSavedFileName(null);
    
    // Clear the preview data from React Query cache
    queryClient.setQueryData(['productHierarchyPreview'], {
      columns: [],
      previewData: [],
      combinedHeaders: []
    });
    
    // Reset the file input
    const fileInput = document.getElementById('product-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSaveFile = async () => {
    if (!file || !savedFileName || !previewState) {
      console.log('Save cancelled - missing required data:', { file, savedFileName, previewState });
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('hierarchy_file_references')
        .insert({
          file_name: file.name,
          file_type: file.name.split('.').pop() || 'unknown',
          hierarchy_type: 'product',
          original_name: file.name,
          storage_path: savedFileName,
          data: {
            previewData: previewState.previewData,
            columns: previewState.columns,
            combinedHeaders: previewState.combinedHeaders
          }
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `File "${file.name}" saved successfully`,
      });

      // Refresh the saved files list
      refetchSavedFiles();
      
      // Clear the current file
      handleDeleteCurrentFile();

    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save file",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSavedFile = async (fileData: any) => {
    queryClient.setQueryData(['productHierarchyPreview'], {
      columns: fileData.data.columns,
      previewData: fileData.data.previewData,
      combinedHeaders: fileData.data.combinedHeaders
    });
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(10);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      setProgress(30);
      const { error: uploadError } = await supabase.storage
        .from('hierarchy-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setProgress(60);
      // Process the hierarchy
      const { data, error } = await supabase.functions.invoke('process-hierarchy', {
        body: { fileName, type: 'product' },
      });

      if (error) throw error;

      setProgress(90);
      if (data.headers) {
        // Update the preview data in React Query cache
        queryClient.setQueryData(['productHierarchyPreview'], {
          columns: data.headers,
          previewData: data.data || [],
          combinedHeaders: data.combinedHeaders || []
        });
      }

      setSavedFileName(fileName);

      setProgress(100);
      toast({
        title: "Success",
        description: "File uploaded successfully. Click the save icon to save the reference.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload and process product hierarchy file",
      });
      setSavedFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Product Hierarchy</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => document.getElementById('product-file')?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              id="product-file"
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleFileSelect}
            />
            {file && (
              <>
                <span className="text-sm text-muted-foreground flex-1">{file.name}</span>
                {savedFileName && (
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleSaveFile}
                    disabled={isUploading || isSaving}
                  >
                    <Save className={`h-4 w-4 ${isSaving ? 'animate-spin' : 'text-green-600'}`} />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleDeleteCurrentFile}
                  disabled={isUploading}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>

          {file && !isUploading && (
            <Button onClick={handleUpload} className="w-full">
              Upload and Process
            </Button>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {progress}% - {progress < 100 ? 'Uploading...' : 'Complete'}
              </p>
            </div>
          )}
        </div>
      </Card>

      {savedFiles && savedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Saved Files</h3>
          <div className="space-y-2">
            {savedFiles.map((savedFile) => (
              <div
                key={savedFile.id}
                className="flex items-center justify-between p-2 rounded-md border hover:bg-accent"
              >
                <Button
                  variant="ghost"
                  className="text-sm text-left flex-1"
                  onClick={() => handleLoadSavedFile(savedFile)}
                >
                  {savedFile.file_name}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteFile(savedFile.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {previewState && previewState.columns.length > 0 && previewState.previewData.length > 0 && (
        <HierarchyTableView 
          tableName="product_hierarchy"
          data={previewState.previewData}
          columns={previewState.columns}
          combinedHeaders={previewState.combinedHeaders}
        />
      )}
    </div>
  );
}
