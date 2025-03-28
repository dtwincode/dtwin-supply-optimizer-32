
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FileUpload from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTranslation } from "@/translations";

const LocationHierarchyUpload = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const handleUploadComplete = (files: File[]) => {
    console.log(`Uploaded ${files.length} files`);
    
    if (files.length > 0) {
      toast({
        title: getTranslation('settings.upload.success', language),
        description: "Location hierarchy uploaded successfully"
      });
    }
  };

  const handleError = (error: string) => {
    console.error("Upload error:", error);
    toast({
      variant: "destructive",
      title: getTranslation('settings.upload.error', language),
      description: error
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getTranslation('settings.masterData.locationHierarchy', language)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {getTranslation('settings.upload.description', language)}
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

export default LocationHierarchyUpload;
