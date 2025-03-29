
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";

const vendorFields: FieldDescription[] = [
  { name: "vendor_id", description: "Unique vendor identifier", required: true },
  { name: "name", description: "Vendor name", required: true },
  { name: "contact_person", description: "Primary contact person", required: true },
  { name: "email", description: "Contact email address", required: true },
  { name: "phone", description: "Contact phone number", required: true },
  { name: "address", description: "Vendor address", required: false },
  { name: "city", description: "Vendor city", required: false },
  { name: "state", description: "Vendor state/province", required: false },
  { name: "country", description: "Vendor country", required: false },
  { name: "payment_terms", description: "Standard payment terms (e.g., Net 30)", required: false },
  { name: "lead_time", description: "Average lead time in days", required: false },
];

const VendorUpload = () => {
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
        description: `${data.length} vendors have been uploaded.`,
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
        title="Vendor Data Upload Instructions"
        description="Upload your vendor data using CSV or Excel format. The file should include the fields below."
        fields={vendorFields}
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

export default VendorUpload;
