
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { uploadLocation } from '@/lib/location.service';
import FileUpload from "@/components/settings/upload/FileUpload";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/translations';

const LocationHierarchyUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { language } = useLanguage();

  const handleUploadComplete = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleError = (error: string) => {
    toast({
      variant: "destructive",
      title: getTranslation('common.error', language),
      description: error
    });
  };

  const handleUpload = async () => {
    if (file) {
      const success = await uploadLocation(file);
      if (success) {
        toast({
          title: getTranslation('common.success', language),
          description: 'Location uploaded successfully!'
        });
      } else {
        toast({
          variant: "destructive",
          title: getTranslation('common.error', language),
          description: 'Location upload failed.'
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: getTranslation('common.warning', language),
        description: 'Please select a file.'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Location Hierarchy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Upload your location hierarchy data in CSV or Excel format.
        </p>
        
        <FileUpload 
          onUploadComplete={handleUploadComplete}
          onError={handleError}
          allowedFileTypes={[".csv", ".xlsx"]}
          multiple={false}
        />
        
        {file && (
          <div className="flex justify-end">
            <Button onClick={handleUpload}>
              Upload Location
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationHierarchyUpload;
