
import React, { useState } from 'react';
import { uploadProduct } from '@/lib/product.service';

const ProductUpload = () => {
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
    const result = await uploadProduct(file);
    setStatus(result ? '✅ Upload successful!' : '❌ Upload failed.');
  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Product Upload</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Upload
      </button>
      <p className="mt-2 text-sm">{status}</p>
    </div>
  );
};

export default ProductUpload;
