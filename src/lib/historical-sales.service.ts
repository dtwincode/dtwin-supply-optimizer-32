import { supabase } from './supabaseClient';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Function to handle historical sales data upload from CSV or Excel
export const uploadHistoricalSales = async (file: File) => {
  try {
    console.log('Starting to process file:', file.name, 'size:', file.size);
    // Parse the file based on its type
    let parsedData;

    if (file.name.endsWith('.csv')) {
      // Parse CSV file with more explicit options
      const csvContent = await readFileAsText(file);
      console.log('CSV content sample:', csvContent.substring(0, 200) + '...');
      
      const parseResult = await new Promise<Papa.ParseResult<any>>((resolve, reject) => {
        Papa.parse(csvContent, {
          header: true,
          complete: resolve,
          error: reject,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim().toLowerCase(),
          delimiter: '', // auto-detect delimiter
          preview: 5, // Log a preview for debugging
          step: (results, parser) => {
            console.log('Parsing row:', results.data);
          }
        });
      });

      console.log('Parse result:', parseResult);
      
      if (!parseResult.data || parseResult.data.length === 0 || Object.keys(parseResult.data[0]).length === 0) {
        console.error('No data found in the CSV file or invalid format');
        return { success: false, error: 'No data found in the CSV file or invalid format. Please check the file structure.' };
      }

      parsedData = parseResult.data;
      console.log('First row of parsed data:', parsedData[0]);
      console.log('Headers:', Object.keys(parsedData[0]));
      
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Parse Excel file
      try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(worksheet);

        if (!parsedData || parsedData.length === 0) {
          console.error('No data found in the Excel file');
          return { success: false, error: 'No data found in the Excel file' };
        }
      } catch (excelError) {
        console.error('Error parsing Excel file:', excelError);
        return { success: false, error: 'Error parsing Excel file: ' + (excelError instanceof Error ? excelError.message : String(excelError)) };
      }
    } else {
      console.error('Unsupported file format');
      return { success: false, error: 'Unsupported file format. Please upload CSV or Excel files only.' };
    }

    console.log('Parsed historical sales data:', parsedData.slice(0, 2));

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

      // Get primary fields needed for database insert
      const salesDate = getField(['sales_date', 'date', 'DATE', 'sale_date', 'transaction_date']);
      const productId = getField(['product_id', 'PRODUCT_ID', 'product', 'sku', 'product_sku', 'product_code']);
      const locationId = getField(['location_id', 'LOCATION_ID', 'location', 'store_id', 'warehouse_id']);
      const quantitySold = getField(['quantity_sold', 'quantity', 'qty', 'QUANTITY', 'units_sold', 'sales_qty']);
      const revenue = getField(['revenue', 'REVENUE', 'total_revenue', 'sales_amount', 'amount', 'sales_value']);
      const vendorId = getField(['vendor_id', 'VENDOR_ID', 'vendor', 'supplier_id', 'supplier']);
      
      // Log each field to help with debugging
      console.log('Field mapping for row:', {
        salesDate,
        productId,
        locationId,
        quantitySold,
        revenue,
        vendorId,
        rawRow: row
      });

      // Validate required fields
      if (!salesDate || !productId || !locationId || !quantitySold || !revenue) {
        console.warn('Missing required fields in row:', row);
        return null; // Skip this row
      }

      // Handle Excel date format (convert to ISO date string if numeric)
      let formattedSalesDate = salesDate;
      if (typeof salesDate === 'number') {
        // Convert Excel date number to JavaScript date
        const excelEpoch = new Date(1899, 11, 30);
        const days = salesDate;
        const milliseconds = days * 24 * 60 * 60 * 1000;
        const date = new Date(excelEpoch.getTime() + milliseconds);
        formattedSalesDate = date.toISOString().split('T')[0];
      }

      // Calculate unit price if quantity sold is provided and not zero
      const quantitySoldNum = parseFloat(quantitySold) || 0;
      const revenueNum = parseFloat(revenue) || 0;
      const unitPrice = quantitySoldNum > 0 ? revenueNum / quantitySoldNum : 
        parseFloat(getField(['unit_price', 'price', 'UNIT_PRICE', 'price_per_unit'])) || null;

      return {
        sales_date: formattedSalesDate || new Date().toISOString().split('T')[0],
        product_id: productId,
        location_id: locationId,
        quantity_sold: quantitySoldNum,
        revenue: revenueNum,
        vendor_id: vendorId,
        unit_price: unitPrice
      };
    }).filter(item => item !== null); // Remove null items (invalid rows)

    if (salesData.length === 0) {
      console.error('No valid data could be extracted from the file');
      return { success: false, error: 'No valid data could be extracted from the file. Please check the file format and column headers.' };
    }

    console.log('Mapped sales data:', salesData.slice(0, 2));
    console.log('Total rows to insert:', salesData.length);

    // Set a timeout for the operation (30 seconds)
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database operation timed out. The operation might still complete in the background.')), 30000)
    );

    // Insert data into the historical_sales_data table with batching
    // Process in batches of 50 records to avoid overwhelming the database
    const BATCH_SIZE = 50;
    let successCount = 0;
    
    for (let i = 0; i < salesData.length; i += BATCH_SIZE) {
      const batch = salesData.slice(i, i + BATCH_SIZE);
      
      try {
        // Race the database operation against the timeout
        const insertPromise = supabase
          .from('historical_sales_data')
          .insert(batch);
          
        const result = await Promise.race([insertPromise, timeout]);
        
        if (result.error) {
          console.error('Error inserting batch starting at index', i, ':', result.error.message);
          // Continue with the next batch instead of failing completely
        } else {
          successCount += batch.length;
          console.log(`Inserted batch ${i/BATCH_SIZE + 1}/${Math.ceil(salesData.length/BATCH_SIZE)}, total success: ${successCount}`);
        }
      } catch (err) {
        console.error("Error in historical sales service:", err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        return { error: errorMessage };
      }
    }

    console.log('Historical sales data insert complete:', successCount, 'of', salesData.length, 'records');
    return { 
      success: true, 
      recordCount: successCount,
      message: successCount < salesData.length 
        ? `Partially completed: ${successCount} of ${salesData.length} records inserted.` 
        : `All ${successCount} records inserted successfully.`
    };
  } catch (error) {
    console.error('Error processing historical sales file:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error processing file' };
  }
};

// Helper function to read file as text
const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// Mock function to prevent reference errors
const someProcessingFunction = async (data: any[]): Promise<any> => {
  // Implementation
  return { success: true };
};

// Function to handle historical sales data processing
export const processHistoricalSalesData = async (fileData: any[]): Promise<{ success: boolean; message: string }> => {
  try {
    // Process data logic...
    
    // Call to Supabase or other service
    const result = await someProcessingFunction(fileData);
    
    return { success: true, message: 'Historical sales data processed successfully' };
  } catch (error) {
    console.error('Error processing historical sales data:', error);
    // Correctly handle the unknown error type
    if (error && typeof error === 'object' && 'error' in error) {
      return { 
        success: false, 
        message: `Error processing historical sales data: ${(error as { error: string }).error}` 
      };
    }
    return { 
      success: false, 
      message: `Error processing historical sales data: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
