
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { HierarchyTableView } from '../hierarchy/HierarchyTableView';
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

export function LocationHierarchyUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const { data: locationData, refetch } = useQuery({
    queryKey: ['locationHierarchy'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('location_hierarchy')
        .select('*')
        .limit(100);
      
      if (error) throw error;
      return data;
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setProgress(0);
  };

  const handleDeleteFile = () => {
    setFile(null);
    setProgress(0);
    // Reset the file input
    const fileInput = document.getElementById('location-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setProgress(10);

    try {
      // Upload file to storage
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
        body: { fileName, type: 'location' },
      });

      if (error) throw error;

      setProgress(90);
      if (data.headers) {
        setColumns(data.headers);
      }

      setProgress(100);
      toast({
        title: "Success",
        description: "File uploaded successfully. Please map the columns to hierarchy levels.",
      });

      refetch();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Location Hierarchy</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => document.getElementById('location-file')?.click()}
              disabled={isUploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              id="location-file"
              type="file"
              accept=".csv,.xlsx"
              className="hidden"
              onChange={handleFileSelect}
            />
            {file && (
              <>
                <span className="text-sm text-muted-foreground flex-1">{file.name}</span>
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

      {columns.length > 0 && (
        <HierarchyTableView 
          tableName="location_hierarchy"
          data={locationData || []}
          columns={columns}
        />
      )}
    </div>
  );
}
