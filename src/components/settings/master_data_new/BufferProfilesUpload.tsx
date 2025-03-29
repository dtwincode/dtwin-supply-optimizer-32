
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/settings/upload/FileUpload";
import { processDataByModule } from "@/components/settings/data-processing/processDataByModule";
import { supabase } from "@/integrations/supabase/client";
import { BufferProfile } from "@/types/inventory";

export interface BufferProfilesUploadProps {
  onDataUploaded?: (data: any) => void;
}

const BufferProfilesUpload: React.FC<BufferProfilesUploadProps> = ({ onDataUploaded }) => {
  const [uploadedData, setUploadedData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (data: any[], fileName: string) => {
    setUploadedData(data);
    setError(null);
    
    toast({
      title: "Data upload success",
      description: `Uploaded ${data.length} records from ${fileName}`,
    });
    
    if (onDataUploaded) {
      onDataUploaded(data);
    }
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: errorMessage,
    });
  };

  const handleSaveData = async () => {
    if (!uploadedData.length) {
      toast({
        variant: "destructive",
        title: "No data",
        description: "Please upload buffer profile data first",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Process the data and save it
      const result = await processDataByModule('buffer_profiles', uploadedData, []);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        // Clear uploaded data
        setUploadedData([]);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error saving buffer profiles:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save buffer profiles",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200 dark:bg-gray-800 dark:border-gray-700">
        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="ml-2">
          <div className="font-medium mb-2">Upload buffer profiles with required fields:</div>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant="outline" className="bg-white dark:bg-gray-700">name</Badge>
            <Badge variant="outline" className="bg-white dark:bg-gray-700">variability_factor</Badge>
            <Badge variant="outline" className="bg-white dark:bg-gray-700">lead_time_factor</Badge>
          </div>
          <div className="text-sm">
            <p className="mb-1"><strong>Optional fields:</strong></p>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary">description</Badge>
              <Badge variant="secondary">moq</Badge>
              <Badge variant="secondary">lot_size_factor</Badge>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <p><strong>variability_factor:</strong> 'low_variability', 'medium_variability', or 'high_variability'</p>
            <p><strong>lead_time_factor:</strong> 'short', 'medium', or 'long'</p>
          </div>
        </AlertDescription>
      </Alert>

      <Card className="bg-white dark:bg-gray-900 border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b">
          <CardTitle className="text-lg">Upload Buffer Profiles</CardTitle>
          <CardDescription>
            Upload CSV or Excel file with buffer profile data
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <FileUpload
              onUploadComplete={handleFileUpload}
              onError={handleUploadError}
              allowedFileTypes={[".csv", ".xlsx"]}
            />

            {uploadedData.length > 0 && (
              <div className="mt-6 space-y-4">
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <AlertDescription className="ml-2">
                    Successfully uploaded {uploadedData.length} buffer profiles
                  </AlertDescription>
                </Alert>
                
                <div className="border rounded-md p-4 max-h-60 overflow-auto bg-gray-50 dark:bg-gray-800">
                  <div className="text-sm font-medium mb-2">Preview of uploaded data:</div>
                  <pre className="text-xs whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(uploadedData.slice(0, 5), null, 2)}
                    {uploadedData.length > 5 && '...'}
                  </pre>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveData}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FileUp className="w-4 h-4 mr-2" />
                        Save Buffer Profiles
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BufferProfilesUpload;
