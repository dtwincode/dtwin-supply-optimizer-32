
import { supabase } from './supabaseClient';
import Papa from 'papaparse';

// Function to handle inventory data upload from CSV
export const uploadInventoryData = async (file: File) => {
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

    console.log('Parsed inventory data:', parseResult.data);

    // Map CSV data to the inventory_data table structure
    const inventoryData = parseResult.data.map(row => ({
      sku: row.sku || null,
      name: row.name || null,
      current_stock: parseInt(row.current_stock) || 0,
      min_stock: parseInt(row.min_stock) || 0,
      max_stock: parseInt(row.max_stock) || 0,
      location: row.location || null,
      category: row.category || null,
      subcategory: row.subcategory || null,
      product_family: row.product_family || null,
      region: row.region || null,
      city: row.city || null,
      channel: row.channel || null,
      warehouse: row.warehouse || null,
      lead_time_days: parseInt(row.lead_time_days) || null,
      adu: parseFloat(row.adu) || null,
      variability_factor: parseFloat(row.variability_factor) || null
    }));

    // Insert data into the inventory_data table
    const { error } = await supabase
      .from('inventory_data')
      .insert(inventoryData);

    if (error) {
      console.error('Error inserting inventory data:', error.message);
      return false;
    }

    console.log('Inventory data inserted successfully');
    return true;
  } catch (error) {
    console.error('Error processing inventory file:', error);
    return false;
  }
};
