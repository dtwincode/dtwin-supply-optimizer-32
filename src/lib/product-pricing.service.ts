
import { supabase } from './supabaseClient';
import Papa from 'papaparse';

// Function to handle product pricing data upload from CSV
export const uploadProductPricing = async (file: File) => {
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

    console.log('Parsed product pricing data:', parseResult.data);

    // Map CSV data to the product_pricing table structure
    const pricingData = parseResult.data.map(row => ({
      product_id: row.product_id || null,
      price: parseFloat(row.price) || 0,
      effective_date: row.effective_date || new Date().toISOString().split('T')[0],
      location_id: row.location_id || null,
      vendor_id: row.vendor_id || null,
      currency: row.currency || 'SAR'
    }));

    // Insert data into the product_pricing-master table
    const { error } = await supabase
      .from('product_pricing-master')
      .insert(pricingData);

    if (error) {
      console.error('Error inserting product pricing data:', error.message);
      return false;
    }

    console.log('Product pricing data inserted successfully');
    return true;
  } catch (error) {
    console.error('Error processing product pricing file:', error);
    return false;
  }
};
