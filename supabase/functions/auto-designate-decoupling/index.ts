import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    let { threshold = 70, scenario_name = 'default', batch_size = 100 } = await req.json();
    
    // Normalize threshold: if 0-1 scale, convert to 0-100 scale
    if (threshold > 0 && threshold <= 1) {
      threshold = threshold * 100;
    }
    
    console.log(`🎯 Starting auto-designation with threshold ${threshold}%`);

    // Check if component scoring is available (9-factor with bullwhip)
    const { error: checkError } = await supabase.rpc('calculate_component_9factor_score', { 
      p_component_id: 'TEST', 
      p_location_id: 'TEST' 
    });
    
    const useComponentScoring = checkError?.code !== 'PGRST202';
    console.log(useComponentScoring ? `✅ 9-factor component scoring active` : `⚠️ Using 9-factor standard scoring`);

    // Get valid locations from location_master first
    const { data: validLocs } = await supabase.from('location_master').select('location_id, region');
    const validLocationIds = new Set((validLocs || []).map(l => l.location_id));
    
    // Get pairs
    let pairs: any[] = [];
    if (useComponentScoring) {
      const { data: comps } = await supabase.from('product_master').select('product_id, sku, name, product_type').in('product_type', ['RAW_MATERIAL', 'COMPONENT']).limit(batch_size);
      pairs = comps?.flatMap(c => 
        Array.from(validLocationIds).map(location_id => ({ 
          product_id: c.product_id, 
          location_id, 
          sku: c.sku, 
          name: c.name, 
          product_type: c.product_type 
        }))
      ) || [];
    } else {
      const { data: allPairs } = await supabase.from('product_location_pairs').select('product_id, location_id').limit(batch_size);
      // Filter to only valid locations
      pairs = (allPairs || []).filter(p => validLocationIds.has(p.location_id));
    }
    
    console.log(`Found ${validLocationIds.size} valid locations`);

    if (!pairs.length) {
      return new Response(JSON.stringify({ success: true, summary: { total_analyzed: 0, auto_designated: 0, review_required: 0, auto_rejected: 0, threshold_used: threshold }, scoring_details: [] }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Filter existing decoupling points
    const { data: existingDPs } = await supabase.from('decoupling_points').select('product_id, location_id');
    const existingSet = new Set((existingDPs || []).map(dp => `${dp.product_id}:${dp.location_id}`));
    const availablePairs = pairs.filter(p => !existingSet.has(`${p.product_id}:${p.location_id}`));
    
    console.log(`Evaluating ${availablePairs.length} pairs`);

    let auto_designated = 0, review_required = 0, auto_rejected = 0;
    const scoring_details: any[] = [];

    for (const pair of availablePairs) {
      try {
        const fnName = useComponentScoring ? 'calculate_component_9factor_score' : 'calculate_9factor_weighted_score';
        const params = useComponentScoring ? { p_component_id: pair.product_id, p_location_id: pair.location_id } : { p_product_id: pair.product_id, p_location_id: pair.location_id };
        
        const { data: scoreData, error: scoreError } = await supabase.rpc(fnName, params);
        if (scoreError) {
          console.error(`Score error for ${pair.product_id}:`, scoreError);
          continue;
        }

        const score = scoreData?.total_score || 0;
        scoring_details.push({ ...scoreData, sku: pair.sku, product_type: pair.product_type });

        if (score >= threshold) {
          const { data: prodData } = await supabase.from('product_master').select('buffer_profile_id').eq('product_id', pair.product_id).maybeSingle();
          const { error: insertError } = await supabase.from('decoupling_points').insert({
            product_id: pair.product_id,
            location_id: pair.location_id,
            buffer_profile_id: prodData?.buffer_profile_id || 'BP_DEFAULT',
            is_strategic: true,
            designation_reason: `Auto: 9-Factor Score ${score.toFixed(2)} ${useComponentScoring ? `(Component: ${pair.sku})` : ''} - Includes Bullwhip Effect`
          });

          if (!insertError) {
            auto_designated++;
            console.log(`✅ Designated ${pair.sku || pair.product_id} @ ${pair.location_id} (${score})`);
          } else if (insertError.code !== '23505') {
            console.error(`Insert error:`, insertError);
          }
        } else if (score >= 50) {
          review_required++;
        } else {
          auto_rejected++;
        }
      } catch (err) {
        console.error(`Process error:`, err);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      summary: {
        total_analyzed: availablePairs.length,
        auto_designated,
        review_required,
        auto_rejected,
        threshold_used: threshold,
        scoring_mode: useComponentScoring ? 'COMPONENT' : 'STANDARD'
      },
      scoring_details: scoring_details.slice(0, 50)
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Auto-designate error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
