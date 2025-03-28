import { supabase } from './supabaseClient'; // Import the supabase client

// Function to handle product file upload
export const uploadProduct = async (file: File) => {
  const bucketName = 'products';  // Define your storage bucket name
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`product/${file.name}`, file);

  if (error) {
    console.error('Error uploading product file:', error.message);
    return false; // Return false if there's an error
  }

  console.log('Product uploaded successfully:', data);
  return true; // Return true if the upload is successful
};
