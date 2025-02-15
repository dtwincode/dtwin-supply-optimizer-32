
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
      const text = new TextDecoder().decode(arrayBuffer)
      console.log('Raw CSV content:', text.substring(0, 500)) // Log first 500 chars
      
      // Find the actual CSV content by looking for a line with commas
      const lines = text.split('\n')
      const csvLines = lines.filter(line => 
        line.includes(',') && 
        !line.includes('Content-Type:') && 
        !line.includes('Content-Disposition:') &&
        !line.startsWith('--')
      )

      if (csvLines.length > 0) {
        // First line with commas should be our headers
        const headerLine = csvLines[0]
        headers = headerLine
          .split(',')
          .map(header => header.trim().replace(/[\r\n"']/g, ''))
          .filter(header => header.length > 0)

        console.log('Extracted headers:', headers)

        // Process remaining lines as data
        data = csvLines.slice(1)
          .map(line => {
            const values = line
              .split(',')
              .map(val => val.trim().replace(/[\r\n"']/g, ''))

            return headers.reduce((obj, header, index) => {
              obj[header] = values[index] || ''
              return obj
            }, {} as Record<string, any>)
          })
          .filter(row => Object.values(row).some(val => val !== '')) // Remove empty rows

        console.log('First data row:', data[0])
      }
    }

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

    console.log('Final processed data:', {
      headerCount: headers.length,
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
