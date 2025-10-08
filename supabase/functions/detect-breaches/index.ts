import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚨 Starting buffer breach detection...');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Call the detection function
    const { data, error } = await supabaseClient.rpc('detect_buffer_breaches_v2');

    if (error) {
      console.error('❌ Error detecting breaches:', error);
      throw error;
    }

    const result = data[0];
    console.log(`✅ Breach detection complete:`);
    console.log(`   - Total breaches: ${result.breaches_detected}`);
    console.log(`   - Critical (< TOR): ${result.critical_count}`);
    console.log(`   - High (< TOY): ${result.high_count}`);

    return new Response(
      JSON.stringify({
        success: true,
        breaches_detected: result.breaches_detected,
        critical_count: result.critical_count,
        high_count: result.high_count,
        message: `Detected ${result.breaches_detected} buffer breaches (${result.critical_count} critical, ${result.high_count} high)`,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error('❌ Error in detect-breaches function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});