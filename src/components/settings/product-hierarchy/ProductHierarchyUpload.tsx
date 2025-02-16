import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Save, Download } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { HierarchyTableView } from '../hierarchy/HierarchyTableView';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import * as XLSX from 'xlsx';

export function ProductHierarchyUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saveProgress, setSaveProgress] = useState(0);
  const [savedFileName, setSavedFileName] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: savedHierarchies, refetch: refetchSavedHierarchies } = useQuery({
    queryKey: ['permanentHierarchyData', 'product'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permanent_hierarchy_data')
        .select('*')
        .eq('hierarchy_type', 'product')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

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
    setUploadProgress(0);
    setSavedFileName(null);
  };

  const handleDeleteHierarchy = async (hierarchyId: string) => {
    try {
      const { error } = await supabase
        .from('permanent_hierarchy_data')
        .delete()
        .eq('id', hierarchyId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Hierarchy data deleted successfully",
      });
      
      refetchSavedHierarchies();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete hierarchy data",
      });
    }
  };

  const handleLoadHierarchy = async (hierarchy: any) => {
    if (!hierarchy.data) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid hierarchy data",
      });
      return;
    }

    queryClient.setQueryData(['productHierarchyPreview'], {
      columns: Object.keys(hierarchy.data[0] || {}),
      previewData: hierarchy.data,
      combinedHeaders: Object.keys(hierarchy.data[0] || {}).map(key => ({
        column: key,
        sampleData: hierarchy.data[0]?.[key]
      }))
    });

    toast({
      title: "Success",
      description: "Hierarchy data loaded successfully",
    });
  };

  const handleDeleteCurrentFile = () => {
    setFile(null);
    setUploadProgress(0);
    setSavedFileName(null);
    
    queryClient.setQueryData(['productHierarchyPreview'], {
      columns: [],
      previewData: [],
      combinedHeaders: []
    });
    
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
    setSaveProgress(25);
    try {
      setSaveProgress(50);
      const { error } = await supabase
        .from('permanent_hierarchy_data')
        .insert({
          hierarchy_type: 'product',
          data: previewState.previewData,
          is_active: true,
          version: 1
        });

      if (error) throw error;
      setSaveProgress(75);
      toast({
        title: "Success",
        description: `File "${file.name}" saved permanently`,
      });

      await refetchSavedHierarchies();
      setSaveProgress(90);
      handleDeleteCurrentFile();
      setSaveProgress(100);
    } catch (error) {
      console.error('Save error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save file permanently",
      });
    } finally {
      setTimeout(() => {
        setIsSaving(false);
        setSaveProgress(0);
      }, 1000);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(10);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      setUploadProgress(30);
      const { error: uploadError } = await supabase.storage
        .from('hierarchy-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress(60);
      const { data, error } = await supabase.functions.invoke('process-hierarchy', {
        body: { fileName, type: 'product' },
      });

      if (error) throw error;

      setUploadProgress(90);
      if (data.headers) {
        queryClient.setQueryData(['productHierarchyPreview'], {
          columns: data.headers,
          previewData: data.data || [],
          combinedHeaders: data.combinedHeaders || []
        });
      }

      setSavedFileName(fileName);

      setUploadProgress(100);
      toast({
        title: "Success",
        description: "File uploaded successfully. Click the save icon to save permanently.",
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
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const handleDownloadHierarchy = (hierarchy: any) => {
    if (!hierarchy.data || !Array.isArray(hierarchy.data)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid hierarchy data for download",
      });
      return;
    }

    try {
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(hierarchy.data);
      XLSX.utils.book_append_sheet(wb, ws, "Product Hierarchy");
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `product_hierarchy_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "Hierarchy file downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download hierarchy file",
      });
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
              disabled={isUploading || isSaving}
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
                  disabled={isUploading || isSaving}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>

          {file && !isUploading && !isSaving && (
            <Button onClick={handleUpload} className="w-full">
              Upload and Process
            </Button>
          )}

          {(isUploading || isSaving) && (
            <div className="space-y-2">
              <Progress 
                value={isUploading ? uploadProgress : saveProgress} 
                className="w-full" 
              />
              <p className="text-sm text-muted-foreground text-center">
                {isUploading ? (
                  `${uploadProgress}% - ${uploadProgress < 100 ? 'Uploading...' : 'Complete'}`
                ) : (
                  `${saveProgress}% - ${saveProgress < 100 ? 'Saving...' : 'Complete'}`
                )}
              </p>
            </div>
          )}
        </div>
      </Card>

      {savedHierarchies && savedHierarchies.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Saved Product Hierarchies</h3>
          <div className="space-y-2">
            {savedHierarchies.map((hierarchy) => (
              <div
                key={hierarchy.id}
                className="flex items-center justify-between p-2 rounded-md border hover:bg-accent"
              >
                <Button
                  variant="ghost"
                  className="text-sm text-left flex-1"
                  onClick={() => handleLoadHierarchy(hierarchy)}
                >
                  Product Hierarchy {new Date(hierarchy.created_at).toLocaleDateString()} 
                  {hierarchy.is_active && <span className="ml-2 text-green-600">(Active)</span>}
                </Button>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDownloadHierarchy(hierarchy)}
                    className="text-blue-600 hover:text-blue-600 hover:bg-blue-100"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteHierarchy(hierarchy.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
