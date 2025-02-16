
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { fileName, type } = await req.json()
    console.log('Processing file:', fileName, 'type:', type);

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('hierarchy-uploads')
      .download(fileName)

    if (downloadError) {
      console.error('Download error:', downloadError);
      throw downloadError;
    }

    console.log('File downloaded successfully');

    // Get the file extension
    const fileExt = fileName.split('.').pop()?.toLowerCase()
    let headers: string[] = []
    let data: any[] = []

    // Convert the file data to array buffer
    const arrayBuffer = await fileData.arrayBuffer()
    
    if (fileExt === 'xlsx' || fileExt === 'xls') {
      // Handle Excel files
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Convert to JSON with headers, no row limit
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      console.log('Excel rawData:', rawData);
      
      if (rawData.length > 0) {
        headers = rawData[0].map(String)
        // Process all rows after header
        data = rawData.slice(1)
          .filter(row => Array.isArray(row) && row.length > 0) // Ensure row is an array and not empty
          .map(row => {
            return headers.reduce((obj, header, index) => {
              obj[header] = row[index] ?? '' // Use nullish coalescing to handle undefined values
              return obj
            }, {} as Record<string, any>)
          })
      }
    } else {
      // Handle CSV files
      const text = new TextDecoder().decode(arrayBuffer)
      console.log('CSV raw text:', text.substring(0, 200)); // Log first 200 chars for debugging
      
      // Split by newline and filter out empty lines
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      console.log('Number of lines found:', lines.length);

      if (lines.length > 0) {
        // First line contains headers
        const headerLine = lines[0]
        headers = headerLine
          .split(',')
          .map(header => header.trim().replace(/[\r\n"']/g, ''))
          .filter(header => header.length > 0)

        console.log('Headers found:', headers);

        // Process all remaining lines as data
        data = lines.slice(1)
          .filter(line => line.trim().length > 0)
          .map(line => {
            // Split by comma but handle quoted values correctly
            const values = line.split(',').map(val => val.trim().replace(/^"|"$/g, ''))
            return headers.reduce((obj, header, index) => {
              obj[header] = values[index] || '' // Use empty string for missing values
              return obj
            }, {} as Record<string, any>)
          })
      }
    }

    console.log('Parsed headers:', headers);
    console.log('Number of data rows:', data.length);

    if (headers.length === 0) {
      throw new Error('No valid headers found in the file')
    }

    // Verify data was processed
    if (data.length === 0) {
      throw new Error('No valid data rows found in the file')
    }

    // Get module settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('module_settings')
      .select('*')
      .eq('module', `${type}_hierarchy`)
      .single()

    if (settingsError) {
      console.error('Settings error:', settingsError);
      throw settingsError;
    }

    // Validate the data structure
    const validationRules = settings.validation_rules
    const requiredColumns = validationRules.required_columns

    // Check required columns
    const missingColumns = requiredColumns.filter(col => !headers.includes(col))
    if (missingColumns.length > 0) {
      throw new Error(`Missing required columns: ${missingColumns.join(', ')}`)
    }

    // Update the upload record with success status
    const { error: updateError } = await supabaseClient
      .from('temp_hierarchy_uploads')
      .update({
        status: 'processed',
        updated_at: new Date().toISOString()
      })
      .eq('storage_path', fileName)

    if (updateError) {
      console.error('Update error:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        headers: headers,
        totalRows: data.length,
        message: 'File processed successfully'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Access-Control-Max-Age': '86400' // 24 hours
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error processing file:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
