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

    // Validate required fields - product_id and quantity_on_hand are required
    const invalidRows = parseResult.data.filter(
      row => !row.product_id || row.product_id.trim() === '' || isNaN(row.quantity_on_hand)
    );

    if (invalidRows.length > 0) {
      console.error('Invalid rows found:', invalidRows);
      return { 
        success: false, 
        message: `${invalidRows.length} row(s) missing required fields (product_id, quantity_on_hand)`,
        details: 'Each row must have valid values for the required fields: product_id and quantity_on_hand'
      };
    }

    // Map CSV data to the inventory_data table structure
    // IMPORTANT: Let the database provide the default value for available_qty if not specified
    const inventoryData = parseResult.data.map(row => {
      const baseData = {
        product_id: row.product_id,
        quantity_on_hand: parseInt(row.quantity_on_hand) || 0,
        reserved_qty: parseInt(row.reserved_qty) || 0,
        location_id: row.location_id || null,
        buffer_profile_id: row.buffer_profile_id || null
      };
      
      // Only include available_qty if it's explicitly provided in the CSV
      // Otherwise let the database use its default value
      if (row.available_qty !== undefined && row.available_qty !== null && row.available_qty !== '') {
        return {
          ...baseData,
          available_qty: parseInt(row.available_qty) || 0
        };
      }
      
      return baseData;
    });

    // Insert data into the inventory_data table
    const { data, error } = await supabase
      .from('inventory_data')
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
      .from('inventory_data')
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
      .from('inventory_data')
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
      .from('inventory_data')
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
