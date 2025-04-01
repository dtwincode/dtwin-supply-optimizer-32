
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase credentials
const SUPABASE_URL = 'https://mttzjxktvbsixjaqiuxq.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE2OTg0MSwiZXhwIjoyMDU0NzQ1ODQxfQ.xkL_emVJCkz3tWu75ad4x56aoOPJKHLLkr7SImBZuUc'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    })
  }
  
  try {
    // Check if method is POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        }
      )
    }

    const { demand_variability_threshold, decoupling_threshold } = await req.json()

    // Validate request data
    if (demand_variability_threshold === undefined || decoupling_threshold === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing threshold values' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        }
      )
    }

    // Check range values
    if (demand_variability_threshold < 0.1 || demand_variability_threshold > 1 ||
        decoupling_threshold < 0.3 || decoupling_threshold > 1) {
      return new Response(
        JSON.stringify({ error: 'Threshold values out of range: demand_variability_threshold must be between 0.1 and 1, decoupling_threshold must be between 0.3 and 1' }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        }
      )
    }

    console.log('Updating thresholds:', { demand_variability_threshold, decoupling_threshold })

    const { data, error } = await supabase
      .from('threshold_config')
      .update({
        demand_variability_threshold,
        decoupling_threshold,
        first_time_adjusted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: error.message }), 
        { 
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Thresholds updated successfully',
        data
      }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      }
    )
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'An unexpected error occurred' }), 
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      }
    )
  }
})
