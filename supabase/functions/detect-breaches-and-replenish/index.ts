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

    console.log('🔄 Starting breach detection and replenishment...');

    // STEP 1: Run detect_buffer_breaches() function
    console.log('Running detect_buffer_breaches()...');
    const { data: breachData, error: breachError } = await supabase
      .rpc('detect_buffer_breaches');

    if (breachError) {
      console.error('Error detecting breaches:', breachError);
      throw breachError;
    }

    const breachCount = breachData || 0;
    console.log(`✅ Detected ${breachCount} buffer breaches`);

    // STEP 2: Run generate_replenishment() function for all locations
    console.log('Running generate_replenishment()...');
    const { data: replenishData, error: replenishError } = await supabase
      .rpc('generate_replenishment', { location_id_filter: null });

    if (replenishError) {
      console.error('Error generating replenishment:', replenishError);
      throw replenishError;
    }

    const replenishCount = replenishData || 0;
    console.log(`✅ Generated ${replenishCount} replenishment orders`);

    // STEP 3: Get summary of critical breaches (HIGH severity)
    const { data: criticalBreaches, error: criticalError } = await supabase
      .from('buffer_breach_events')
      .select('product_id, location_id, breach_type, current_oh, threshold')
      .eq('severity', 'HIGH')
      .eq('acknowledged', false)
      .order('detected_ts', { ascending: false })
      .limit(10);

    if (criticalError) {
      console.error('Error fetching critical breaches:', criticalError);
    }

    // STEP 4: Get summary of new replenishment orders
    const { data: newOrders, error: ordersError } = await supabase
      .from('replenishment_orders')
      .select('product_id, location_id, qty_recommend, target_due_date, status')
      .eq('status', 'DRAFT')
      .order('proposal_ts', { ascending: false })
      .limit(10);

    if (ordersError) {
      console.error('Error fetching replenishment orders:', ordersError);
    }

    const summary = {
      success: true,
      timestamp: new Date().toISOString(),
      breaches_detected: breachCount,
      replenishment_orders_created: replenishCount,
      critical_breaches: criticalBreaches || [],
      recent_orders: newOrders || [],
      message: 'Breach detection and replenishment completed successfully',
    };

    console.log('✅ Breach detection and replenishment completed:', {
      breaches: breachCount,
      orders: replenishCount,
      critical: (criticalBreaches || []).length,
    });

    return new Response(JSON.stringify(summary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error in detect-breaches-and-replenish:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
