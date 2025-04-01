import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Supabase credentials
const SUPABASE_URL = 'https://mttzjxktvbsixjaqiuxq.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dHpqeGt0dmJzaXhqYXFpdXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTE2OTg0MSwiZXhwIjoyMDU0NzQ1ODQxfQ.xkL_emVJCkz3tWu75ad4x56aoOPJKHLLkr7SImBZuUc'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

serve(async (req) => {
  try {
    const { demand_variability_threshold, decoupling_threshold } = await req.json()

    if (demand_variability_threshold === undefined || decoupling_threshold === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing threshold values' }),
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('threshold_config')
      .update({
        demand_variability_threshold,
        decoupling_threshold,
        first_time_adjusted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(
      JSON.stringify({ message: 'Thresholds updated successfully' }),
      { status: 200 }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
