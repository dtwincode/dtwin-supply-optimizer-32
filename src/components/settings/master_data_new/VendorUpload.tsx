import React, { useState } from 'react';
import { uploadVendor } from '@/lib/vendor.service';
import FileUpload from "@/components/settings/upload/FileUpload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const VendorUpload = () => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelected = async (file: File) => {
    setUploading(true);
    try {
      const success = await uploadVendor(file);
      if (success) {
        alert('Vendor file uploaded successfully!');
      } else {
        alert('Failed to upload vendor file.');
      }
    } catch (error) {
      console.error('Error during vendor upload:', error);
      alert('An error occurred during the upload process.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Vendor Data</CardTitle>
      </CardHeader>
      <CardContent>
        <FileUpload
          onFileSelected={handleFileSelected}
          acceptedFileTypes=".csv,.xlsx"
          label="Upload a CSV or XLSX file containing vendor data."
          supportedFormats="CSV, XLSX"
        />
        {uploading && <p>Uploading...</p>}
      </CardContent>
    </Card>
  );
};

export default VendorUpload;
