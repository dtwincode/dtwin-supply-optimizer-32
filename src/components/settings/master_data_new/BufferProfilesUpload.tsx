
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";

interface BufferProfilesUploadProps {
  onDataUploaded: () => void;
}

const bufferProfileFields: FieldDescription[] = [
  { name: "name", description: "Unique name for the buffer profile", required: true },
  { name: "variabilityFactor", description: "Demand variability level (low_variability, medium_variability, high_variability)", required: true },
  { name: "leadTimeFactor", description: "Lead time classification (short, medium, long)", required: true },
  { name: "moq", description: "Minimum Order Quantity for the product", required: false },
  { name: "lotSizeFactor", description: "Factor used to calculate lot sizes for ordering", required: false },
  { name: "description", description: "Detailed description of the buffer profile", required: false },
];

const BufferProfilesUpload: React.FC<BufferProfilesUploadProps> = ({ onDataUploaded }) => {
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
        description: `${data.length} buffer profiles have been uploaded.`,
      });
      
      if (onDataUploaded) {
        onDataUploaded();
      }
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
        title="Buffer Profiles Upload Instructions"
        description="Upload your buffer profiles data using CSV or Excel format. The file should include the fields below."
        fields={bufferProfileFields}
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

export default BufferProfilesUpload;
