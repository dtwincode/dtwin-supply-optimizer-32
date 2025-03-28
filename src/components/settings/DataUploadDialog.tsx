
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/settings/upload/FileUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface DataUploadDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  tableName: string;
  module: string;
  onDataUploaded: () => void;
}

const DataUploadDialog = ({ 
  open, 
  onClose, 
  title, 
  tableName, 
  module, 
  onDataUploaded 
}: DataUploadDialogProps) => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // This function would normally process the file data
  const processUploadedFiles = (files: File[]): any[] => {
    // This is a placeholder. In a real app, you'd parse the file content
    return files.map((file, index) => ({
      id: index,
      fileName: file.name,
      fileSize: file.size,
      status: 'processed'
    }));
  };

  const handleUploadComplete = (files: File[]) => {
    const processedData = processUploadedFiles(files);
    setUploadedData(processedData);
    setError(null);
    console.log(`Uploaded ${files.length} files containing ${processedData.length} records for ${module} module to ${tableName} table`);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSave = async () => {
    if (uploadedData.length === 0) {
      setError("No data to save. Please upload a file first.");
      return;
    }

    setUploading(true);
    try {
      // In a real application, you would send the data to your backend here
      console.log(`Saving ${uploadedData.length} records to ${tableName}`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onDataUploaded();
      onClose();
    } catch (err) {
      setError("Failed to save data. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            onError={handleError}
            allowedFileTypes={['.csv', '.xlsx']}
          />
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {uploadedData.length > 0 && (
            <div>
              <p className="text-sm mb-2">{uploadedData.length} records parsed successfully.</p>
              <Button 
                onClick={handleSave} 
                disabled={uploading}
                className="w-full"
              >
                {uploading ? "Saving..." : "Save Data"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DataUploadDialog;
