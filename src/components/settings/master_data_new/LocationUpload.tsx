import React, { useState } from 'react';
import { uploadLocation } from '@/lib/location.service';
import FileUpload from "@/components/settings/upload/FileUpload";

const LocationHierarchyUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelected = (selectedFile: File) => {
    setFile(selectedFile);
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
      <FileUpload onFileSelected={handleFileSelected} />
      <button onClick={handleUpload} disabled={!file}>
        Upload Location
      </button>
    </div>
  );
};

export default LocationHierarchyUpload;
