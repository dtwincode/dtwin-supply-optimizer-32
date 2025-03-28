
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import FileUpload from '@/components/settings/upload/FileUpload';
import { uploadDocument } from '@/services/logisticsDocumentService';

export const DocumentUpload = () => {
  const [uploading, setUploading] = useState(false);

  const handleUploadComplete = async (files: File[]) => {
    if (files.length === 0) return;
    
    setUploading(true);
    try {
      // Process each file
      for (const file of files) {
        const result = await uploadDocument(file);
        if (result.success) {
          toast.success(`Document ${file.name} uploaded successfully`);
        } else {
          toast.error(`Failed to upload ${file.name}: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('An error occurred while uploading documents');
    } finally {
      setUploading(false);
    }
  };

  const handleError = (error: string) => {
    toast.error(error);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload shipping documents, invoices, certificates, and other logistics paperwork.
          </p>
          
          <FileUpload 
            onUploadComplete={handleUploadComplete}
            onError={handleError}
            allowedFileTypes={['.pdf', '.docx', '.xlsx', '.jpg', '.png']}
            maxSizeMB={10}
          />
          
          <div className="text-xs text-muted-foreground">
            Supported formats: PDF, DOCX, XLSX, JPG, PNG (Max size: 10MB)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
