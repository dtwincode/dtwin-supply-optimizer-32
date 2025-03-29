
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
      return { success: false, message: 'No data found in the CSV file' };
    }

    console.log('Parsed inventory data:', parseResult.data);

    // Validate required fields - product_id and current_stock are required
    const invalidRows = parseResult.data.filter(
      row => !row.product_id || row.product_id.trim() === '' || isNaN(row.current_stock)
    );

    if (invalidRows.length > 0) {
      console.error('Invalid rows found:', invalidRows);
      return { 
        success: false, 
        message: `${invalidRows.length} row(s) missing required fields (product_id, current_stock)`,
        details: 'Each row must have valid values for the required fields: product_id and current_stock'
      };
    }

    // Map CSV data to the inventory table structure
    const inventoryData = parseResult.data.map(row => ({
      product_id: row.product_id,
      inventory_id: row.inventory_id || null,
      current_stock: parseInt(row.current_stock) || 0,
      min_stock: parseInt(row.min_stock) || 0,
      max_stock: parseInt(row.max_stock) || 0,
      safety_stock: parseInt(row.safety_stock) || 0,
      lead_time_days: parseInt(row.lead_time_days) || null,
      location_id: row.location_id || null,
      buffer_penetration: parseFloat(row.buffer_penetration) || null
    }));

    // Insert data into the inventory table
    const { data, error } = await supabase
      .from('inventory')
      .insert(inventoryData);

    if (error) {
      console.error('Error inserting inventory data:', error.message);
      return { success: false, message: `Error inserting data: ${error.message}` };
    }

    console.log('Inventory data inserted successfully');
    return { success: true, message: 'Inventory data uploaded successfully', count: inventoryData.length };
  } catch (error) {
    console.error('Error processing inventory file:', error);
    return { 
      success: false, 
      message: `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

// Function to retrieve inventory data from the Supabase table
export const getInventoryData = async () => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .select('*');
    
    if (error) {
      console.error('Error fetching inventory data:', error.message);
      return { success: false, message: error.message, data: [] };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in getInventoryData:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error',
      data: [] 
    };
  }
};

// Function to update inventory item in the Supabase table
export const updateInventoryItem = async (id: string, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('inventory_id', id)
      .select();
    
    if (error) {
      console.error('Error updating inventory item:', error.message);
      return { success: false, message: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in updateInventoryItem:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Function to delete inventory item from the Supabase table
export const deleteInventoryItem = async (id: string) => {
  try {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('inventory_id', id);
    
    if (error) {
      console.error('Error deleting inventory item:', error.message);
      return { success: false, message: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error in deleteInventoryItem:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
