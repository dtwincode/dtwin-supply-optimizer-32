
import { supabase } from './supabaseClient'; // Import the supabase client

// Function to handle location file upload
export const uploadLocation = async (file: File) => {
  const bucketName = 'locations'; // Define your storage bucket name
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(`location/${file.name}`, file);

  if (error) {
    console.error('Error uploading location file:', error.message);
    return false; // Return false if there's an error
  }

  console.log('Location uploaded successfully:', data);
  return true; // Return true if the upload is successful
};
