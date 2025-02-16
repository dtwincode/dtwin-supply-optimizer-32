
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    if (downloadError) throw downloadError

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
      if (rawData.length > 0) {
        headers = rawData[0]
        // Process all rows after header
        data = rawData.slice(1)
          .filter(row => row.length > 0) // Filter out empty rows
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
      
      // Split by newline and filter out empty lines and MIME boundaries
      const lines = text.split(/\r?\n/)
      const csvLines = lines.filter(line => 
        line.includes(',') && 
        !line.includes('Content-Type:') && 
        !line.includes('Content-Disposition:') &&
        !line.startsWith('--') &&
        line.trim().length > 0 // Ensure line is not empty
      )

      if (csvLines.length > 0) {
        // First line contains headers
        const headerLine = csvLines[0]
        headers = headerLine
          .split(',')
          .map(header => header.trim().replace(/[\r\n"']/g, ''))
          .filter(header => header.length > 0)

        console.log(`Found ${headers.length} headers:`, headers)

        // Process all remaining lines as data
        data = csvLines.slice(1)
          .filter(line => line.trim().length > 0) // Extra check for empty lines
          .map(line => {
            // Split by comma but handle quoted values correctly
            const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []
            return headers.reduce((obj, header, index) => {
              // Clean up the value and remove quotes
              const value = values[index] 
                ? values[index].replace(/^"|"$/g, '').trim() 
                : ''
              obj[header] = value
              return obj
            }, {} as Record<string, any>)
          })
          .filter(row => Object.values(row).some(val => val !== '')) // Remove any empty rows

        console.log(`Total rows processed: ${data.length}`)
        console.log('First row:', data[0])
        console.log('Last row:', data[data.length - 1])
      }
    }

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

    if (settingsError) throw settingsError

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

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ 
        success: true,
        headers: headers,
        totalRows: data.length,
        message: 'File processed successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
