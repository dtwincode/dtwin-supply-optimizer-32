import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Save } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { HierarchyTableView } from '../hierarchy/HierarchyTableView';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { useMutation } from "@tanstack/react-query";

export function ProductHierarchyUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savedFileName, setSavedFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for product hierarchy data
  const { data: productData } = useQuery({
    queryKey: ['productHierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('*')
        .eq('hierarchy_type', 'product')
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.data || [];
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
    staleTime: Infinity, // Never mark the data as stale
    gcTime: Infinity, // Never garbage collect the data
  });

  const savePermanentDataMutation = useMutation({
    mutationFn: async (data: {
      hierarchyData: any[];
      selectedColumns: string[];
      mappings: any[];
    }) => {
      const { error: versionError } = await supabase
        .from('hierarchy_versions')
        .insert({
          hierarchy_type: 'product',
          version: 1,
          changes_summary: 'Initial hierarchy upload',
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (versionError) throw versionError;

      const { error } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'product',
          data: data.hierarchyData,
          status: 'active',
          version: 1,
          is_active: true,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          metadata: {
            selected_columns: data.selectedColumns,
            mappings: data.mappings
          }
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productHierarchy'] });
      toast({
        title: "Success",
        description: "Hierarchy data has been permanently saved",
      });
    },
    onError: (error) => {
      console.error('Error saving permanent data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save hierarchy data permanently",
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setProgress(0);
    setSavedFileName(null);
  };

  const handleDeleteFile = () => {
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
    
    try {
      await savePermanentDataMutation.mutateAsync({
        hierarchyData: previewState.previewData,
        selectedColumns: previewState.columns,
        mappings: previewState.combinedHeaders
      });

      setSavedFileName(null);
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save hierarchy data",
      });
    }
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

      // Only set savedFileName after successful upload
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
                    disabled={isUploading}
                  >
                    <Save className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleDeleteFile}
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
