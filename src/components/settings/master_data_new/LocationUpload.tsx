
import React, { useState } from 'react';
import { uploadLocation } from '@/lib/location.service';
import FileUpload from "@/components/settings/upload/FileUpload";

const LocationHierarchyUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUploadComplete = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (file) {
      const success = await uploadLocation(file);
      if (success) {
        alert('Location uploaded successfully!');
      } else {
        alert('Location upload failed.');
      }
    } else {
      alert('Please select a file.');
    }
  };

  return (
    <div>
      <h2>Upload Location Hierarchy</h2>
      <FileUpload 
        onUploadComplete={handleUploadComplete}
        allowedFileTypes={[".csv", ".xlsx"]}
      />
      <button onClick={handleUpload} disabled={!file}>
        Upload Location
      </button>
    </div>
  );
};

export default LocationHierarchyUpload;
