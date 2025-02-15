
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Parse the CSV data
    const text = await fileData.text()
    
    // First, parse just the headers to get column names
    // Remove BOM if present and clean the headers
    const cleanText = text.replace(/^\uFEFF/, '');
    const rows = cleanText.split('\n');
    const headers = rows[0]
      .split(',')
      .map(header => 
        header
          .trim()
          .replace(/["'\r\n]/g, '') // Remove quotes, line endings
          .replace(/^\uFEFF/, '') // Remove BOM if present
      )
      .filter(header => header.length > 0); // Remove empty headers

    console.log('Parsed headers:', headers);

    // Return the headers first, before processing the data
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
