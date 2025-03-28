
import React, { useState } from 'react';
import { uploadVendor } from '@/lib/vendor.service';
import FileUpload from "@/components/settings/upload/FileUpload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const VendorUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadComplete = async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setUploading(true);
    setError(null);
    
    try {
      const success = await uploadVendor(file);
      if (success) {
        alert('Vendor file uploaded successfully!');
      } else {
        setError('Failed to upload vendor file.');
      }
    } catch (error) {
      console.error('Error during vendor upload:', error);
      setError('An error occurred during the upload process.');
    } finally {
      setUploading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Vendor Data</CardTitle>
      </CardHeader>
      <CardContent>
        <FileUpload
          onUploadComplete={handleUploadComplete}
          onError={handleError}
          allowedFileTypes={[".csv", ".xlsx"]}
        />
        {uploading && <p>Uploading...</p>}
        {error && <p>Error: {error}</p>}
      </CardContent>
    </Card>
  );
};

export default VendorUpload;
