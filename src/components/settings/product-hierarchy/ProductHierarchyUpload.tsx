
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

export function ProductHierarchyUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    if (!uploadedFile.name.match(/\.(csv|xlsx)$/i)) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a CSV or Excel file",
      });
      return;
    }

    setFile(uploadedFile);
    setUploadError(null);
  };

  const handleDeleteFile = () => {
    setFile(null);
    setUploadError(null);
    const fileInput = document.getElementById('product-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleUpload = async () => {
    if (!file || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload",
      });
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create a record in temp_hierarchy_uploads
      const { data: uploadRecord, error: uploadRecordError } = await supabase
        .from('temp_hierarchy_uploads')
        .insert({
          filename: crypto.randomUUID(),
          original_name: file.name,
          file_type: file.name.split('.').pop()?.toLowerCase() || '',
          hierarchy_type: 'product',
          storage_path: `product/${crypto.randomUUID()}.${file.name.split('.').pop()}`,
          processed_by: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (uploadRecordError) throw uploadRecordError;

      // Upload the file to storage
      const { error: storageError } = await supabase.storage
        .from('hierarchy-uploads')
        .upload(uploadRecord.storage_path, file);

      if (storageError) throw storageError;

      // Call the process-hierarchy function
      const { error: processingError } = await supabase.functions
        .invoke('process-hierarchy', {
          body: { 
            fileName: uploadRecord.storage_path,
            type: 'product'
          }
        });

      if (processingError) throw processingError;

      toast({
        title: "Success",
        description: "File uploaded and processing started",
      });

      setFile(null);
      const fileInput = document.getElementById('product-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'An error occurred during upload');
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error uploading your file",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Product Hierarchy</h3>
        <div className="space-y-4">
          {uploadError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}

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
              disabled={isUploading}
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

          {file && (
            <Button 
              onClick={handleUpload} 
              className="w-full"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload and Process"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
