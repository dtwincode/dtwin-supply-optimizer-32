
import React, { useState } from 'react';
import { uploadVendor } from '@/lib/vendor.service'; 

const VendorUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('Please select a file.');
      return;
    }

    setStatus('Uploading...');
    const result = await uploadVendor(file);
    setStatus(result ? '✅ Upload successful!' : '❌ Upload failed.');
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Vendor Data Upload</h2>
      <p className="mb-4 text-sm text-gray-600">
        Upload your vendor data using CSV format. Make sure your file includes all required columns.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Vendor CSV File</label>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Upload Vendor Data
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

export default VendorUpload;
