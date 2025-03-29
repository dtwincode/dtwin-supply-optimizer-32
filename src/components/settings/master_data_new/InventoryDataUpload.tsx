
import React, { useState } from 'react';
import { uploadInventoryData } from '@/lib/inventory-data.service';
import { useToast } from '@/components/ui/use-toast';

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
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Inventory Data Upload</h2>
      <p className="mb-4 text-sm text-gray-600">
        Upload your inventory data using CSV format. File should include the following columns: sku, name, current_stock, location, category (optional), subcategory (optional).
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Inventory CSV File</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className={`px-4 py-2 text-white rounded transition-colors ${
            isUploading 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload Inventory Data'}
        </button>
        {status && (
          <div className={`mt-4 p-2 rounded text-sm ${status.includes('✅') ? 'bg-green-50 text-green-700' : status.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDataUpload;
