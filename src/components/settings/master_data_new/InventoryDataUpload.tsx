
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileUp, Upload, AlertCircle, CheckCircle2, FileQuestion } from 'lucide-react';
import { uploadInventoryData } from '@/lib/inventory-data.service';

const InventoryDataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('error');
      toast({
        title: "Error",
        description: "Please select a file.",
        variant: "destructive"
      });
      return;
    }

    setStatus('uploading');
    setIsUploading(true);
    
    try {
      const result = await uploadInventoryData(file);
      
      if (result) {
        setStatus('success');
        toast({
          title: "Success",
          description: "Inventory data uploaded successfully!",
          variant: "default"
        });
      } else {
        setStatus('error');
        toast({
          title: "Error",
          description: "Failed to upload inventory data. Please check console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error uploading inventory data:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inventory Data Upload</h2>
        <p className="text-muted-foreground">
          Upload your inventory data using CSV format
        </p>
      </div>

      <Card className="bg-white dark:bg-gray-900 border shadow-sm overflow-hidden">
        <CardContent className="p-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <p className="font-medium">Select Inventory CSV File</p>
              <div className="flex items-center gap-2">
                <label 
                  htmlFor="file-upload" 
                  className="cursor-pointer inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md transition-colors"
                >
                  <FileQuestion className="h-4 w-4" />
                  Choose File
                </label>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                <span className="text-sm text-gray-500">
                  {file ? file.name : "No file chosen"}
                </span>
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Inventory Data
                </>
              )}
            </Button>

            {status === 'success' && (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertDescription className="ml-2">
                  Successfully uploaded inventory data
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="ml-2">
                  Failed to upload inventory data
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* CSV Format Requirements */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">CSV Format Requirements:</h3>
            <ul className="space-y-2 list-disc list-inside text-sm">
              <li><span className="font-semibold">Required fields:</span> product_id, quantity_on_hand</li>
              <li><span className="font-semibold">Optional fields:</span> reserved_qty, location_id, buffer_profile_id</li>
              <li>Do not include available_qty column - it will be managed by the database</li>
              <li>Numeric fields: quantity_on_hand, reserved_qty</li>
              <li>Ensure that all rows have values for the required fields</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryDataUpload;
