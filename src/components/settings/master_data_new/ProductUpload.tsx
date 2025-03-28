import React, { useState } from 'react';
import { uploadProduct } from '@/lib/product.service';
import FileUpload from "@/components/settings/upload/FileUpload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProductUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelected = async (file: File) => {
    setUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      const success = await uploadProduct(file);
      if (success) {
        setUploadSuccess(true);
      } else {
        setUploadError('Failed to upload product data.');
      }
    } catch (error: any) {
      setUploadError(error.message || 'An unexpected error occurred.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Product Data</CardTitle>
      </CardHeader>
      <CardContent>
        <FileUpload
          onFileSelected={handleFileSelected}
          acceptedFileTypes=".csv,.xlsx"
        />
        {uploading && <p>Uploading...</p>}
        {uploadSuccess && <p>Upload successful!</p>}
        {uploadError && <p>Error: {uploadError}</p>}
      </CardContent>
    </Card>
  );
};

export default ProductUpload;
