
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";
import { uploadHistoricalSales } from "@/lib/historical-sales.service";

const historicalSalesFields: FieldDescription[] = [
  { name: "sales_date", description: "Sale date (YYYY-MM-DD format)", required: true },
  { name: "product_id", description: "Product identifier (UUID)", required: true },
  { name: "location_id", description: "Location identifier (UUID)", required: true },
  { name: "quantity_sold", description: "Quantity sold", required: true },
  { name: "revenue", description: "Total revenue amount", required: true },
  { name: "vendor_id", description: "Vendor identifier (UUID)", required: false },
  { name: "unit_price", description: "Price per unit (calculated if not provided)", required: false },
];

const HistoricalSalesUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUploadComplete = async (data: any[], fileName: string) => {
    try {
      setUploading(true);
      
      // Process data...
      const success = await uploadHistoricalSales(new File(
        [new Blob([JSON.stringify(data)])], 
        fileName, 
        { type: 'application/json' }
      ));
      
      if (success) {
        toast({
          title: "Upload successful",
          description: `${data.length} historical sales records have been uploaded.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error processing your historical sales data.",
        });
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
