
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FileUpload from "@/components/settings/upload/FileUpload";
import { Button } from '@/components/ui/button';

const ReplenishmentUpload = () => {
  const handleUploadComplete = (data: any[], fileName: string) => {
    console.log(`Uploaded ${data.length} records from ${fileName}`);
  };

  const handleError = (error: string) => {
    console.error("Upload error:", error);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Replenishment Data Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your replenishment data in CSV or Excel format.
        </p>
        <FileUpload 
          onUploadComplete={handleUploadComplete} 
          onError={handleError}
        />
      </CardContent>
    </Card>
  );
};

export default ReplenishmentUpload;
