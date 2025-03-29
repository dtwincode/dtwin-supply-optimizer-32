
import React, { useState } from 'react';
import { uploadInventoryData } from '@/lib/inventory-data.service';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const InventoryDataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file.');
      toast({
        title: "Error",
        description: "Please select a file.",
        variant: "destructive"
      });
      return;
    }

    setStatus('Uploading...');
    setIsUploading(true);
    
    try {
      const result = await uploadInventoryData(file);
      
      if (result) {
        setStatus('✅ Upload successful!');
        toast({
          title: "Success",
          description: "Inventory data uploaded successfully!",
          variant: "default"
        });
      } else {
        setStatus('❌ Upload failed.');
        toast({
          title: "Error",
          description: "Failed to upload inventory data. Please check console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error uploading inventory data:', error);
      setStatus('❌ Upload failed.');
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
    <div className="border rounded-lg shadow-sm p-3">
      <h2 className="text-base font-medium mb-2">Inventory Data Upload</h2>
      <p className="mb-3 text-xs text-muted-foreground">
        Upload your inventory data using CSV format. Include columns: sku, name, current_stock, location, etc.
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
          disabled={isUploading}
          size="sm"
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Inventory Data'
          )}
        </Button>
        {status && (
          <div className={`mt-2 p-1.5 rounded text-xs ${status.includes('✅') ? 'bg-green-50 text-green-700' : status.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDataUpload;
