import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { threshold = 70, scenario_name = 'default', batch_size = 100 } = await req.json();

    console.log(`🎯 Starting COMPONENT auto-designation with threshold ${threshold}`);

    // Step 1: Populate component demand analysis from BOM explosion
    const { data: populateResult, error: populateError } = await supabase
      .rpc('populate_component_demand_analysis');

    if (populateError) {
      console.error('Error populating component demand:', populateError);
      throw populateError;
    }

    console.log(`✅ Populated ${populateResult} component demand records via BOM explosion`);

    // Step 2: Get all RAW_MATERIAL and COMPONENT products
    const { data: components, error: compError } = await supabase
      .from('product_master')
      .select('product_id, sku, name, product_type')
      .in('product_type', ['RAW_MATERIAL', 'COMPONENT'])
      .limit(batch_size);

    if (compError) throw compError;

    // Get all locations
    const { data: locations, error: locError } = await supabase
      .from('location_master')
      .select('location_id, region');

    if (locError) throw locError;

    // Create component-location pairs
    const pairs = components?.flatMap(comp => 
      locations?.map(loc => ({
        product_id: comp.product_id,
        location_id: loc.location_id,
        product_type: comp.product_type,
        sku: comp.sku,
        name: comp.name
      })) || []
    ) || [];

    if (!pairs || pairs.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          summary: {
            total_analyzed: 0,
            auto_designated: 0,
            review_required: 0,
            auto_rejected: 0,
            threshold_used: threshold,
            scenario: scenario_name
          },
          scoring_details: []
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Filter out pairs that are already decoupling points
    const { data: existingDPs } = await supabase
      .from('decoupling_points')
      .select('product_id, location_id');

    const existingSet = new Set(
      (existingDPs || []).map((dp) => `${dp.product_id}:${dp.location_id}`)
    );

    const availablePairs = pairs.filter(
      (pair) => !existingSet.has(`${pair.product_id}:${pair.location_id}`)
    );

    console.log(`Found ${availablePairs.length} COMPONENT pairs to analyze (${pairs.length - availablePairs.length} already designated)`);

    let auto_designated = 0;
    let review_required = 0;
    let auto_rejected = 0;
    const scoring_details: any[] = [];

    // Step 3: Process each COMPONENT-location pair
    for (const pair of availablePairs) {
      try {
        // Call COMPONENT 8-factor scoring (uses BOM-exploded demand)
        const { data: scoreData, error: scoreError } = await supabase
          .rpc('calculate_component_8factor_score', {
            p_component_id: pair.product_id,
            p_location_id: pair.location_id
          });

        if (scoreError) {
          console.error(`Error scoring ${pair.sku} @ ${pair.location_id}:`, scoreError);
          continue;
        }

        const score = scoreData.total_score; // 0-100 scale
        const recommendation = scoreData.recommendation;
        scoring_details.push({
          ...scoreData,
          sku: pair.sku,
          name: pair.name,
          product_type: pair.product_type
        });

        // Auto-designate if score meets threshold
        if (score >= threshold) {
          // Get buffer profile from product_master
          const { data: productData } = await supabase
            .from('product_master')
            .select('buffer_profile_id')
            .eq('product_id', pair.product_id)
            .single();

          const buffer_profile_id = productData?.buffer_profile_id || 'BP_DEFAULT';

          const { error: insertError } = await supabase
            .from('decoupling_points')
            .insert({
              product_id: pair.product_id,
              location_id: pair.location_id,
              buffer_profile_id,
              is_strategic: true,
              designation_reason: `Auto-designated COMPONENT: Score ${score.toFixed(2)} (${pair.product_type}: ${pair.sku})`
            });

          if (!insertError) {
            auto_designated++;
            console.log(`✅ Designated COMPONENT ${pair.sku} (${pair.name}) @ ${pair.location_id} | Score: ${score.toFixed(1)} | Rec: ${recommendation}`);
          } else if (insertError.code !== '23505') {
            console.error(`Error inserting ${pair.sku} @ ${pair.location_id}:`, insertError);
          }
        } else if (score >= 50) {
          review_required++;
        } else {
          auto_rejected++;
        }
      } catch (err) {
        console.error(`Error processing ${pair.product_id} @ ${pair.location_id}:`, err);
      }
    }

    const result = {
      success: true,
      summary: {
        component_demand_records: populateResult,
        total_analyzed: availablePairs.length,
        auto_designated,
        review_required,
        auto_rejected,
        threshold_used: threshold,
        note: 'Component-level designation (RAW_MATERIALS & COMPONENTS only, not finished goods)'
      },
      scoring_details: scoring_details.slice(0, 50) // Limit to first 50
    };

    console.log(`✅ Component auto-designation complete:`, result.summary);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in auto-designate-decoupling:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
