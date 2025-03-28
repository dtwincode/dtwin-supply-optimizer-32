import { supabase } from './supabaseClient'; // Import the supabase client

// Function to handle vendor file upload
export const uploadVendor = async (file: File) => {
  const bucketName = 'vendors'; // Define your vendor bucket name
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`vendor/${file.name}`, file);

  if (error) {
    console.error('Error uploading vendor file:', error.message);
    return false; // Return false if there's an error
  }

  console.log('Vendor uploaded successfully:', data);
  return true; // Return true if the upload is successful
};
