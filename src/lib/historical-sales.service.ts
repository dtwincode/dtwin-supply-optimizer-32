
import { supabase } from './supabaseClient';
import Papa from 'papaparse';

// Function to handle historical sales data upload from CSV
export const uploadHistoricalSales = async (file: File) => {
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

    console.log('Parsed historical sales data:', parseResult.data);

    // Map CSV data to the historical_sales_data table structure
    const salesData = parseResult.data.map(row => ({
      sales_date: row.sales_date || new Date().toISOString().split('T')[0],
      product_id: row.product_id || null,
      location_id: row.location_id || null,
      quantity_sold: parseInt(row.quantity_sold) || 0,
      revenue: parseFloat(row.revenue) || 0,
      vendor_id: row.vendor_id || null
    }));

    // Insert data into the historical_sales_data table
    const { error } = await supabase
      .from('historical_sales_data')
      .insert(salesData);

    if (error) {
      console.error('Error inserting historical sales data:', error.message);
      return false;
    }

    console.log('Historical sales data inserted successfully');
    return true;
  } catch (error) {
    console.error('Error processing historical sales file:', error);
    return false;
  }
};
