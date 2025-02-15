
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const expectedHeaders = [
  "Store",
  "Sub Channel",
  "Store Desc",
  "Channel",
  "Store Desc",
  "City",
  "City Desc",
  "District",
  "District Desc",
  "Region",
  "Region Desc",
  "Country",
  "Country Desc",
  "Channel",
  "Sub Channel",
  "Warehouse"
];

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
    let firstRow: string[] = []

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      // Handle Excel files
      const arrayBuffer = await fileData.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Get the first row data
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      if (data.length > 0) {
        // Extract column letters (A, B, C, etc.)
        headers = Object.keys(worksheet)
          .filter(key => key.match(/^[A-Z]+1$/)) // Only get cells from first row
          .map(key => worksheet[key].v) // Get cell values
          .filter(Boolean) // Remove any undefined/null values
        console.log('Excel headers found:', headers);
      }
    } else {
      // Handle CSV files
      const text = await fileData.text()
      const cleanText = text.replace(/^\uFEFF/, '') // Remove BOM if present
      const lines = cleanText.split('\n')
      
      if (lines.length > 0) {
        // Get the Excel-style column headers (A, B, C, etc.)
        const columnCount = lines[0].split(',').length
        headers = Array.from({ length: columnCount }, (_, i) => {
          // Convert number to Excel column letter (0 = A, 1 = B, etc.)
          let columnName = ''
          let num = i
          while (num >= 0) {
            columnName = String.fromCharCode(65 + (num % 26)) + columnName
            num = Math.floor(num / 26) - 1
          }
          return columnName
        })

        // Get the first row of actual data for preview
        firstRow = lines[1]?.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')) || []
        console.log('CSV first row found:', firstRow);
      }
    }

    // If we have headers and first row data, combine them for preview
    const combinedHeaders = headers.map((header, index) => ({
      column: header,
      sampleData: firstRow[index] || ''
    }));

    console.log('Final processed headers:', combinedHeaders);

    // Return both the column letters and sample data
    return new Response(
      JSON.stringify({ 
        success: true,
        headers: headers,
        combinedHeaders: combinedHeaders
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
