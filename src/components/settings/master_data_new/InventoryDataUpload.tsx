
import React, { useState } from 'react';
import { uploadInventoryData } from '@/lib/inventory-data.service';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const InventoryDataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{
    message: string;
    type: 'idle' | 'loading' | 'success' | 'error';
    details?: string;
  }>({ message: '', type: 'idle' });
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus({ 
        message: `Selected file: ${e.target.files[0].name}`, 
        type: 'idle' 
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus({ 
        message: 'Please select a file.', 
        type: 'error' 
      });
      toast({
        title: "Error",
        description: "Please select a file.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setStatus({ 
      message: 'Uploading...', 
      type: 'loading' 
    });
    
    try {
      const result = await uploadInventoryData(file);
      
      if (result.success) {
        setStatus({ 
          message: `Upload successful! ${result.count || ''} records processed.`, 
          type: 'success' 
        });
        toast({
          title: "Success",
          description: result.message,
          variant: "default"
        });
      } else {
        setStatus({ 
          message: 'Upload failed', 
          type: 'error',
          details: result.message || result.details
        });
        toast({
          title: "Error",
          description: result.message || "Upload failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error uploading inventory data:', error);
      setStatus({ 
        message: 'Upload failed', 
        type: 'error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      toast({
        title: "Error",
        description: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status.type) {
      case 'loading':
        return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="mr-2 h-4 w-4 text-red-500" />;
      default:
        return <Info className="mr-2 h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="border rounded-lg shadow-sm p-3">
      <h2 className="text-base font-medium mb-2">Inventory Data Upload</h2>
      <p className="mb-3 text-xs text-muted-foreground">
        Upload your inventory data using CSV format. Required columns: product_id, quantity_on_hand
      </p>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium mb-1">Select Inventory CSV File</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-xs text-gray-500
                    file:mr-2 file:py-1 file:px-2
                    file:rounded file:border-0
                    file:text-xs file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
          />
        </div>
        
        <Button
          onClick={handleUpload}
          disabled={isUploading || !file}
          size="sm"
          className="w-full flex items-center justify-center"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-3 w-3" />
              Upload Inventory Data
            </>
          )}
        </Button>

        {status.message && (
          <Alert 
            variant={status.type === 'error' ? "destructive" : 
                   status.type === 'success' ? "default" : "default"} 
            className="mt-2 py-2">
            <div className="flex items-center text-xs">
              {getStatusIcon()}
              <AlertDescription className="text-xs">
                {status.message}
                {status.details && (
                  <div className="mt-1 text-xs opacity-80 overflow-auto max-h-20">
                    {status.details}
                  </div>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground mt-3">
          <p className="font-medium">CSV Format Requirements:</p>
          <ul className="list-disc list-inside ml-2 space-y-0.5 mt-1">
            <li>Required: product_id, quantity_on_hand</li>
            <li>Optional: reserved_qty, location_id, buffer_profile_id</li>
            <li>Do not include available_qty column - it will be managed by the database</li>
            <li>Numeric fields: quantity_on_hand, reserved_qty</li>
            <li>Ensure that all rows have values for the required fields</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InventoryDataUpload;
