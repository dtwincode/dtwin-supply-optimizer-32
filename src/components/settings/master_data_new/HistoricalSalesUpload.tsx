
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";
import { uploadHistoricalSales } from "@/lib/historical-sales.service";
import { AlertCircle, CheckCircle, Info, FileType } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const historicalSalesFields: FieldDescription[] = [
  { name: "sales_date", description: "Sale date (YYYY-MM-DD format)", required: true },
  { name: "product_id", description: "Product identifier (UUID)", required: true },
  { name: "location_id", description: "Location identifier (UUID)", required: true },
  { name: "quantity_sold", description: "Quantity sold", required: true },
  { name: "revenue", description: "Total revenue amount", required: true },
  { name: "vendor_id", description: "Vendor identifier (UUID)", required: false },
  { name: "unit_price", description: "Price per unit (calculated if not provided)", required: false },
];

// Sample CSV content for download
const sampleCSVContent = `sales_date,product_id,location_id,quantity_sold,revenue,vendor_id,unit_price
2023-01-01,550e8400-e29b-41d4-a716-446655440000,f47ac10b-58cc-4372-a567-0e02b2c3d479,10,1000,b5a0d4a2-cc90-4e4b-8a46-0bb95eca1886,100
2023-01-02,38a3ebd0-1cf2-4c3a-8f09-fe0c1a789eed,8d9f90bb-8040-4b8a-8228-013d5f8ceae4,5,750,57f456a2-3d5d-49f3-a58e-eb2b5bde089e,150`;

const HistoricalSalesUpload = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidatingFormat, setIsValidatingFormat] = useState(false);

  const handleUploadComplete = async (data: any[], fileName: string) => {
    try {
      setUploading(true);
      setUploadStatus('idle');
      setErrorMessage(null);
      setIsValidatingFormat(true);
      
      // Create a file object from the parsed data
      const fileType = fileName.endsWith('.csv') ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
      // Check if we have data to process
      if (!data || data.length === 0) {
        setUploadStatus('error');
        setErrorMessage("No data found in the file. Please check the file format.");
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "No data found in the file. Please check the file format."
        });
        setIsValidatingFormat(false);
        return false;
      }
      
      // Log the structure for debugging
      console.log('Data structure received:', 
        Array.isArray(data) ? `Array with ${data.length} items` : typeof data,
        'First item sample:', data.length > 0 ? data[0] : 'empty'
      );
      
      // Create a Blob and File from the data
      let fileContent: Blob;
      if (fileName.endsWith('.csv')) {
        // Create CSV content from the data
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csvContent = [headers, ...rows].join('\n');
        fileContent = new Blob([csvContent], { type: 'text/csv' });
      } else {
        // For Excel, just stringify the JSON data
        fileContent = new Blob([JSON.stringify(data)], { type: fileType });
      }
      
      const file = new File([fileContent], fileName, { type: fileType });
      
      // Process the file
      setIsValidatingFormat(false);
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
      setIsValidatingFormat(false);
    }
  };

  const downloadSampleCSV = () => {
    const element = document.createElement("a");
    const file = new Blob([sampleCSVContent], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = "historical_sales_sample.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                Make sure your CSV or Excel file contains the exact field names listed above to ensure proper data mapping. 
                The product_id and location_id fields must contain valid UUIDs that exist in your product and location tables.
              </p>
              <button 
                onClick={downloadSampleCSV}
                className="text-sm inline-flex items-center px-3 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-md hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
              >
                <FileType className="h-4 w-4 mr-2" />
                Download Sample CSV
              </button>
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
      
      {isValidatingFormat && (
        <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200 animate-pulse">
          <Info className="h-4 w-4" />
          <AlertTitle>Validating file format</AlertTitle>
          <AlertDescription>
            Checking file structure and preparing data for upload...
          </AlertDescription>
        </Alert>
      )}
      
      {uploadStatus === 'success' && (
        <Alert className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Upload successful</AlertTitle>
          <AlertDescription>
            The historical sales data has been successfully processed and saved.
          </AlertDescription>
        </Alert>
      )}
      
      {uploadStatus === 'error' && (
        <Alert className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Upload failed</AlertTitle>
          <AlertDescription>
            {errorMessage || "There was an error processing your data. Please check the file format and try again."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default HistoricalSalesUpload;
