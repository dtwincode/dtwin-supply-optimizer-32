
import React, { useState } from "react";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { UploadInstructions, FieldDescription } from "./components/UploadInstructions";
import { AlertCircle, CheckCircle, FileType } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

interface BufferProfilesUploadProps {
  onDataUploaded?: () => void;
}

// Field definitions exactly matching the buffer_profiles table schema
const bufferProfileFields: FieldDescription[] = [
  { name: "name", description: "Buffer profile name", required: true },
  { name: "description", description: "Detailed description of the buffer profile", required: false },
  { name: "variability_factor", description: "Demand variability level (high_variability, medium_variability, low_variability)", required: false },
  { name: "lead_time_factor", description: "Lead time classification (short, medium, long)", required: false },
  { name: "moq", description: "Minimum Order Quantity", required: false },
  { name: "lot_size_factor", description: "Factor used to calculate lot sizes for ordering", required: false }
];

// Sample CSV content for download - exactly matching the field names in database
const sampleCSVContent = `name,description,variability_factor,lead_time_factor,moq,lot_size_factor
High Variability Short Lead Time,For products with high demand variability and short lead times,high_variability,short,100,1.5
Medium Variability Medium Lead Time,Standard profile for average products,medium_variability,medium,50,1.2
Low Variability Long Lead Time,For stable products with long lead times,low_variability,long,200,2.0`;

const BufferProfilesUpload: React.FC<BufferProfilesUploadProps> = ({ onDataUploaded }) => {
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
      
      // Here you would typically process the data and upload it to the database
      // For now, we'll just simulate a successful upload
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStatus('success');
      toast({
        title: "Upload successful",
        description: `${data.length} buffer profiles have been uploaded.`,
      });
      
      if (onDataUploaded) {
        onDataUploaded();
      }
      
      return true;
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
    element.download = "buffer_profiles_sample.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      <UploadInstructions
        title="Buffer Profiles Upload Instructions"
        description="Upload your buffer profiles data using CSV format. The file should include the exact field names shown below to match the database structure."
        fields={bufferProfileFields}
      />
      
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700">
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-300">Important Note</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                Make sure your CSV file contains the exact field names listed above to ensure proper data mapping.
                The name field must be unique across all buffer profiles.
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
            The buffer profiles data has been successfully processed and saved.
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

export default BufferProfilesUpload;
