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

## AVAILABLE TABLES YOU CAN QUERY:
- location_master: Locations (columns: location_id, region, channel_id, location_type, restaurant_number)
- product_master: Products (columns: product_id, sku, name, category, subcategory)
- inventory_ddmrp_buffers_view: Buffer zones and inventory levels (columns: product_id, location_id, nfp, tor, toy, tog)
- buffer_breach_alerts: Active breaches (columns: product_id, location_id, breach_type, severity, detected_at)
- decoupling_points: Strategic inventory positions (columns: product_id, location_id, is_strategic, designation_reason)
- historical_sales_data: Sales history (columns: product_id, location_id, sales_date, quantity_sold, revenue)

CRITICAL INSTRUCTIONS:
1. You HAVE database access - use the query_database tool to fetch specific data
2. When asked to "list locations" → Call query_database(table='location_master', select='*', limit=10)
3. When asked to "show products" → Call query_database(table='product_master', select='*', limit=10)
4. Always cite EXACT data from queries - show specific IDs, names, values
5. Format results in a clear, readable way (tables, bullets, or formatted text)

Output format: ${format === 'chart' ? 'Chart description with metrics' : 
                format === 'report' ? 'Structured report with data' : 
                'Clear response with specific data'}

Current time: ${timestamp || new Date().toISOString()}`;

    console.log('🤖 Calling Gemini 2.5 Flash with database tools...');
    
    // Define database query tool for AI
    const tools = [
      {
        type: "function",
        function: {
          name: "query_database",
          description: "Query the Supabase database to get specific data like products, locations, inventory levels, etc.",
          parameters: {
            type: "object",
            properties: {
              table: {
                type: "string",
                description: "Table to query (e.g., 'location_master', 'product_master', 'inventory_ddmrp_buffers_view')"
              },
              select: {
                type: "string",
                description: "Columns to select (e.g., '*', 'location_id,region,channel_id')"
              },
              limit: {
                type: "number",
                description: "Maximum rows to return (default 10, max 50)"
              }
            },
            required: ["table", "select"]
          }
        }
      }
    ];
    
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
        tools: tools,
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

    const choice = data.choices[0];
    
    // Check if AI wants to call database tool
    if (choice.message.tool_calls && choice.message.tool_calls.length > 0) {
      console.log('🔧 AI requested database query');
      const toolCall = choice.message.tool_calls[0];
      const args = JSON.parse(toolCall.function.arguments);
      
      console.log('📊 Querying table:', args.table, 'with limit:', args.limit || 10);
      
      // Execute database query
      const { data: queryData, error } = await supabase
        .from(args.table)
        .select(args.select)
        .limit(args.limit || 10);
      
      if (error) {
        console.error('❌ Database query error:', error);
        return new Response(
          JSON.stringify({ generatedText: `Database error: ${error.message}` }),
          { headers: corsHeaders }
        );
      }
      
      console.log('✅ Query returned', queryData?.length, 'rows');
      
      // Call AI again with query results
      const followupResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
            choice.message,
            {
              role: 'tool',
              tool_call_id: toolCall.id,
              content: JSON.stringify(queryData)
            }
          ],
          max_tokens: 1500,
        }),
      });
      
      const followupData = await followupResponse.json();
      const generatedText = followupData.choices[0].message.content;
      console.log('📤 Returning response with query results');
      
      return new Response(
        JSON.stringify({ generatedText }),
        { headers: corsHeaders }
      );
    }

    // No tool call - return direct response
    const generatedText = choice.message.content;
    console.log('📤 Returning direct response, length:', generatedText?.length);
    
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
