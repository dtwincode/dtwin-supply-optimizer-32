
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";

const historicalSalesFields: FieldDescription[] = [
  { name: "date", description: "Sale date (YYYY-MM-DD format)", required: true },
  { name: "product_id", description: "Product identifier (SKU)", required: true },
  { name: "location_id", description: "Location identifier", required: true },
  { name: "quantity", description: "Quantity sold", required: true },
  { name: "revenue", description: "Total revenue amount", required: true },
  { name: "channel", description: "Sales channel (e.g., online, retail, wholesale)", required: false },
  { name: "customer_segment", description: "Customer segment/type", required: false },
  { name: "promotion_id", description: "Identifier for any active promotion", required: false },
  { name: "discount_amount", description: "Discount amount applied", required: false },
  { name: "cost_of_goods", description: "Cost of goods sold", required: false },
];

const HistoricalSalesUpload = () => {
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
        description: `${data.length} historical sales records have been uploaded.`,
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
        title="Historical Sales Data Upload Instructions"
        description="Upload your historical sales data using CSV or Excel format. The file should include the fields below."
        fields={historicalSalesFields}
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

export default HistoricalSalesUpload;
