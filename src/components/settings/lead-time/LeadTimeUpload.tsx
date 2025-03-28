
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FileUpload from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const LeadTimeUpload = () => {
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleUploadComplete = (files: File[]) => {
    console.log(`Uploaded ${files.length} files`);
    if (files.length > 0) {
      toast({
        title: getTranslation('common.success', language),
        description: "Lead time data uploaded successfully"
      });
    }
  };

  const handleError = (error: string) => {
    console.error("Upload error:", error);
    toast({
      variant: "destructive",
      title: getTranslation('common.error', language),
      description: error
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Time Data Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your lead time data in CSV or Excel format.
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

export default LeadTimeUpload;
