
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
      data = XLSX.utils.sheet_to_json(worksheet)
      if (data.length > 0) {
        headers = Object.keys(data[0])
      }
      console.log('Excel headers found:', headers)
    } else {
      // Handle CSV files
      const text = await fileData.text()
      console.log('Raw CSV content:', text.substring(0, 200)) // Log the first 200 chars for debugging
      
      // Clean the text and split into lines, removing empty lines
      const lines = text
        .replace(/^\uFEFF/, '') // Remove BOM if present
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
      
      if (lines.length > 0) {
        // Parse headers (first line) - handle both quoted and unquoted headers
        headers = lines[0]
          .split(',')
          .map(header => {
            // Remove quotes and clean whitespace
            return header
              .trim()
              .replace(/^["']|["']$/g, '') // Remove starting/ending quotes
              .replace(/\r$/, '') // Remove any trailing carriage return
          })
          .filter(header => header.length > 0)
        
        console.log('Parsed CSV headers:', headers)
        
        // Parse data rows
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(value => value.trim().replace(/^["']|["']$/g, ''))
          return headers.reduce((obj, header, index) => {
            obj[header] = values[index] || ''
            return obj
          }, {} as Record<string, string>)
        })
        
        console.log('First data row:', data[0])
      }
    }

    // Get sample data from the first row
    const sampleData = data[0] || {}

    // Combine headers with sample data
    const combinedHeaders = headers.map(header => ({
      column: header,
      sampleData: sampleData[header] || ''
    }))

    console.log('Final headers and sample data:', {
      headers,
      combinedHeaders,
      firstDataRow: data[0]
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
