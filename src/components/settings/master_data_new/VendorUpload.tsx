
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";
import { uploadVendor } from "@/lib/vendor.service";
import { AlertCircle, CheckCircle, FileType } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

// Field definitions exactly matching the vendor_master table schema
const vendorFields: FieldDescription[] = [
  { name: "vendor_code", description: "Unique vendor identifier", required: true },
  { name: "vendor_name", description: "Vendor name", required: true },
  { name: "contact_person", description: "Primary contact person", required: false },
  { name: "contact_email", description: "Contact email address", required: false },
  { name: "phone_number", description: "Contact phone number", required: false },
  { name: "country", description: "Vendor country", required: false },
  { name: "region", description: "Regional classification", required: false },
  { name: "city", description: "Vendor city", required: false },
  { name: "payment_terms", description: "Standard payment terms", required: false },
  { name: "tax_number", description: "Tax identification number", required: false },
  { name: "is_active", description: "Vendor status (true/false)", required: false }
];

// Sample CSV content for download - exactly matching the field names in database
const sampleCSVContent = `vendor_code,vendor_name,contact_person,contact_email,phone_number,country,region,city,payment_terms,tax_number,is_active
VEN001,ABC Suppliers,John Smith,john@abcsuppliers.com,+1234567890,USA,West,Los Angeles,Net 30,123-456-789,true
VEN002,XYZ Manufacturing,Jane Doe,jane@xyzmanufacturing.com,+9876543210,Canada,East,Toronto,Net 60,987-654-321,true
VEN003,Global Distributors,Mike Johnson,mike@globaldist.com,+1122334455,UK,London,Central,Net 45,456-789-123,true`;

const VendorUpload = () => {
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
      
      // Create a Blob and File from the data
      let fileContent: Blob;
      if (fileName.endsWith('.csv')) {
        // Create CSV content from the data
        const headers = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csvContent = [headers, ...rows].join('\n');
        fileContent = new Blob([csvContent], { type: 'text/csv' });
      } else {
        // Just stringify the JSON data
        fileContent = new Blob([JSON.stringify(data)], { type: 'application/json' });
      }
      
      const file = new File([fileContent], fileName, { 
        type: fileName.endsWith('.csv') ? 'text/csv' : 'application/json' 
      });

      // Upload the vendor data
      const result = await uploadVendor(file);
      
      if (result) {
        setUploadStatus('success');
        toast({
          title: "Upload successful",
          description: `${data.length} vendors have been uploaded.`,
        });
      } else {
        setUploadStatus('error');
        setErrorMessage("Failed to upload vendor data. Please check the file format.");
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error processing your vendor data.",
        });
      }
      
      return result;
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

  const downloadSampleCSV = () => {
    const element = document.createElement("a");
    const file = new Blob([sampleCSVContent], {type: 'text/csv'});
    element.href = URL.createObjectURL(file);
    element.download = "vendor_sample.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <UploadInstructions
        title="Vendor Data Upload Instructions"
        description="Upload your vendor data using CSV format. The file should include the exact field names shown below to match the database structure."
        fields={vendorFields}
      />
      
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300">Important Note</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                Make sure your CSV file contains the exact field names listed above to ensure proper data mapping.
                The vendor_code field must be unique across all vendors.
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
        allowedFileTypes={[".csv"]}
        maxSize={5}
      />
      
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">Processing... {progress}%</p>
        </div>
      )}
      
      {uploadStatus === 'success' && (
        <Alert className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Upload successful</AlertTitle>
          <AlertDescription>
            The vendor data has been successfully processed and saved.
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

export default VendorUpload;
