
import { supabase } from './supabaseClient'; 
import Papa from 'papaparse';

// Function to handle location data upload from CSV
export const uploadLocation = async (file: File) => {
  try {
    // Parse the CSV file
    const parseResult = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: resolve,
        error: reject,
        skipEmptyLines: true
      });
    });

    // Check if data was successfully parsed
    if (!parseResult.data || parseResult.data.length === 0) {
      console.error('No data found in the CSV file');
      return false;
    }

    console.log('Parsed location data:', parseResult.data);

    // Map CSV data to the location_master table structure
    const locations = parseResult.data.map(row => ({
      warehouse: row.warehouse || '',
      region: row.region || null,
      city: row.city || null,
      channel: row.channel || null
    }));

    // Insert data into the location_master table
    const { error } = await supabase
      .from('location_master')
      .upsert(locations, {
        onConflict: 'warehouse',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error inserting location data:', error.message);
      return false;
    }

    console.log('Locations inserted successfully');
    return true;
  } catch (error) {
    console.error('Error processing location file:', error);
    return false;
  }
};
