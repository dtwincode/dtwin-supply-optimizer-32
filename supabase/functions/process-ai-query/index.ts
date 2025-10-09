// GEMINI-ONLY EDGE FUNCTION - COMPLETELY REBUILT
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

serve(async (req) => {
  console.log('🚀 GEMINI FUNCTION STARTED - REBUILT VERSION 3.0');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { prompt, context, format = 'text', timestamp } = body;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Missing prompt' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('📊 Fetching live database statistics...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let databaseContext = '\n\n## LIVE DATABASE SNAPSHOT:\n';
    
    try {
      const { count: productCount } = await supabase
        .from('product_master')
        .select('*', { count: 'exact', head: true });
      
      const { count: locationCount } = await supabase
        .from('location_master')
        .select('*', { count: 'exact', head: true });
      
      const { count: breachCount } = await supabase
        .from('buffer_breach_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('acknowledged', false);
      
      const { count: decouplingCount } = await supabase
        .from('decoupling_points')
        .select('*', { count: 'exact', head: true });
      
      databaseContext += `Total products: ${productCount || 0}\n`;
      databaseContext += `Total locations: ${locationCount || 0}\n`;
      databaseContext += `Active buffer breaches: ${breachCount || 0}\n`;
      databaseContext += `Decoupling points: ${decouplingCount || 0}\n`;
      
      console.log('✅ Database stats fetched:', { productCount, locationCount, breachCount, decouplingCount });
    } catch (err) {
      console.error('❌ Database fetch error:', err);
      databaseContext += 'Database connection error\n';
    }

    const systemPrompt = `You are a supply chain data analyst for dtwin with live database access.

${databaseContext}

${context || ''}

CRITICAL INSTRUCTIONS:
1. You HAVE database access - the snapshot above shows REAL data
2. When asked "how many products/locations", cite EXACT numbers from the snapshot
3. Example: "Your database has [X] products across [Y] locations, with [Z] active breaches"
4. NEVER say "I don't have access" - you DO have access via the snapshot above
5. If snapshot is empty, explain there was a connection issue

Output format: ${format === 'chart' ? 'Chart description with metrics' : 
                format === 'report' ? 'Structured report with data' : 
                'Clear response with specific numbers'}

Current time: ${timestamp || new Date().toISOString()}`;

    console.log('🤖 Calling Gemini 2.5 Flash...');
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
      }),
    });

    console.log('📡 Gemini response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini error:', errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded' }),
          { status: 429, headers: corsHeaders }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required - add credits' }),
          { status: 402, headers: corsHeaders }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Gemini API error: ' + response.status }),
        { status: 502, headers: corsHeaders }
      );
    }

    const data = await response.json();
    console.log('✅ Gemini response received');
    
    if (!data.choices || data.choices.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid Gemini response' }),
        { status: 502, headers: corsHeaders }
      );
    }

    const generatedText = data.choices[0].message.content;
    console.log('📤 Returning response, length:', generatedText?.length);
    
    return new Response(
      JSON.stringify({ generatedText }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
