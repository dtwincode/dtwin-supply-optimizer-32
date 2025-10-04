import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { batch_size = 50, product_id = null, location_id = null } = await req.json();

    console.log('🔄 Starting buffer recalculation batch...');
    console.log(`Batch size: ${batch_size}`);

    // Get decoupling points to process
    let query = supabase
      .from('decoupling_points')
      .select('product_id, location_id, buffer_profile_id')
      .limit(batch_size);

    if (product_id) query = query.eq('product_id', product_id);
    if (location_id) query = query.eq('location_id', location_id);

    const { data: decouplingPoints, error: dpError } = await query;

    if (dpError) throw dpError;

    console.log(`Found ${decouplingPoints.length} decoupling points to process`);

    let successCount = 0;
    let errorCount = 0;

    // Process each decoupling point
    for (const dp of decouplingPoints) {
      try {
        // Call the RPC function for individual product-location
        const { error: rpcError } = await supabase.rpc(
          'recalculate_buffers_with_adjustments',
          {
            p_product_id: dp.product_id,
            p_location_id: dp.location_id,
            p_triggered_by: 'BATCH_AUTO'
          }
        );

        if (rpcError) {
          console.error(`❌ Error processing ${dp.product_id} @ ${dp.location_id}:`, rpcError);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        console.error(`❌ Exception processing ${dp.product_id} @ ${dp.location_id}:`, error);
        errorCount++;
      }
    }

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      batch_size: batch_size,
      requested_count: decouplingPoints.length,
      success_count: successCount,
      error_count: errorCount,
      message: `Processed ${successCount}/${decouplingPoints.length} buffers successfully`,
    };

    console.log('✅ Batch recalculation completed:', summary);

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error in recalculate-buffers-batch:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
