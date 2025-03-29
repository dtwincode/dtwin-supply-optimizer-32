
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";

const locationFields: FieldDescription[] = [
  { name: "location_id", description: "Unique location identifier", required: true },
  { name: "name", description: "Location name", required: true },
  { name: "type", description: "Location type (warehouse, store, distribution center)", required: true },
  { name: "address", description: "Location address", required: true },
  { name: "city", description: "City", required: true },
  { name: "state", description: "State/province", required: true },
  { name: "country", description: "Country", required: true },
  { name: "zip_code", description: "Postal/ZIP code", required: true },
  { name: "region", description: "Regional classification", required: false },
  { name: "latitude", description: "Geographical latitude", required: false },
  { name: "longitude", description: "Geographical longitude", required: false },
  { name: "capacity", description: "Storage capacity", required: false },
];

const LocationUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUploadComplete = async (data: any[], fileName: string) => {
    try {
      setUploading(true);
      
      // Process data...
      // This would typically include validation and API calls to save the data
      
      toast({
        title: "Upload successful",
        description: `${data.length} locations have been uploaded.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <UploadInstructions
        title="Location Data Upload Instructions"
        description="Upload your location data using CSV or Excel format. The file should include the fields below."
        fields={locationFields}
      />
      
      <FileUpload
        onUploadComplete={handleUploadComplete}
        onProgress={setProgress}
        allowedFileTypes={[".csv", ".xlsx"]}
        maxSize={5}
      />
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Processing... {progress}%</p>
        </div>
      )}
    </div>
  );
};

export default LocationUpload;
