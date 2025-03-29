
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";
import { uploadHistoricalSales } from "@/lib/historical-sales.service";
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUploadComplete = async (data: any[], fileName: string) => {
    try {
      setUploading(true);
      setUploadStatus('idle');
      setErrorMessage(null);
      
      // Create a file object from the parsed data
      const fileContent = data.length > 0 ? new Blob([JSON.stringify(data)]) : new Blob();
      const file = new File([fileContent], fileName, { type: fileName.endsWith('.csv') ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      const result = await uploadHistoricalSales(file);
      
      if (result.success) {
        setUploadStatus('success');
        toast({
          title: "Upload successful",
          description: `${result.recordCount} historical sales records have been uploaded.`,
        });
        return true;
      } else {
        setUploadStatus('error');
        setErrorMessage(result.error || "Unknown error occurred");
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: result.error || "There was an error processing your historical sales data.",
        });
        return false;
      }
    } catch (error) {
      setUploadStatus('error');
      const errorMsg = error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(errorMsg);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: errorMsg,
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
      
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300">Important Note</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Make sure your CSV or Excel file contains the exact field names listed above to ensure proper data mapping. 
                The product_id and location_id fields must contain valid UUIDs that exist in your product and location tables.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
            <p className="text-sm">{errorMessage || "There was an error processing your data. Please check the file format and try again."}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoricalSalesUpload;
