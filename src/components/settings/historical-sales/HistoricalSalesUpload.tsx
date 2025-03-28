
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FileUpload from "@/components/settings/upload/FileUpload";
import { Button } from '@/components/ui/button';

const HistoricalSalesUpload = () => {
  const handleUploadComplete = (files: File[]) => {
    console.log(`Uploaded ${files.length} files`);
    // In a real implementation, you would process the files here
  };

  const handleError = (error: string) => {
    console.error("Upload error:", error);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Sales Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your historical sales data in CSV or Excel format.
        </p>
        <FileUpload 
          onUploadComplete={handleUploadComplete} 
          onError={handleError}
          allowedFileTypes={[".csv", ".xlsx"]}
        />
      </CardContent>
    </Card>
  );
};

export default HistoricalSalesUpload;
