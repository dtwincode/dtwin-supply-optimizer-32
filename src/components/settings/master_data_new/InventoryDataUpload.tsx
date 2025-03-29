
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";

const inventoryDataFields: FieldDescription[] = [
  { name: "product_id", description: "Product identifier (SKU)", required: true },
  { name: "location_id", description: "Location identifier", required: true },
  { name: "quantity_on_hand", description: "Current inventory quantity", required: true },
  { name: "reserved_qty", description: "Quantity reserved for orders", required: false },
  { name: "available_qty", description: "Quantity available to sell (calculated)", required: false },
  { name: "reorder_point", description: "Quantity at which to reorder", required: false },
  { name: "max_stock_level", description: "Maximum stock level", required: false },
  { name: "min_stock_level", description: "Minimum stock level", required: false },
  { name: "lead_time", description: "Average lead time in days", required: false },
  { name: "buffer_profile_id", description: "Buffer profile identifier", required: false },
  { name: "last_updated", description: "Last inventory update date (YYYY-MM-DD)", required: false },
];

const InventoryDataUpload = () => {
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
        description: `${data.length} inventory records have been uploaded.`,
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
        title="Inventory Data Upload Instructions"
        description="Upload your inventory data using CSV or Excel format. The file should include the fields below."
        fields={inventoryDataFields}
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

export default InventoryDataUpload;
