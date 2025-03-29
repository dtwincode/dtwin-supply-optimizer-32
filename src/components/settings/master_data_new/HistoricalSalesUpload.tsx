
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";
import { uploadHistoricalSales } from "@/lib/historical-sales.service";
import { AlertCircle, CheckCircle } from "lucide-react";

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
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUploadComplete = async (data: any[], fileName: string) => {
    try {
      setUploading(true);
      setUploadStatus('idle');
      
      const success = await uploadHistoricalSales(new File(
        [new Blob([JSON.stringify(data)])], 
        fileName, 
        { type: 'application/json' }
      ));
      
      if (success) {
        setUploadStatus('success');
        toast({
          title: "Upload successful",
          description: `${data.length} historical sales records have been uploaded.`,
        });
        return true;
      } else {
        setUploadStatus('error');
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error processing your historical sales data.",
        });
        return false;
      }
    } catch (error) {
      setUploadStatus('error');
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
      return false;
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
      
      {uploadStatus === 'success' && (
        <div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 p-4 rounded flex items-center gap-2">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <h4 className="font-medium">Upload successful</h4>
            <p className="text-sm">The historical sales data has been successfully processed and saved.</p>
          </div>
        </div>
      )}
      
      {uploadStatus === 'error' && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-4 rounded flex items-center gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div>
            <h4 className="font-medium">Upload failed</h4>
            <p className="text-sm">There was an error processing your data. Please check the file format and try again.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalSalesUpload;
