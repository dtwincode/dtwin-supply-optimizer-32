
import { supabase } from './supabaseClient';
import Papa from 'papaparse';

// Function to handle product data upload from CSV 
export const uploadProduct = async (file: File) => {
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

    console.log('Parsed product data:', parseResult.data);

    // Map CSV data to the product_master table structure
    const products = parseResult.data.map(row => ({
      sku: row.sku || '',
      name: row.name || '',
      category: row.category || null,
      subcategory: row.subcategory || null,
      product_family: row.product_family || null,
      planning_priority: row.planning_priority || null,
      notes: row.notes || null
    }));

    // Insert data into the product_master table
    const { data, error } = await supabase
      .from('product_master')
      .upsert(products, { 
        onConflict: 'sku',
        ignoreDuplicates: false 
      });

    if (error) {
      console.error('Error inserting product data:', error.message);
      return false;
    }

    console.log('Products inserted successfully:', data);
    return true;
  } catch (error) {
    console.error('Error processing product file:', error);
    return false;
  }
};
