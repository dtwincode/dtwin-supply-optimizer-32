
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

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      // Handle Excel files
      const arrayBuffer = await fileData.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Convert to JSON with headers
      const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      if (rawData.length > 0) {
        headers = rawData[0]
        data = rawData.slice(1).map(row => {
          return headers.reduce((obj, header, index) => {
            obj[header] = row[index]
            return obj
          }, {} as Record<string, any>)
        })
      }
    } else {
      // Handle CSV files
      const csvText = await fileData.text()
      
      // Split into lines and remove empty lines
      const lines = csvText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('--'))

      if (lines.length > 0) {
        // Process headers - first line
        const headerLine = lines[0]
        headers = headerLine
          .split(',')
          .map(header => {
            // Clean the header
            return header
              .trim()
              .replace(/^["']|["']$/g, '') // Remove quotes
              .replace(/\r$/, '')           // Remove carriage return
          })
          .filter(Boolean) // Remove empty headers
        
        console.log('Found headers:', headers)

        // Process data rows
        data = lines.slice(1).map(line => {
          const values = line
            .split(',')
            .map(val => val.trim().replace(/^["']|["']$/g, ''))
          
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || ''
            return obj
          }, {} as Record<string, any>)
        })

        console.log('First row of data:', data[0])
      }
    }

    // Validate we got some headers
    if (headers.length === 0) {
      throw new Error('No valid headers found in the file')
    }

    // Get sample data from the first row
    const sampleData = data[0] || {}

    // Combine headers with sample data
    const combinedHeaders = headers.map(header => ({
      column: header,
      sampleData: sampleData[header] || ''
    }))

    console.log('Processed data:', {
      headerCount: headers.length,
      rowCount: data.length,
      headers,
      sampleRow: sampleData
    })

    return new Response(
      JSON.stringify({ 
        success: true,
        headers: headers,
        combinedHeaders: combinedHeaders,
        data: data.slice(0, 5) // Send first 5 rows for preview
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
