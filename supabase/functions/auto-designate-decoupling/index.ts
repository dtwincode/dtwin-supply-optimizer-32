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

    // Process each pair using 8-factor model
    for (const pair of availablePairs) {
      try {
        // Call the 8-factor scoring function (0-100 scale with storage + MOQ)
        const { data: scoreData, error: scoreError } = await supabase
          .rpc('calculate_8factor_weighted_score', {
            p_product_id: pair.product_id,
            p_location_id: pair.location_id
          });

        if (scoreError) {
          console.error(`Error scoring ${pair.product_id} @ ${pair.location_id}:`, scoreError);
          continue;
        }

        const score = scoreData.total_score; // 0-100 scale
        const recommendation = scoreData.recommendation; // PULL_STORE_LEVEL, HYBRID_DC_LEVEL, PUSH_UPSTREAM
        scoring_details.push(scoreData);

        // Convert threshold from 0-1 scale to 0-100 scale (e.g., 0.75 → 75)
        const threshold100 = threshold * 100;

        // Auto-designate if score meets threshold
        if (score >= threshold100) {
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
            console.log(`✅ Designated ${pair.product_id} @ ${pair.location_id} (score: ${score.toFixed(1)}, recommendation: ${recommendation})`);
          } else if (insertError.code !== '23505') { // Ignore duplicate key errors
            console.error(`Error inserting ${pair.product_id} @ ${pair.location_id}:`, insertError);
          }
        } else if (score >= 50) { // 50-75: Review required (0.50-0.75 on 0-1 scale)
          review_required++;
        } else { // < 50: Auto-reject
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
