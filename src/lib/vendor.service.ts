
import { supabase } from './supabaseClient';
import Papa from 'papaparse';

// Function to handle vendor data upload from CSV
export const uploadVendor = async (file: File) => {
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

    console.log('Parsed vendor data:', parseResult.data);

    // Map CSV data to the vendor_master table structure
    const vendors = parseResult.data.map(row => ({
      vendor_code: row.vendor_code || '',
      vendor_name: row.vendor_name || '',
      contact_person: row.contact_person || null,
      contact_email: row.contact_email || null,
      phone_number: row.phone_number || null,
      country: row.country || null,
      region: row.region || null,
      city: row.city || null,
      payment_terms: row.payment_terms || null,
      tax_number: row.tax_number || null,
      is_active: row.is_active === 'true' || row.is_active === '1' || row.is_active === 'yes' || true
    }));

    // Insert data into the vendor_master table
    const { error } = await supabase
      .from('vendor_master')
      .upsert(vendors, { 
        onConflict: 'vendor_code',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error inserting vendor data:', error.message);
      return false;
    }

    console.log('Vendors inserted successfully');
    return true;
  } catch (error) {
    console.error('Error processing vendor file:', error);
    return false;
  }
};
