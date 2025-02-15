
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { parse } from 'https://deno.land/std@0.168.0/csv/parse.ts'

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

    const { fileName } = await req.json()

    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabaseClient
      .storage
      .from('hierarchy-uploads')
      .download(fileName)

    if (downloadError) throw downloadError

    // Parse the CSV data
    const text = await fileData.text()
    const rows = parse(text, {
      skipFirstRow: true,
      columns: true,
    })

    // Insert the data into the location_hierarchy table
    const { error: insertError } = await supabaseClient
      .from('location_hierarchy')
      .insert(rows)

    if (insertError) throw insertError

    // Clean up the uploaded file
    await supabaseClient.storage
      .from('hierarchy-uploads')
      .remove([fileName])

    return new Response(
      JSON.stringify({ success: true }),
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
