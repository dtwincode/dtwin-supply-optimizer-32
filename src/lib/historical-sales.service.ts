
import { supabase } from './supabaseClient';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Function to handle historical sales data upload from CSV or Excel
export const uploadHistoricalSales = async (file: File) => {
  try {
    // Parse the file based on its type
    let parsedData;

    if (file.name.endsWith('.csv')) {
      // Parse CSV file
      const parseResult = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          complete: resolve,
          error: reject,
          skipEmptyLines: true
        });
      });

      if (!parseResult.data || parseResult.data.length === 0) {
        console.error('No data found in the CSV file');
        return { success: false, error: 'No data found in the CSV file' };
      }

      parsedData = parseResult.data;
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Parse Excel file
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      parsedData = XLSX.utils.sheet_to_json(worksheet);

      if (!parsedData || parsedData.length === 0) {
        console.error('No data found in the Excel file');
        return { success: false, error: 'No data found in the Excel file' };
      }
    } else {
      console.error('Unsupported file format');
      return { success: false, error: 'Unsupported file format. Please upload CSV or Excel files only.' };
    }

    console.log('Parsed historical sales data:', parsedData);

    // Map data to the historical_sales_data table structure
    const salesData = parsedData.map(row => {
      // Case-insensitive field matching to handle different column naming conventions
      const getField = (fieldNames: string[]) => {
        for (const name of fieldNames) {
          for (const key of Object.keys(row)) {
            if (key.toLowerCase() === name.toLowerCase()) {
              return row[key];
            }
          }
        }
        return null;
      };

      // Calculate unit price if quantity sold is provided and not zero
      const quantitySold = parseFloat(getField(['quantity_sold', 'quantity', 'qty', 'QUANTITY'])) || 0;
      const revenue = parseFloat(getField(['revenue', 'REVENUE', 'total_revenue'])) || 0;
      const unitPrice = quantitySold > 0 ? revenue / quantitySold : 
        parseFloat(getField(['unit_price', 'price', 'UNIT_PRICE'])) || null;

      return {
        sales_date: getField(['sales_date', 'date', 'DATE', 'sale_date']) || new Date().toISOString().split('T')[0],
        product_id: getField(['product_id', 'PRODUCT_ID', 'product', 'sku']),
        location_id: getField(['location_id', 'LOCATION_ID', 'location']),
        quantity_sold: quantitySold,
        revenue: revenue,
        vendor_id: getField(['vendor_id', 'VENDOR_ID', 'vendor']),
        unit_price: unitPrice
      };
    });

    if (salesData.length === 0) {
      console.error('No valid data could be extracted from the file');
      return { success: false, error: 'No valid data could be extracted from the file' };
    }

    // Insert data into the historical_sales_data table
    const { data, error } = await supabase
      .from('historical_sales_data')
      .insert(salesData);

    if (error) {
      console.error('Error inserting historical sales data:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Historical sales data inserted successfully:', salesData.length, 'records');
    return { success: true, recordCount: salesData.length };
  } catch (error) {
    console.error('Error processing historical sales file:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error processing file' };
  }
};
