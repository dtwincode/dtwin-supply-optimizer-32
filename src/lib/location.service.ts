
import { supabase } from '@/integrations/supabase/client'; 
import Papa from 'papaparse';

// Define the type for a location row
interface LocationRow {
  warehouse: string;
  region?: string | null;
  city?: string | null;
  channel?: string | null;
}

// Function to handle location data upload from CSV
export const uploadLocation = async (file: File) => {
  try {
    // Parse the CSV file
    const parseResult = await new Promise<Papa.ParseResult<LocationRow>>((resolve, reject) => {
      Papa.parse<LocationRow>(file, {
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

    // Deduplicate data based on warehouse field
    const uniqueLocations = new Map();
    parseResult.data.forEach(row => {
      if (row.warehouse) {
        uniqueLocations.set(row.warehouse, {
          warehouse: row.warehouse || '',
          region: row.region || null,
          city: row.city || null,
          channel: row.channel || null
        });
      }
    });

    // Convert Map to array of unique location objects
    const locations = Array.from(uniqueLocations.values());

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
