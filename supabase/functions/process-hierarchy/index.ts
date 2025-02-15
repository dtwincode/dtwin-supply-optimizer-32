
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

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('hierarchy-uploads')
      .download(fileName)

    if (downloadError) throw downloadError

    // Get the file extension
    const fileExt = fileName.split('.').pop()?.toLowerCase()
    let headers: string[] = []

    if (fileExt === 'xlsx' || fileExt === 'xls') {
      // Handle Excel files
      const arrayBuffer = await fileData.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // Convert Excel data to array of arrays
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      headers = data[0].map((header: any) => String(header).trim())
    } else {
      // Handle CSV files
      const text = await fileData.text()
      const cleanText = text.replace(/^\uFEFF/, '') // Remove BOM if present
      const lines = cleanText.split('\n')
      
      // Parse headers (first line)
      const headerLine = lines[0]
      headers = headerLine
        .split(',')
        .map(header => 
          header
            .trim()
            .replace(/["'\r\n]/g, '')
            .replace(/^\uFEFF/, '')
        )
        .filter(header => header.length > 0)
    }

    console.log('Parsed headers:', headers)

    // Return the headers
    return new Response(
      JSON.stringify({ 
        success: true,
        headers: headers
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
