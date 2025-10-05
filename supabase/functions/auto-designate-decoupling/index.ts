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

    const { threshold = 0.75, scenario_name = 'default', batch_size = 50 } = await req.json();

    console.log(`🎯 Starting auto-designation with threshold ${threshold}, scenario ${scenario_name}, batch size ${batch_size}`);

    // Get all product-location pairs that aren't already decoupling points
    const { data: pairs, error: pairsError } = await supabase
      .from('product_location_pairs')
      .select('product_id, location_id')
      .limit(batch_size);

    if (pairsError) throw pairsError;

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

    console.log(`Found ${availablePairs.length} pairs to analyze (${pairs.length - availablePairs.length} already designated)`);

    let auto_designated = 0;
    let review_required = 0;
    let auto_rejected = 0;
    const scoring_details: any[] = [];

    // Process each pair
    for (const pair of availablePairs) {
      try {
        // Call the scoring function
        const { data: scoreData, error: scoreError } = await supabase
          .rpc('calculate_decoupling_score_v2', {
            p_product_id: pair.product_id,
            p_location_id: pair.location_id,
            p_scenario_name: scenario_name
          });

        if (scoreError) {
          console.error(`Error scoring ${pair.product_id} @ ${pair.location_id}:`, scoreError);
          continue;
        }

        const score = scoreData.total_score;
        scoring_details.push(scoreData);

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
              designation_reason: `Auto-designated: Score ${score.toFixed(2)} (Variability: ${scoreData.variability}, Criticality: ${scoreData.criticality})`
            });

          if (!insertError) {
            auto_designated++;
            console.log(`✅ Designated ${pair.product_id} @ ${pair.location_id} (score: ${score.toFixed(2)})`);
          } else if (insertError.code !== '23505') { // Ignore duplicate key errors
            console.error(`Error inserting ${pair.product_id} @ ${pair.location_id}:`, insertError);
          }
        } else if (score >= 0.50) {
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
        total_analyzed: availablePairs.length,
        auto_designated,
        review_required,
        auto_rejected,
        threshold_used: threshold,
        scenario: scenario_name
      },
      scoring_details
    };

    console.log(`✅ Auto-designation complete:`, result.summary);

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
